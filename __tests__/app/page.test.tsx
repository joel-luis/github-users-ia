import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'
import { useGitHubUsersStore } from '@/store/use-github-users-store'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'

// Mock the hooks
jest.mock('@/store/use-github-users-store')
jest.mock('@/hooks/use-infinite-scroll')
jest.mock('@/store/use-ai-search-store', () => ({
  useAISearchStore: jest.fn((selector: any) =>
    selector({
      state: {
        isOpen: false,
        prompt: '',
        isLoading: false,
        response: null,
        error: null
      },
      actions: {
        open: jest.fn(),
        close: jest.fn(),
        setPrompt: jest.fn(),
        submitPrompt: jest.fn(),
        reset: jest.fn()
      }
    })
  )
}))
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/'
}))
jest.mock('@radix-ui/react-dropdown-menu', () => {
  return {
    Root: ({ children }: any) => <div>{children}</div>,
    Trigger: ({ children }: any) => <div>{children}</div>,
    Content: ({ children }: any) => <div>{children}</div>,
    Item: ({ children }: any) => <div>{children}</div>,
    CheckboxItem: ({ children }: any) => <div>{children}</div>,
    RadioItem: ({ children }: any) => <div>{children}</div>,
    Sub: ({ children }: any) => <div>{children}</div>,
    SubTrigger: ({ children }: any) => <div>{children}</div>,
    SubContent: ({ children }: any) => <div>{children}</div>,
    Portal: ({ children }: any) => <div>{children}</div>,
    Label: ({ children }: any) => <div>{children}</div>,
    Separator: ({ children }: any) => <div>{children}</div>
  }
})

const mockUseGitHubUsersStore = useGitHubUsersStore as jest.MockedFunction<
  typeof useGitHubUsersStore
>
const mockUseInfiniteScroll = useInfiniteScroll as jest.MockedFunction<
  typeof useInfiniteScroll
>

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockUseGitHubUsersStore.mockImplementation((selector: any) =>
      selector({
        state: {
          users: [],
          total: 0,
          hasMore: false,
          isLoading: false,
          isFetchingMore: false,
          error: null,
          searchQuery: ''
        },
        actions: {
          fetchNextPage: jest.fn(),
          initFromUrl: jest.fn()
        }
      })
    )

    mockUseInfiniteScroll.mockReturnValue({ current: null })
  })

  it('renders header, search bar, and footer', () => {
    render(<HomePage />)

    // Header
    expect(screen.getByText('GitHub Users')).toBeInTheDocument()
    expect(screen.getByText('Search for developers')).toBeInTheDocument()

    // SearchBar
    expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument()

    // Footer
    expect(screen.getByText('GitHub Users Search')).toBeInTheDocument()
  })

  it('shows empty state when no users and no search query', () => {
    render(<HomePage />)

    expect(screen.getByText('Search for users')).toBeInTheDocument()
    expect(
      screen.getByText(
        "Type a developer's name in the field above to find GitHub profiles"
      )
    ).toBeInTheDocument()
  })

  it('shows error state when there is an error', () => {
    mockUseGitHubUsersStore.mockImplementation((selector: any) =>
      selector({
        state: {
          users: [],
          total: 0,
          hasMore: false,
          isLoading: false,
          isFetchingMore: false,
          error: 'API failed',
          searchQuery: ''
        },
        actions: {
          fetchNextPage: jest.fn(),
          initFromUrl: jest.fn()
        }
      })
    )

    render(<HomePage />)

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('API failed')).toBeInTheDocument()
  })

  it('shows loading state when isLoading is true', () => {
    mockUseGitHubUsersStore.mockImplementation((selector: any) =>
      selector({
        state: {
          users: [],
          total: 0,
          hasMore: false,
          isLoading: true,
          isFetchingMore: false,
          error: null,
          searchQuery: ''
        },
        actions: {
          fetchNextPage: jest.fn(),
          initFromUrl: jest.fn()
        }
      })
    )

    render(<HomePage />)

    expect(screen.getByText('Searching...')).toBeInTheDocument()
  })

  it('renders users list when users exist', () => {
    const mockUsers = [
      { id: 1, login: 'user1', avatar_url: '', html_url: '', type: 'User' },
      { id: 2, login: 'user2', avatar_url: '', html_url: '', type: 'User' }
    ]

    mockUseGitHubUsersStore.mockImplementation((selector: any) =>
      selector({
        state: {
          users: mockUsers,
          total: 2,
          hasMore: false,
          isLoading: false,
          isFetchingMore: false,
          error: null,
          searchQuery: ''
        },
        actions: {
          fetchNextPage: jest.fn(),
          initFromUrl: jest.fn()
        }
      })
    )

    render(<HomePage />)

    expect(screen.getByText(/2 of 2 users/i)).toBeInTheDocument()

    expect(screen.getByText('user1')).toBeInTheDocument()
    expect(screen.getByText('user2')).toBeInTheDocument()
  })

  it("shows 'no results' when search query is set but no users", () => {
    mockUseGitHubUsersStore.mockImplementation((selector: any) =>
      selector({
        state: {
          users: [],
          total: 0,
          hasMore: false,
          isLoading: false,
          isFetchingMore: false,
          error: null,
          searchQuery: 'test'
        },
        actions: {
          fetchNextPage: jest.fn(),
          initFromUrl: jest.fn()
        }
      })
    )

    render(<HomePage />)

    expect(screen.getByText('No results found')).toBeInTheDocument()
    expect(screen.getByText(/"test"/)).toBeInTheDocument()
  })
})
