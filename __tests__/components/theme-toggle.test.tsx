import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeToggle } from '@/components/theme-toggle'

const mockSetTheme = jest.fn()

jest.mock('next-themes', () => ({
  useTheme: () => ({
    setTheme: mockSetTheme
  })
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders toggle button', () => {
    render(<ThemeToggle />)
    expect(
      screen.getByRole('button', { name: /toggle theme/i })
    ).toBeInTheDocument()
  })

  it('renders sun and moon icons with sr-only text', () => {
    render(<ThemeToggle />)
    expect(screen.getByText('Toggle theme')).toBeInTheDocument()
  })
})
