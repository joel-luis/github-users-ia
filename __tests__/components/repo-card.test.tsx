import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { RepoCard } from '@/components/repo-card'
import type { GitHubRepo } from '@/types/github'

describe('RepoCard', () => {
  const mockRepo: GitHubRepo = {
    id: 1,
    name: 'test-repo',
    full_name: 'testuser/test-repo',
    description: 'A test repository',
    html_url: 'https://github.com/testuser/test-repo',
    stargazers_count: 1234,
    forks_count: 56,
    language: 'TypeScript',
    updated_at: '2024-01-15T00:00:00Z',
    owner: { login: 'testuser' }
  }

  it('renders repo name as a link', () => {
    render(<RepoCard repo={mockRepo} />)
    const link = screen.getByRole('link', { name: 'test-repo' })
    expect(link).toHaveAttribute('href', '/repos/testuser/test-repo')
  })

  it('renders description', () => {
    render(<RepoCard repo={mockRepo} />)
    expect(screen.getByText('A test repository')).toBeInTheDocument()
  })

  it('renders fallback when no description', () => {
    render(<RepoCard repo={{ ...mockRepo, description: null }} />)
    expect(screen.getByText('No description provided.')).toBeInTheDocument()
  })

  it('renders star and fork counts', () => {
    render(<RepoCard repo={mockRepo} />)
    expect(screen.getByText('1,234')).toBeInTheDocument()
    expect(screen.getByText('56')).toBeInTheDocument()
  })

  it('renders language badge when language exists', () => {
    render(<RepoCard repo={mockRepo} />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('does not render language badge when language is null', () => {
    render(<RepoCard repo={{ ...mockRepo, language: null }} />)
    expect(screen.queryByText('TypeScript')).not.toBeInTheDocument()
  })

  it('renders updated date', () => {
    render(<RepoCard repo={mockRepo} />)
    const dateText = new Date('2024-01-15T00:00:00Z').toLocaleDateString()
    expect(screen.getByText(`Updated ${dateText}`)).toBeInTheDocument()
  })
})
