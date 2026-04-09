import { fetchGitHubRepoDetail } from '@/app/actions/github-repo-detail'

jest.mock('@/lib/axios', () => ({
  githubApi: {
    get: jest.fn()
  }
}))

import { githubApi } from '@/lib/axios'

const mockGet = githubApi.get as jest.Mock

describe('fetchGitHubRepoDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches repo detail from the GitHub API', async () => {
    const mockRepoData = {
      id: 1,
      name: 'test-repo',
      full_name: 'testuser/test-repo',
      description: 'A test repo',
      stargazers_count: 100,
      forks_count: 20,
      watchers_count: 50,
      open_issues_count: 5,
      language: 'TypeScript',
      default_branch: 'main',
      license: { name: 'MIT License', spdx_id: 'MIT' },
      topics: ['react', 'typescript'],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-06-01T00:00:00Z',
      html_url: 'https://github.com/testuser/test-repo',
      owner: { login: 'testuser' }
    }

    mockGet.mockResolvedValue({ data: mockRepoData })

    const result = await fetchGitHubRepoDetail('testuser', 'test-repo')

    expect(mockGet).toHaveBeenCalledWith('/repos/testuser/test-repo')
    expect(result).toEqual(mockRepoData)
  })

  it('encodes owner and repo in URL', async () => {
    mockGet.mockResolvedValue({ data: {} })

    await fetchGitHubRepoDetail('user name', 'repo name')

    expect(mockGet).toHaveBeenCalledWith('/repos/user%20name/repo%20name')
  })

  it('throws when request fails', async () => {
    mockGet.mockRejectedValue(new Error('Not Found'))

    await expect(fetchGitHubRepoDetail('user', 'repo')).rejects.toThrow(
      'Not Found'
    )
  })
})
