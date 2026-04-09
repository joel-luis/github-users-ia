import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import UserDetailPage from '@/app/users/[username]/page'

const mockFetchUserDetail = jest.fn()
const mockFetchNextReposPage = jest.fn()
const mockState = {
  user: null,
  repos: [],
  isLoading: false,
  error: null,
  hasMoreRepos: false,
  isFetchingMoreRepos: false,
  username: '',
  reposPage: 1
}

jest.mock('@/store/use-github-user-detail-store', () => ({
  useGitHubUserDetailStore: (selector: any) => {
    const store = {
      state: mockState,
      actions: {
        fetchUserDetail: mockFetchUserDetail,
        fetchNextReposPage: mockFetchNextReposPage
      }
    }
    return selector(store)
  }
}))

jest.mock('next/navigation', () => ({
  useParams: () => ({ username: 'testuser' })
}))

jest.mock('next-themes', () => ({
  useTheme: () => ({ setTheme: jest.fn() })
}))

jest.mock('@/hooks/use-infinite-scroll', () => ({
  useInfiniteScroll: () => ({ current: null })
}))

const mockUser = {
  id: 1,
  login: 'testuser',
  avatar_url: 'https://example.com/avatar.jpg',
  html_url: 'https://github.com/testuser',
  name: 'Test User',
  bio: 'Developer',
  email: null,
  followers: 100,
  following: 50,
  public_repos: 10,
  location: 'Brazil',
  company: null,
  blog: null,
  created_at: '2020-01-01T00:00:00Z'
}

const mockRepos = [
  {
    id: 1,
    name: 'repo1',
    full_name: 'testuser/repo1',
    description: 'A repo',
    html_url: 'https://github.com/testuser/repo1',
    stargazers_count: 10,
    forks_count: 2,
    language: 'TS',
    updated_at: '2024-01-01T00:00:00Z',
    owner: { login: 'testuser' }
  }
]

describe('UserDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockState.user = null
    mockState.repos = []
    mockState.isLoading = false
    mockState.error = null
    mockState.hasMoreRepos = false
    mockState.isFetchingMoreRepos = false
  })

  it('calls fetchUserDetail on mount', () => {
    render(<UserDetailPage />)
    expect(mockFetchUserDetail).toHaveBeenCalledWith('testuser')
  })

  it('shows loading state', () => {
    mockState.isLoading = true
    render(<UserDetailPage />)
    expect(screen.getByText('Loading profile...')).toBeInTheDocument()
  })

  it('shows error state', () => {
    mockState.error = 'Something went wrong'
    render(<UserDetailPage />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /back to search/i })
    ).toBeInTheDocument()
  })

  it('renders user profile and repos', () => {
    mockState.user = mockUser as any
    mockState.repos = mockRepos as any
    render(<UserDetailPage />)
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('repo1')).toBeInTheDocument()
  })

  it('renders View on GitHub link', () => {
    mockState.user = mockUser as any
    mockState.repos = mockRepos as any
    render(<UserDetailPage />)
    const link = screen.getByRole('link', { name: /view on github/i })
    expect(link).toHaveAttribute('href', 'https://github.com/testuser')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders header with username', () => {
    render(<UserDetailPage />)
    expect(screen.getByText('testuser')).toBeInTheDocument()
  })
})
