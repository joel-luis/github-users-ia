import { render, screen } from "@testing-library/react"
import { ThemeProvider } from "@/components/theme-provider"

jest.mock("next-themes", () => ({
  ThemeProvider: jest.fn(({ children }: any) => <div data-testid="next-theme">{children}</div>)
}))

describe("ThemeProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders children", () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Hello World</div>
      </ThemeProvider>
    )

    expect(screen.getByTestId("child")).toBeInTheDocument()
    expect(screen.getByText("Hello World")).toBeInTheDocument()
  })
})
