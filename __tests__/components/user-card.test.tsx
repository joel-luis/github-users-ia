import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { UserCard } from "@/components/user-card"
import type { GitHubUser } from "@/types/github"

describe("UserCard", () => {
  const mockUser: GitHubUser = {
    id: 1,
    login: "testuser",
    avatar_url: "https://example.com/avatar.jpg",
    html_url: "https://github.com/testuser",
    type: "User",
    score: 1.0,
  }

  it("should render profile link", () => {
    render(<UserCard user={mockUser} />)

    const link = screen.getByRole("link", { name: /view profile/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", `/users/${mockUser.login}`)
  })
})
