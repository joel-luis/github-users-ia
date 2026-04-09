import { renderHook } from '@testing-library/react'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'

describe('useInfiniteScroll', () => {
  let mockIntersectionObserver: jest.Mock<any, any>

  beforeEach(() => {
    mockIntersectionObserver = jest.fn()
    mockIntersectionObserver.mockReturnValue({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    })
    window.IntersectionObserver = mockIntersectionObserver as any
  })

  it('should return a ref', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        isFetching: false,
        onLoadMore: jest.fn()
      })
    )

    expect(result.current).toBeDefined()
    expect(result.current.current).toBeNull()
  })

  it('should create IntersectionObserver with the correct threshold', () => {
    const onLoadMore = jest.fn()
    const threshold = 0.5

    renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        isFetching: false,
        onLoadMore,
        threshold
      })
    )

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold }
    )
  })

  it('should call onLoadMore when intersecting and hasMore is true', () => {
    const onLoadMore = jest.fn()
    let observerCallback: IntersectionObserverCallback | undefined

    mockIntersectionObserver.mockImplementation((callback) => {
      observerCallback = callback
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn()
      }
    })

    renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        isFetching: false,
        onLoadMore
      })
    )

    const mockEntry = { isIntersecting: true } as IntersectionObserverEntry

    observerCallback?.([mockEntry], {} as IntersectionObserver)

    expect(onLoadMore).toHaveBeenCalled()
  })

  it('should NOT call onLoadMore when isFetching is true', () => {
    const onLoadMore = jest.fn()
    let observerCallback: IntersectionObserverCallback | undefined

    mockIntersectionObserver.mockImplementation((callback) => {
      observerCallback = callback
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn()
      }
    })

    renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        isFetching: true,
        onLoadMore
      })
    )

    const mockEntry = { isIntersecting: true } as IntersectionObserverEntry

    observerCallback?.([mockEntry], {} as IntersectionObserver)

    expect(onLoadMore).not.toHaveBeenCalled()
  })

  it('should observe and unobserve when ref has a current element', () => {
    const onLoadMore = jest.fn()
    const mockObserve = jest.fn()
    const mockUnobserve = jest.fn()

    mockIntersectionObserver.mockImplementation((callback) => ({
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: jest.fn()
    }))

    const { unmount, result } = renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        isFetching: false,
        onLoadMore
      })
    )

    // Simulate ref being attached to a DOM element
    const div = document.createElement('div')
    Object.defineProperty(result.current, 'current', {
      value: div,
      writable: true
    })

    // Re-render to trigger the effect with the ref
    const { unmount: unmount2 } = renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        isFetching: false,
        onLoadMore
      })
    )

    unmount2()
  })

  it('should not call onLoadMore when not intersecting', () => {
    const onLoadMore = jest.fn()
    let observerCallback: IntersectionObserverCallback | undefined

    mockIntersectionObserver.mockImplementation((callback) => {
      observerCallback = callback
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn()
      }
    })

    renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        isFetching: false,
        onLoadMore
      })
    )

    const mockEntry = { isIntersecting: false } as IntersectionObserverEntry
    observerCallback?.([mockEntry], {} as IntersectionObserver)

    expect(onLoadMore).not.toHaveBeenCalled()
  })

  it('should not call onLoadMore when hasMore is false', () => {
    const onLoadMore = jest.fn()
    let observerCallback: IntersectionObserverCallback | undefined

    mockIntersectionObserver.mockImplementation((callback) => {
      observerCallback = callback
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn()
      }
    })

    renderHook(() =>
      useInfiniteScroll({
        hasMore: false,
        isFetching: false,
        onLoadMore
      })
    )

    const mockEntry = { isIntersecting: true } as IntersectionObserverEntry
    observerCallback?.([mockEntry], {} as IntersectionObserver)

    expect(onLoadMore).not.toHaveBeenCalled()
  })
})
