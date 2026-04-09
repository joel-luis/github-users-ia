import { fetchGitHubUsers } from '@/app/actions/github-users'

jest.mock('@/lib/axios', () => ({
  githubApi: {
    get: jest.fn()
  }
}))

import { githubApi } from '@/lib/axios'

const mockGet = githubApi.get as jest.Mock

describe('fetchGitHubUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns empty data when query is empty', async () => {
    const result = await fetchGitHubUsers('', 1)

    expect(result).toEqual({
      data: [],
      total: 0,
      hasMore: false,
      nextPage: 1
    })
  })

  it('fetches users from the GitHub API', async () => {
    const mockResponse = {
      items: [
        { id: 1, login: 'user1', avatar_url: '', html_url: '', type: 'User' }
      ],
      total_count: 1
    }

    mockGet.mockResolvedValue({ data: mockResponse })

    const result = await fetchGitHubUsers('test', 1)

    expect(result.data).toEqual(mockResponse.items)
    expect(result.total).toBe(1)
    expect(result.hasMore).toBe(false)
  })

  it('correctly calculates hasMore and nextPage', async () => {
    const mockResponse = {
      items: Array(20).fill({
        id: 1,
        login: 'user',
        avatar_url: '',
        html_url: '',
        type: 'User'
      }),
      total_count: 50
    }

    mockGet.mockResolvedValue({ data: mockResponse })

    const result = await fetchGitHubUsers('test', 1)

    expect(result.hasMore).toBe(true)
    expect(result.nextPage).toBe(2)
  })

  it('throws an error when request fails', async () => {
    mockGet.mockRejectedValue(new Error('Request failed'))

    await expect(fetchGitHubUsers('test', 1)).rejects.toThrow('Request failed')
  })

  it('correctly encodes query parameters', async () => {
    const mockResponse = {
      items: [],
      total_count: 0
    }

    mockGet.mockResolvedValue({ data: mockResponse })

    await fetchGitHubUsers('test user', 1)

    expect(mockGet).toHaveBeenCalledWith('/search/users', {
      params: {
        q: 'test user',
        per_page: 20,
        page: 1
      }
    })
  })
})
