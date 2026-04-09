import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { UserProfile } from '@/components/user-profile'
import type { GitHubUserDetail } from '@/types/github'

describe('UserProfile', () => {
  const baseUser: GitHubUserDetail = {
    id: 1,
    login: 'testuser',
    avatar_url: 'https://example.com/avatar.jpg',
    html_url: 'https://github.com/testuser',
    name: 'Test User',
    bio: 'A cool developer',
    email: 'test@example.com',
    followers: 1500,
    following: 200,
    public_repos: 42,
    location: 'São Paulo, Brazil',
    company: '@mycompany',
    blog: 'https://testuser.dev',
    created_at: '2020-06-15T00:00:00Z'
  }

  it('renders user name and login', () => {
    render(<UserProfile user={baseUser} />)
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('@testuser')).toBeInTheDocument()
  })

  it('renders login as name when name is null', () => {
    render(<UserProfile user={{ ...baseUser, name: null }} />)
    expect(screen.getByText('testuser')).toBeInTheDocument()
    expect(screen.queryByText('@testuser')).not.toBeInTheDocument()
  })

  it('renders bio', () => {
    render(<UserProfile user={baseUser} />)
    expect(screen.getByText('A cool developer')).toBeInTheDocument()
  })

  it('does not render bio when null', () => {
    render(<UserProfile user={{ ...baseUser, bio: null }} />)
    expect(screen.queryByText('A cool developer')).not.toBeInTheDocument()
  })

  it('renders followers and following counts', () => {
    render(<UserProfile user={baseUser} />)
    expect(screen.getByText('1,500')).toBeInTheDocument()
    expect(screen.getByText('200')).toBeInTheDocument()
    expect(screen.getByText('followers')).toBeInTheDocument()
    expect(screen.getByText('following')).toBeInTheDocument()
  })

  it('renders email as a mailto link', () => {
    render(<UserProfile user={baseUser} />)
    const emailLink = screen.getByText('test@example.com')
    expect(emailLink.closest('a')).toHaveAttribute(
      'href',
      'mailto:test@example.com'
    )
  })

  it('does not render email when null', () => {
    render(<UserProfile user={{ ...baseUser, email: null }} />)
    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument()
  })

  it('renders location', () => {
    render(<UserProfile user={baseUser} />)
    expect(screen.getByText('São Paulo, Brazil')).toBeInTheDocument()
  })

  it('does not render location when null', () => {
    render(<UserProfile user={{ ...baseUser, location: null }} />)
    expect(screen.queryByText('São Paulo, Brazil')).not.toBeInTheDocument()
  })

  it('renders company', () => {
    render(<UserProfile user={baseUser} />)
    expect(screen.getByText('@mycompany')).toBeInTheDocument()
  })

  it('does not render company when null', () => {
    render(<UserProfile user={{ ...baseUser, company: null }} />)
    expect(screen.queryByText('@mycompany')).not.toBeInTheDocument()
  })

  it('renders blog link with https prefix', () => {
    render(<UserProfile user={baseUser} />)
    const blogLink = screen.getByText('https://testuser.dev')
    expect(blogLink.closest('a')).toHaveAttribute(
      'href',
      'https://testuser.dev'
    )
    expect(blogLink.closest('a')).toHaveAttribute('target', '_blank')
  })

  it('renders blog link with auto https prefix when missing', () => {
    render(<UserProfile user={{ ...baseUser, blog: 'testuser.dev' }} />)
    const blogLink = screen.getByText('testuser.dev')
    expect(blogLink.closest('a')).toHaveAttribute(
      'href',
      'https://testuser.dev'
    )
  })

  it('does not render blog when null', () => {
    render(<UserProfile user={{ ...baseUser, blog: null }} />)
    expect(screen.queryByText('https://testuser.dev')).not.toBeInTheDocument()
  })

  it('renders join date', () => {
    render(<UserProfile user={baseUser} />)
    expect(screen.getByText('Joined June 2020')).toBeInTheDocument()
  })

  it('renders avatar', () => {
    render(<UserProfile user={baseUser} />)
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })
})
