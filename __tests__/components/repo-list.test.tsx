import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { RepoList } from '@/components/repo-list'
import type { GitHubRepo } from '@/types/github'
import { createRef } from 'react'

const makeRepo = (overrides: Partial<GitHubRepo> = {}): GitHubRepo => ({
  id: 1,
  name: 'repo-a',
  full_name: 'user/repo-a',
  description: 'Desc A',
  html_url: 'https://github.com/user/repo-a',
  stargazers_count: 100,
  forks_count: 10,
  language: 'TypeScript',
  updated_at: '2024-06-01T00:00:00Z',
  owner: { login: 'user' },
  ...overrides
})

describe('RepoList', () => {
  const repos: GitHubRepo[] = [
    makeRepo({
      id: 1,
      name: 'beta',
      stargazers_count: 50,
      updated_at: '2024-01-01T00:00:00Z'
    }),
    makeRepo({
      id: 2,
      name: 'alpha',
      stargazers_count: 200,
      updated_at: '2024-06-01T00:00:00Z'
    }),
    makeRepo({
      id: 3,
      name: 'gamma',
      stargazers_count: 10,
      updated_at: '2024-03-01T00:00:00Z'
    })
  ]

  const defaultProps = {
    repos,
    hasMore: false,
    isFetchingMore: false,
    loadMoreRef: createRef<HTMLDivElement>()
  }

  it('renders repo count', () => {
    render(<RepoList {...defaultProps} />)
    expect(screen.getByText('Repositories (3)')).toBeInTheDocument()
  })

  it('renders empty state when no repos', () => {
    render(<RepoList {...defaultProps} repos={[]} />)
    expect(screen.getByText('No repositories found.')).toBeInTheDocument()
  })

  it('renders all repos', () => {
    render(<RepoList {...defaultProps} />)
    expect(screen.getByText('beta')).toBeInTheDocument()
    expect(screen.getByText('alpha')).toBeInTheDocument()
    expect(screen.getByText('gamma')).toBeInTheDocument()
  })

  it('sorts by stars desc by default (highest first)', () => {
    render(<RepoList {...defaultProps} />)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveTextContent('alpha')
    expect(links[1]).toHaveTextContent('beta')
    expect(links[2]).toHaveTextContent('gamma')
  })

  it('toggles sort direction when clicking active sort field', () => {
    render(<RepoList {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /stars/i }))
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveTextContent('gamma')
  })

  it('sorts by name asc when Name is clicked', () => {
    render(<RepoList {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /name/i }))
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveTextContent('alpha')
    expect(links[1]).toHaveTextContent('beta')
    expect(links[2]).toHaveTextContent('gamma')
  })

  it('sorts by updated desc when Updated is clicked', () => {
    render(<RepoList {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /updated/i }))
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveTextContent('alpha')
  })

  it('shows loading indicator when fetching more', () => {
    render(<RepoList {...defaultProps} isFetchingMore={true} hasMore={true} />)
    expect(screen.getByText('Loading more repositories...')).toBeInTheDocument()
  })

  it('shows all loaded message when no more repos', () => {
    render(<RepoList {...defaultProps} hasMore={false} />)
    expect(
      screen.getByText('All repositories have been loaded')
    ).toBeInTheDocument()
  })

  it('switches sort field then toggles direction', () => {
    render(<RepoList {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /name/i }))
    fireEvent.click(screen.getByRole('button', { name: /name/i }))
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveTextContent('gamma')
  })
})
