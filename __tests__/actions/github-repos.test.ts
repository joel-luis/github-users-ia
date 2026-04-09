import { fetchGitHubRepos } from '@/app/actions/github-repos'

jest.mock('@/lib/axios', () => ({
  githubApi: {
    get: jest.fn()
  }
}))

import { githubApi } from '@/lib/axios'

const mockGet = githubApi.get as jest.Mock

describe('fetchGitHubRepos', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches repos from the GitHub API', async () => {
    const mockRepos = [
      { id: 1, name: 'repo1' },
      { id: 2, name: 'repo2' }
    ]

    mockGet.mockResolvedValue({
      data: mockRepos,
      headers: { link: '' }
    })

    const result = await fetchGitHubRepos('testuser', 1)

    expect(mockGet).toHaveBeenCalledWith('/users/testuser/repos', {
      params: { per_page: 10, sort: 'updated', page: 1 }
    })
    expect(result.data).toEqual(mockRepos)
    expect(result.hasMore).toBe(false)
    expect(result.nextPage).toBe(2)
  })

  it('detects hasMore from link header', async () => {
    mockGet.mockResolvedValue({
      data: [],
      headers: {
        link: '<https://api.github.com/users/test/repos?page=2>; rel="next"'
      }
    })

    const result = await fetchGitHubRepos('testuser', 1)

    expect(result.hasMore).toBe(true)
  })

  it('defaults page to 1', async () => {
    mockGet.mockResolvedValue({
      data: [],
      headers: { link: '' }
    })

    await fetchGitHubRepos('testuser')

    expect(mockGet).toHaveBeenCalledWith('/users/testuser/repos', {
      params: { per_page: 10, sort: 'updated', page: 1 }
    })
  })

  it('encodes username in URL', async () => {
    mockGet.mockResolvedValue({
      data: [],
      headers: { link: '' }
    })

    await fetchGitHubRepos('user name')

    expect(mockGet).toHaveBeenCalledWith('/users/user%20name/repos', {
      params: { per_page: 10, sort: 'updated', page: 1 }
    })
  })

  it('throws when request fails', async () => {
    mockGet.mockRejectedValue(new Error('Network Error'))

    await expect(fetchGitHubRepos('testuser')).rejects.toThrow('Network Error')
  })
})
