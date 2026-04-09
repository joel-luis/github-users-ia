import { render, screen } from "@testing-library/react"
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

describe("Card components", () => {
  it("renders Card with children and className", () => {
    render(
      <Card className="custom-card">
        <div>Child</div>
      </Card>
    )

    const card = screen.getByText("Child").parentElement
    expect(card).toBeInTheDocument()
    expect(card).toHaveAttribute("data-slot", "card")
    expect(card).toHaveClass("custom-card")
  })

  it("renders CardHeader correctly", () => {
    render(<CardHeader className="custom-header">Header</CardHeader>)
    const header = screen.getByText("Header")
    expect(header).toBeInTheDocument()
    expect(header).toHaveAttribute("data-slot", "card-header")
    expect(header).toHaveClass("custom-header")
  })

  it("renders CardTitle correctly", () => {
    render(<CardTitle className="custom-title">Title</CardTitle>)
    const title = screen.getByText("Title")
    expect(title).toBeInTheDocument()
    expect(title).toHaveAttribute("data-slot", "card-title")
    expect(title).toHaveClass("custom-title")
  })

  it("renders CardDescription correctly", () => {
    render(<CardDescription className="custom-desc">Desc</CardDescription>)
    const desc = screen.getByText("Desc")
    expect(desc).toBeInTheDocument()
    expect(desc).toHaveAttribute("data-slot", "card-description")
    expect(desc).toHaveClass("custom-desc")
  })

  it("renders CardAction correctly", () => {
    render(<CardAction className="custom-action">Action</CardAction>)
    const action = screen.getByText("Action")
    expect(action).toBeInTheDocument()
    expect(action).toHaveAttribute("data-slot", "card-action")
    expect(action).toHaveClass("custom-action")
  })

  it("renders CardContent correctly", () => {
    render(<CardContent className="custom-content">Content</CardContent>)
    const content = screen.getByText("Content")
    expect(content).toBeInTheDocument()
    expect(content).toHaveAttribute("data-slot", "card-content")
    expect(content).toHaveClass("custom-content")
  })

  it("renders CardFooter correctly", () => {
    render(<CardFooter className="custom-footer">Footer</CardFooter>)
    const footer = screen.getByText("Footer")
    expect(footer).toBeInTheDocument()
    expect(footer).toHaveAttribute("data-slot", "card-footer")
    expect(footer).toHaveClass("custom-footer")
  })
})
