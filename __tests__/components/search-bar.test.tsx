import { render, screen, fireEvent } from "@testing-library/react"
import { SearchBar } from "@/components/search-bar"
import { useGitHubUsersStore } from "@/store/use-github-users-store"

jest.mock("@/store/use-github-users-store")

const mockSetSearchQuery = jest.fn()

;(useGitHubUsersStore as unknown as jest.Mock).mockImplementation((selector: any) =>
  selector({
    state: { searchQuery: "" },
    actions: { setSearchQuery: mockSetSearchQuery },
  })
)

describe("SearchBar", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the search input", () => {
    render(<SearchBar />)
    const input = screen.getByPlaceholderText("Search users...")
    expect(input).toBeInTheDocument()
  })

  it("calls setSearchQuery when typing", () => {
    render(<SearchBar />)
    const input = screen.getByPlaceholderText("Search users...")

    fireEvent.change(input, { target: { value: "joel" } })

    expect(mockSetSearchQuery).toHaveBeenCalledWith("joel")
  })

  it("shows the clear button when there is text", () => {
    ;(useGitHubUsersStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        state: { searchQuery: "joel" },
        actions: { setSearchQuery: mockSetSearchQuery },
      })
    )

    render(<SearchBar />)
    const clearButton = screen.getByRole("button")
    expect(clearButton).toBeInTheDocument()
  })

  it("clears the input when clicking the clear button", () => {
    ;(useGitHubUsersStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        state: { searchQuery: "joel" },
        actions: { setSearchQuery: mockSetSearchQuery },
      })
    )

    render(<SearchBar />)
    const clearButton = screen.getByRole("button")

    fireEvent.click(clearButton)

    expect(mockSetSearchQuery).toHaveBeenCalledWith("")
  })
})
