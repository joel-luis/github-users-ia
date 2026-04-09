import { renderHook, act, waitFor } from '@testing-library/react'
import { useGitHubUsersStore } from '@/store/use-github-users-store'
import { fetchGitHubUsers } from '@/app/actions/github-users'

jest.mock('@/app/actions/github-users')

const mockFetchGitHubUsers = fetchGitHubUsers as jest.MockedFunction<
  typeof fetchGitHubUsers
>

describe('useGitHubUsersStore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const { result } = renderHook(() => useGitHubUsersStore())
    act(() => {
      result.current.state = {
        searchQuery: '',
        users: [],
        total: 0,
        page: 1,
        hasMore: false,
        isLoading: false,
        isFetchingMore: false,
        error: null
      }
    })
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useGitHubUsersStore())

    expect(result.current.state.searchQuery).toBe('')
    expect(result.current.state.users).toEqual([])
    expect(result.current.state.total).toBe(0)
    expect(result.current.state.isLoading).toBe(false)
  })

  it('should update the search query', () => {
    const { result } = renderHook(() => useGitHubUsersStore())

    act(() => {
      result.current.actions.setSearchQuery('test')
    })

    expect(result.current.state.searchQuery).toBe('test')
  })

  it('should fetch users when the search query is set', async () => {
    const mockUsers = [
      {
        id: 1,
        login: 'user1',
        avatar_url: '',
        html_url: '',
        type: 'User',
        score: 1
      }
    ]

    mockFetchGitHubUsers.mockResolvedValue({
      data: mockUsers,
      total: 1,
      hasMore: false,
      nextPage: 2
    })

    const { result } = renderHook(() => useGitHubUsersStore())

    act(() => {
      result.current.actions.setSearchQuery('test')
    })

    await waitFor(() => {
      expect(result.current.state.users.length).toBeGreaterThan(0)
    })

    expect(result.current.state.users).toEqual(mockUsers)
    expect(result.current.state.total).toBe(1)
  })

  it('should handle fetch errors', async () => {
    mockFetchGitHubUsers.mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useGitHubUsersStore())

    act(() => {
      result.current.actions.setSearchQuery('test')
    })

    await waitFor(
      () => {
        expect(result.current.state.error).toBe('API Error')
      },
      { timeout: 1000 }
    )
  })

  it('should fetch the next page', async () => {
    const mockUsersPage1 = [
      {
        id: 1,
        login: 'user1',
        avatar_url: '',
        html_url: '',
        type: 'User',
        score: 1.0
      }
    ]
    const mockUsersPage2 = [
      {
        id: 2,
        login: 'user2',
        avatar_url: '',
        html_url: '',
        type: 'User',
        score: 2.0
      }
    ]

    mockFetchGitHubUsers
      .mockResolvedValueOnce({
        data: mockUsersPage1,
        total: 2,
        hasMore: true,
        nextPage: 2
      })
      .mockResolvedValueOnce({
        data: mockUsersPage2,
        total: 2,
        hasMore: false,
        nextPage: 3
      })

    const { result } = renderHook(() => useGitHubUsersStore())

    act(() => {
      result.current.actions.setSearchQuery('test')
    })

    await waitFor(() => {
      expect(result.current.state.users).toHaveLength(1)
    })

    act(() => {
      result.current.actions.fetchNextPage()
    })

    await waitFor(() => {
      expect(result.current.state.users).toHaveLength(2)
    })
  })

  it('should clear state when search query is empty', async () => {
    mockFetchGitHubUsers.mockResolvedValue({
      data: [
        {
          id: 1,
          login: 'user1',
          avatar_url: '',
          html_url: '',
          type: 'User',
          score: 1
        }
      ],
      total: 1,
      hasMore: false,
      nextPage: 2
    })

    const { result } = renderHook(() => useGitHubUsersStore())

    act(() => {
      result.current.actions.setSearchQuery('test')
    })

    await waitFor(() => {
      expect(result.current.state.users).toHaveLength(1)
    })

    act(() => {
      result.current.actions.setSearchQuery('')
    })

    await waitFor(() => {
      expect(result.current.state.users).toEqual([])
    })
  })

  it('should handle non-Error fetch error', async () => {
    mockFetchGitHubUsers.mockRejectedValue('unknown error')

    const { result } = renderHook(() => useGitHubUsersStore())

    act(() => {
      result.current.actions.setSearchQuery('test')
    })

    await waitFor(
      () => {
        expect(result.current.state.error).toBe('An error occurred')
      },
      { timeout: 1000 }
    )
  })

  it('should not fetch next page when no more results', async () => {
    mockFetchGitHubUsers.mockResolvedValue({
      data: [
        {
          id: 1,
          login: 'user1',
          avatar_url: '',
          html_url: '',
          type: 'User',
          score: 1
        }
      ],
      total: 1,
      hasMore: false,
      nextPage: 2
    })

    const { result } = renderHook(() => useGitHubUsersStore())

    act(() => {
      result.current.actions.setSearchQuery('test')
    })

    await waitFor(() => {
      expect(result.current.state.users).toHaveLength(1)
    })

    await act(async () => {
      await result.current.actions.fetchNextPage()
    })

    expect(mockFetchGitHubUsers).toHaveBeenCalledTimes(1)
  })

  it('should handle fetch next page error', async () => {
    mockFetchGitHubUsers
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            login: 'user1',
            avatar_url: '',
            html_url: '',
            type: 'User',
            score: 1
          }
        ],
        total: 2,
        hasMore: true,
        nextPage: 2
      })
      .mockRejectedValueOnce(new Error('Network Error'))

    const { result } = renderHook(() => useGitHubUsersStore())

    act(() => {
      result.current.actions.setSearchQuery('test')
    })

    await waitFor(() => {
      expect(result.current.state.users).toHaveLength(1)
    })

    await act(async () => {
      await result.current.actions.fetchNextPage()
    })

    await waitFor(() => {
      expect(result.current.state.error).toBe('Network Error')
    })

    expect(result.current.state.isFetchingMore).toBe(false)
  })

  it('should handle fetch next page non-Error', async () => {
    mockFetchGitHubUsers
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            login: 'user1',
            avatar_url: '',
            html_url: '',
            type: 'User',
            score: 1
          }
        ],
        total: 2,
        hasMore: true,
        nextPage: 2
      })
      .mockRejectedValueOnce('string error')

    const { result } = renderHook(() => useGitHubUsersStore())

    act(() => {
      result.current.actions.setSearchQuery('test')
    })

    await waitFor(() => {
      expect(result.current.state.users).toHaveLength(1)
    })

    await act(async () => {
      await result.current.actions.fetchNextPage()
    })

    await waitFor(() => {
      expect(result.current.state.error).toBe('An error occurred')
    })
  })

  it('should init from URL with query param', async () => {
    mockFetchGitHubUsers.mockResolvedValue({
      data: [
        {
          id: 1,
          login: 'user1',
          avatar_url: '',
          html_url: '',
          type: 'User',
          score: 1
        }
      ],
      total: 1,
      hasMore: false,
      nextPage: 2
    })

    delete (window as any).location
    ;(window as any).location = new URL('http://localhost?q=fromurl')
    window.history.replaceState = jest.fn()

    const { result } = renderHook(() => useGitHubUsersStore())

    act(() => {
      result.current.actions.initFromUrl()
    })

    await waitFor(() => {
      expect(result.current.state.searchQuery).toBe('fromurl')
    })
  })

  it('should init from URL without query param but with existing search query', async () => {
    mockFetchGitHubUsers.mockResolvedValue({
      data: [
        {
          id: 1,
          login: 'user1',
          avatar_url: '',
          html_url: '',
          type: 'User',
          score: 1
        }
      ],
      total: 1,
      hasMore: false,
      nextPage: 2
    })

    delete (window as any).location
    ;(window as any).location = new URL('http://localhost')
    window.history.replaceState = jest.fn()

    const { result } = renderHook(() => useGitHubUsersStore())

    act(() => {
      useGitHubUsersStore.setState(({ state }) => ({
        state: { ...state, searchQuery: 'existing', users: [] }
      }))
    })

    act(() => {
      result.current.actions.initFromUrl()
    })

    await waitFor(() => {
      expect(result.current.state.searchQuery).toBe('existing')
    })

    expect(window.history.replaceState).toHaveBeenCalled()
  })

  it('should not re-fetch from URL if same query and users exist', async () => {
    mockFetchGitHubUsers.mockResolvedValue({
      data: [
        {
          id: 1,
          login: 'user1',
          avatar_url: '',
          html_url: '',
          type: 'User',
          score: 1
        }
      ],
      total: 1,
      hasMore: false,
      nextPage: 2
    })

    delete (window as any).location
    ;(window as any).location = new URL('http://localhost?q=test')
    window.history.replaceState = jest.fn()

    const { result } = renderHook(() => useGitHubUsersStore())

    act(() => {
      useGitHubUsersStore.setState(({ state }) => ({
        state: {
          ...state,
          searchQuery: 'test',
          users: [
            {
              id: 1,
              login: 'u',
              avatar_url: '',
              html_url: '',
              type: 'User',
              score: 1
            }
          ]
        }
      }))
    })

    act(() => {
      result.current.actions.initFromUrl()
    })

    // Should not trigger a new fetch since same query and users exist
    expect(mockFetchGitHubUsers).not.toHaveBeenCalled()
  })
})
