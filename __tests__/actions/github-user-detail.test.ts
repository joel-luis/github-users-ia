import { fetchGitHubUserDetail } from '@/app/actions/github-user-detail'

jest.mock('@/lib/axios', () => ({
  githubApi: {
    get: jest.fn()
  }
}))

import { githubApi } from '@/lib/axios'

const mockGet = githubApi.get as jest.Mock

describe('fetchGitHubUserDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches user detail from the GitHub API', async () => {
    const mockUser = {
      id: 1,
      login: 'testuser',
      name: 'Test User',
      avatar_url: 'https://example.com/avatar.jpg',
      html_url: 'https://github.com/testuser',
      bio: 'A developer',
      followers: 100,
      following: 50,
      public_repos: 30,
      location: 'Brazil',
      company: null,
      blog: null,
      email: null,
      created_at: '2020-01-01T00:00:00Z'
    }

    mockGet.mockResolvedValue({ data: mockUser })

    const result = await fetchGitHubUserDetail('testuser')

    expect(mockGet).toHaveBeenCalledWith('/users/testuser')
    expect(result).toEqual(mockUser)
  })

  it('encodes username in URL', async () => {
    mockGet.mockResolvedValue({ data: {} })

    await fetchGitHubUserDetail('user name')

    expect(mockGet).toHaveBeenCalledWith('/users/user%20name')
  })

  it('throws when request fails', async () => {
    mockGet.mockRejectedValue(new Error('User not found'))

    await expect(fetchGitHubUserDetail('testuser')).rejects.toThrow(
      'User not found'
    )
  })
})
