import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { RepoSortControls } from '@/components/repo-sort-controls'

describe('RepoSortControls', () => {
  const defaultProps = {
    sortField: 'stars' as const,
    sortDirection: 'desc' as const,
    onSortChange: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all sort buttons', () => {
    render(<RepoSortControls {...defaultProps} />)
    expect(screen.getByRole('button', { name: /stars/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /name/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /updated/i })).toBeInTheDocument()
  })

  it('renders "Sort by:" label', () => {
    render(<RepoSortControls {...defaultProps} />)
    expect(screen.getByText('Sort by:')).toBeInTheDocument()
  })

  it('calls onSortChange when a sort button is clicked', () => {
    render(<RepoSortControls {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /name/i }))
    expect(defaultProps.onSortChange).toHaveBeenCalledWith('name')
  })

  it('calls onSortChange with current field to toggle direction', () => {
    render(<RepoSortControls {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /stars/i }))
    expect(defaultProps.onSortChange).toHaveBeenCalledWith('stars')
  })

  it('renders with asc direction', () => {
    render(<RepoSortControls {...defaultProps} sortDirection="asc" />)
    expect(screen.getByRole('button', { name: /stars/i })).toBeInTheDocument()
  })
})
