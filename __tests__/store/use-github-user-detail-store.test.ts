import { renderHook, act, waitFor } from '@testing-library/react'
import { useGitHubUserDetailStore } from '@/store/use-github-user-detail-store'
import { fetchGitHubUserDetail } from '@/app/actions/github-user-detail'
import { fetchGitHubRepos } from '@/app/actions/github-repos'

jest.mock('@/app/actions/github-user-detail')
jest.mock('@/app/actions/github-repos')

const mockFetchUser = fetchGitHubUserDetail as jest.MockedFunction<
  typeof fetchGitHubUserDetail
>
const mockFetchRepos = fetchGitHubRepos as jest.MockedFunction<
  typeof fetchGitHubRepos
>

const mockUser = {
  id: 1,
  login: 'testuser',
  avatar_url: 'https://example.com/avatar.jpg',
  html_url: 'https://github.com/testuser',
  name: 'Test User',
  bio: 'Dev',
  email: null,
  followers: 100,
  following: 50,
  public_repos: 10,
  location: null,
  company: null,
  blog: null,
  created_at: '2020-01-01T00:00:00Z'
}

const mockRepos = [
  {
    id: 1,
    name: 'repo1',
    full_name: 'testuser/repo1',
    description: '',
    html_url: '',
    stargazers_count: 10,
    forks_count: 2,
    language: 'TS',
    updated_at: '2024-01-01T00:00:00Z',
    owner: { login: 'testuser' }
  }
]

describe('useGitHubUserDetailStore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const { result } = renderHook(() => useGitHubUserDetailStore())
    act(() => {
      result.current.actions.reset()
    })
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useGitHubUserDetailStore())
    expect(result.current.state.user).toBeNull()
    expect(result.current.state.repos).toEqual([])
    expect(result.current.state.isLoading).toBe(false)
    expect(result.current.state.error).toBeNull()
  })

  it('fetches user detail and repos successfully', async () => {
    mockFetchUser.mockResolvedValue(mockUser)
    mockFetchRepos.mockResolvedValue({
      data: mockRepos as any,
      hasMore: true,
      nextPage: 2
    })

    const { result } = renderHook(() => useGitHubUserDetailStore())

    act(() => {
      result.current.actions.fetchUserDetail('testuser')
    })

    expect(result.current.state.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.state.isLoading).toBe(false)
    })

    expect(result.current.state.user).toEqual(mockUser)
    expect(result.current.state.repos).toEqual(mockRepos)
    expect(result.current.state.hasMoreRepos).toBe(true)
    expect(result.current.state.reposPage).toBe(2)
  })

  it('handles fetch error with Error instance', async () => {
    mockFetchUser.mockRejectedValue(new Error('User not found'))

    const { result } = renderHook(() => useGitHubUserDetailStore())

    act(() => {
      result.current.actions.fetchUserDetail('testuser')
    })

    await waitFor(() => {
      expect(result.current.state.error).toBe('User not found')
    })

    expect(result.current.state.isLoading).toBe(false)
  })

  it('handles fetch error with non-Error', async () => {
    mockFetchUser.mockRejectedValue('some string error')

    const { result } = renderHook(() => useGitHubUserDetailStore())

    act(() => {
      result.current.actions.fetchUserDetail('testuser')
    })

    await waitFor(() => {
      expect(result.current.state.error).toBe(
        'User not found or failed to load data.'
      )
    })
  })

  it('does not re-fetch if same username and user exists', async () => {
    mockFetchUser.mockResolvedValue(mockUser)
    mockFetchRepos.mockResolvedValue({
      data: mockRepos as any,
      hasMore: false,
      nextPage: 2
    })

    const { result } = renderHook(() => useGitHubUserDetailStore())

    await act(async () => {
      await result.current.actions.fetchUserDetail('testuser')
    })

    await act(async () => {
      await result.current.actions.fetchUserDetail('testuser')
    })

    expect(mockFetchUser).toHaveBeenCalledTimes(1)
  })

  it('fetches next repos page', async () => {
    mockFetchUser.mockResolvedValue(mockUser)
    mockFetchRepos
      .mockResolvedValueOnce({
        data: mockRepos as any,
        hasMore: true,
        nextPage: 2
      })
      .mockResolvedValueOnce({
        data: [
          {
            id: 2,
            name: 'repo2',
            full_name: 'testuser/repo2',
            description: '',
            html_url: '',
            stargazers_count: 5,
            forks_count: 1,
            language: 'JS',
            updated_at: '2024-02-01T00:00:00Z',
            owner: { login: 'testuser' }
          }
        ] as any,
        hasMore: false,
        nextPage: 3
      })

    const { result } = renderHook(() => useGitHubUserDetailStore())

    await act(async () => {
      await result.current.actions.fetchUserDetail('testuser')
    })

    await act(async () => {
      await result.current.actions.fetchNextReposPage()
    })

    await waitFor(() => {
      expect(result.current.state.repos).toHaveLength(2)
    })

    expect(result.current.state.hasMoreRepos).toBe(false)
  })

  it('does not fetch next page when no more repos', async () => {
    mockFetchUser.mockResolvedValue(mockUser)
    mockFetchRepos.mockResolvedValue({
      data: mockRepos as any,
      hasMore: false,
      nextPage: 2
    })

    const { result } = renderHook(() => useGitHubUserDetailStore())

    await act(async () => {
      await result.current.actions.fetchUserDetail('testuser')
    })

    await act(async () => {
      await result.current.actions.fetchNextReposPage()
    })

    expect(mockFetchRepos).toHaveBeenCalledTimes(1)
  })

  it('does not fetch next page when already fetching', async () => {
    mockFetchUser.mockResolvedValue(mockUser)
    mockFetchRepos.mockResolvedValue({
      data: mockRepos as any,
      hasMore: true,
      nextPage: 2
    })

    const { result } = renderHook(() => useGitHubUserDetailStore())

    await act(async () => {
      await result.current.actions.fetchUserDetail('testuser')
    })

    // Simulate isFetchingMore already true
    act(() => {
      useGitHubUserDetailStore.setState(({ state }) => ({
        state: { ...state, isFetchingMoreRepos: true }
      }))
    })

    await act(async () => {
      await result.current.actions.fetchNextReposPage()
    })

    // Should still only have the initial call
    expect(mockFetchRepos).toHaveBeenCalledTimes(1)
  })

  it('does not fetch next page when no username', async () => {
    const { result } = renderHook(() => useGitHubUserDetailStore())

    act(() => {
      useGitHubUserDetailStore.setState(({ state }) => ({
        state: { ...state, hasMoreRepos: true, username: '' }
      }))
    })

    await act(async () => {
      await result.current.actions.fetchNextReposPage()
    })

    expect(mockFetchRepos).not.toHaveBeenCalled()
  })

  it('handles fetch next page error with Error instance', async () => {
    mockFetchUser.mockResolvedValue(mockUser)
    mockFetchRepos
      .mockResolvedValueOnce({
        data: mockRepos as any,
        hasMore: true,
        nextPage: 2
      })
      .mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useGitHubUserDetailStore())

    await act(async () => {
      await result.current.actions.fetchUserDetail('testuser')
    })

    await act(async () => {
      await result.current.actions.fetchNextReposPage()
    })

    await waitFor(() => {
      expect(result.current.state.error).toBe('Network error')
    })

    expect(result.current.state.isFetchingMoreRepos).toBe(false)
  })

  it('handles fetch next page error with non-Error', async () => {
    mockFetchUser.mockResolvedValue(mockUser)
    mockFetchRepos
      .mockResolvedValueOnce({
        data: mockRepos as any,
        hasMore: true,
        nextPage: 2
      })
      .mockRejectedValueOnce('string error')

    const { result } = renderHook(() => useGitHubUserDetailStore())

    await act(async () => {
      await result.current.actions.fetchUserDetail('testuser')
    })

    await act(async () => {
      await result.current.actions.fetchNextReposPage()
    })

    await waitFor(() => {
      expect(result.current.state.error).toBe(
        'Failed to load more repositories.'
      )
    })
  })

  it('resets state', async () => {
    mockFetchUser.mockResolvedValue(mockUser)
    mockFetchRepos.mockResolvedValue({
      data: mockRepos as any,
      hasMore: false,
      nextPage: 2
    })

    const { result } = renderHook(() => useGitHubUserDetailStore())

    await act(async () => {
      await result.current.actions.fetchUserDetail('testuser')
    })

    act(() => {
      result.current.actions.reset()
    })

    expect(result.current.state.user).toBeNull()
    expect(result.current.state.repos).toEqual([])
    expect(result.current.state.username).toBe('')
  })
})
