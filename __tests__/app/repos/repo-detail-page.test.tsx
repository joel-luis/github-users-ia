import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import RepoDetailPage from '@/app/repos/[owner]/[repo]/page'

const mockFetchRepoDetail = jest.fn()
const mockState = {
  repoData: null,
  isLoading: false,
  error: null,
  owner: '',
  repo: ''
}

jest.mock('@/store/use-github-repo-detail-store', () => ({
  useGitHubRepoDetailStore: (selector: any) => {
    const store = {
      state: mockState,
      actions: { fetchRepoDetail: mockFetchRepoDetail }
    }
    return selector(store)
  }
}))

jest.mock('next/navigation', () => ({
  useParams: () => ({ owner: 'testuser', repo: 'test-repo' })
}))

jest.mock('next-themes', () => ({
  useTheme: () => ({ setTheme: jest.fn() })
}))

const mockRepoData = {
  id: 1,
  name: 'test-repo',
  full_name: 'testuser/test-repo',
  description: 'A great repo',
  html_url: 'https://github.com/testuser/test-repo',
  stargazers_count: 1234,
  forks_count: 56,
  watchers_count: 78,
  open_issues_count: 9,
  language: 'TypeScript',
  default_branch: 'main',
  license: { name: 'MIT License', spdx_id: 'MIT' },
  topics: ['react', 'nextjs'],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-06-01T00:00:00Z',
  homepage: null,
  owner: { login: 'testuser' }
}

describe('RepoDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockState.repoData = null
    mockState.isLoading = false
    mockState.error = null
  })

  it('calls fetchRepoDetail on mount', () => {
    render(<RepoDetailPage />)
    expect(mockFetchRepoDetail).toHaveBeenCalledWith('testuser', 'test-repo')
  })

  it('shows loading state', () => {
    mockState.isLoading = true
    render(<RepoDetailPage />)
    expect(screen.getByText('Loading repository...')).toBeInTheDocument()
  })

  it('shows error state', () => {
    mockState.error = 'Something went wrong'
    render(<RepoDetailPage />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /back to testuser/i })
    ).toBeInTheDocument()
  })

  it('renders repo details', () => {
    mockState.repoData = mockRepoData as any
    render(<RepoDetailPage />)
    expect(screen.getAllByText('test-repo').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('A great repo')).toBeInTheDocument()
    expect(screen.getByText('1,234')).toBeInTheDocument()
    expect(screen.getByText('56')).toBeInTheDocument()
    expect(screen.getByText('78')).toBeInTheDocument()
    expect(screen.getByText('9')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('MIT License')).toBeInTheDocument()
    expect(screen.getByText('main')).toBeInTheDocument()
    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('nextjs')).toBeInTheDocument()
  })

  it('renders repo without description', () => {
    mockState.repoData = { ...mockRepoData, description: null } as any
    render(<RepoDetailPage />)
    expect(screen.getAllByText('test-repo').length).toBeGreaterThanOrEqual(1)
  })

  it('renders repo without license', () => {
    mockState.repoData = { ...mockRepoData, license: null } as any
    render(<RepoDetailPage />)
    expect(screen.queryByText('MIT License')).not.toBeInTheDocument()
  })

  it('renders repo without language', () => {
    mockState.repoData = { ...mockRepoData, language: null } as any
    render(<RepoDetailPage />)
    expect(screen.queryByText('Language:')).not.toBeInTheDocument()
  })

  it('renders repo without topics', () => {
    mockState.repoData = { ...mockRepoData, topics: [] } as any
    render(<RepoDetailPage />)
    expect(screen.queryByText('Topics')).not.toBeInTheDocument()
  })

  it('renders View on GitHub link', () => {
    mockState.repoData = mockRepoData as any
    render(<RepoDetailPage />)
    const link = screen.getByRole('link', { name: /view on github/i })
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/testuser/test-repo'
    )
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders header navigation links', () => {
    mockState.repoData = mockRepoData as any
    render(<RepoDetailPage />)
    const ownerLinks = screen.getAllByRole('link', { name: 'testuser' })
    expect(ownerLinks.length).toBeGreaterThan(0)
  })
})
