import { renderHook, act, waitFor } from '@testing-library/react'
import { useGitHubRepoDetailStore } from '@/store/use-github-repo-detail-store'
import { fetchGitHubRepoDetail } from '@/app/actions/github-repo-detail'

jest.mock('@/app/actions/github-repo-detail')

const mockFetch = fetchGitHubRepoDetail as jest.MockedFunction<
  typeof fetchGitHubRepoDetail
>

const mockRepoData = {
  id: 1,
  name: 'test-repo',
  full_name: 'testuser/test-repo',
  description: 'Test',
  html_url: 'https://github.com/testuser/test-repo',
  stargazers_count: 100,
  forks_count: 20,
  watchers_count: 50,
  open_issues_count: 5,
  language: 'TypeScript',
  updated_at: '2024-06-01T00:00:00Z',
  default_branch: 'main',
  license: { name: 'MIT', spdx_id: 'MIT' },
  topics: ['react'],
  created_at: '2024-01-01T00:00:00Z',
  homepage: null,
  owner: { login: 'testuser' }
}

describe('useGitHubRepoDetailStore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const { result } = renderHook(() => useGitHubRepoDetailStore())
    act(() => {
      result.current.actions.reset()
    })
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useGitHubRepoDetailStore())
    expect(result.current.state.repoData).toBeNull()
    expect(result.current.state.isLoading).toBe(false)
    expect(result.current.state.error).toBeNull()
    expect(result.current.state.owner).toBe('')
    expect(result.current.state.repo).toBe('')
  })

  it('fetches repo detail successfully', async () => {
    mockFetch.mockResolvedValue(mockRepoData as any)

    const { result } = renderHook(() => useGitHubRepoDetailStore())

    act(() => {
      result.current.actions.fetchRepoDetail('testuser', 'test-repo')
    })

    expect(result.current.state.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.state.isLoading).toBe(false)
    })

    expect(result.current.state.repoData).toEqual(mockRepoData)
    expect(result.current.state.error).toBeNull()
  })

  it('handles fetch error with Error instance', async () => {
    mockFetch.mockRejectedValue(new Error('Not Found'))

    const { result } = renderHook(() => useGitHubRepoDetailStore())

    act(() => {
      result.current.actions.fetchRepoDetail('testuser', 'test-repo')
    })

    await waitFor(() => {
      expect(result.current.state.error).toBe('Not Found')
    })

    expect(result.current.state.isLoading).toBe(false)
  })

  it('handles fetch error with non-Error', async () => {
    mockFetch.mockRejectedValue('some error')

    const { result } = renderHook(() => useGitHubRepoDetailStore())

    act(() => {
      result.current.actions.fetchRepoDetail('testuser', 'test-repo')
    })

    await waitFor(() => {
      expect(result.current.state.error).toBe(
        'Repository not found or failed to load.'
      )
    })
  })

  it('does not re-fetch if same owner/repo and data exists', async () => {
    mockFetch.mockResolvedValue(mockRepoData as any)

    const { result } = renderHook(() => useGitHubRepoDetailStore())

    await act(async () => {
      await result.current.actions.fetchRepoDetail('testuser', 'test-repo')
    })

    await act(async () => {
      await result.current.actions.fetchRepoDetail('testuser', 'test-repo')
    })

    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('re-fetches if different owner/repo', async () => {
    mockFetch.mockResolvedValue(mockRepoData as any)

    const { result } = renderHook(() => useGitHubRepoDetailStore())

    await act(async () => {
      await result.current.actions.fetchRepoDetail('testuser', 'test-repo')
    })

    await act(async () => {
      await result.current.actions.fetchRepoDetail('other', 'other-repo')
    })

    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('resets state', async () => {
    mockFetch.mockResolvedValue(mockRepoData as any)

    const { result } = renderHook(() => useGitHubRepoDetailStore())

    await act(async () => {
      await result.current.actions.fetchRepoDetail('testuser', 'test-repo')
    })

    act(() => {
      result.current.actions.reset()
    })

    expect(result.current.state.repoData).toBeNull()
    expect(result.current.state.owner).toBe('')
    expect(result.current.state.repo).toBe('')
  })
})
