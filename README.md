# GitHub Users Search

A modern, responsive web application for searching GitHub users, viewing user profiles with detailed information, and exploring repositories. Features an AI-powered natural language search using OpenAI. Built with Next.js 15, React 19, TypeScript, and Zustand.

## Overview

This application consumes the GitHub REST API v3 to allow searching for users, viewing detailed user profiles (followers, following, bio, email, avatar), listing repositories sorted by stars, and inspecting individual repository details. It features an AI search assistant powered by OpenAI, client-side routing, infinite scroll pagination, dark/light themes, and URL query persistence.

## Features

- **User Search**: Debounced search (500ms) with infinite scroll pagination
- **AI Search**: Natural language search powered by OpenAI — e.g. "show me octocat's repos", "search for react developers", "show the vercel organization"
- **URL Persistence**: Search query synced with `?q=` URL parameter — shareable links
- **User Detail Page**: Avatar, name, bio, email, followers/following count, location, company, blog, join date
- **Repository Listing**: Paginated with infinite scroll, default sorted by stars (descending)
- **Sort Controls**: Toggle sort by Stars, Name, or Updated — ascending/descending
- **Repository Detail Page**: Name, description, stars, forks, watchers, issues, language, license, topics, external link
- **Client-Side Routing**: 3 routes — `/`, `/users/[username]`, `/repos/[owner]/[repo]`
- **Dark/Light Theme**: Persistent theme toggle
- **Responsive Design**: Mobile-first grid layout adapting to all screen sizes
- **Axios HTTP Client**: Centralized axios instance with GitHub API base config
- **Server-Side API Calls**: Next.js server actions keep API token secure
- **Type-Safe**: Full TypeScript with separated type definitions
- **Test Suite**: Jest + React Testing Library (130 tests, 20 suites, ~95% coverage)

## Tech Stack

| Category    | Technology                      |
| ----------- | ------------------------------- |
| Framework   | Next.js 15 (App Router)         |
| UI Library  | React 19                        |
| Language    | TypeScript 5                    |
| Styling     | Tailwind CSS 4 + shadcn/ui      |
| State       | Zustand 5                       |
| HTTP Client | Axios                           |
| AI          | OpenAI GPT-4o-mini              |
| Theme       | next-themes                     |
| Icons       | Lucide React                    |
| Testing     | Jest 30 + React Testing Library |

## Routes

| Route                   | Description                                                    |
| ----------------------- | -------------------------------------------------------------- |
| `/`                     | Home — search GitHub users with infinite scroll + AI search    |
| `/users/[username]`     | User detail — profile + paginated repos list                   |
| `/repos/[owner]/[repo]` | Repository detail — stats, details, external link              |
| `/api/ai-search`        | AI search API — interprets natural language queries via OpenAI |

## APIs Consumed

| Endpoint                      | Usage                                     |
| ----------------------------- | ----------------------------------------- |
| `GET /search/users?q={query}` | Search users by name                      |
| `GET /users/{username}`       | User detail (followers, bio, email, etc.) |
| `GET /users/{username}/repos` | User repositories (paginated)             |
| `GET /repos/{owner}/{repo}`   | Repository detail                         |

## Architecture

### State Management (Zustand)

Three global stores following consistent `{ state, actions }` pattern:

- **`useGitHubUsersStore`** — Search query, user list, pagination, URL sync
- **`useGitHubUserDetailStore`** — User profile, repos list, repos pagination
- **`useGitHubRepoDetailStore`** — Repository detail data
- **`useAISearchStore`** — AI search dialog state, prompt, loading, intent execution

### AI Search

The AI search feature uses OpenAI's GPT-4o-mini model to interpret natural language queries and map them to application actions:

| Intent         | Example                        | Action                               |
| -------------- | ------------------------------ | ------------------------------------ |
| `search_users` | "search for react developers"  | Sets search query on home page       |
| `view_user`    | "show me octocat's profile"    | Navigates to `/users/octocat`        |
| `view_repo`    | "show the repo vercel/next.js" | Navigates to `/repos/vercel/next.js` |

The AI understands queries in any language and treats GitHub organizations the same as users.

### Data Flow

1. User types in search bar → `setSearchQuery` with 500ms debounce
2. URL updated with `?q=` param via `history.replaceState`
3. Server action calls GitHub API via centralized axios instance
4. Results stored in Zustand store → components re-render
5. Infinite scroll observer triggers `fetchNextPage` as user scrolls
6. Clicking a user card navigates to `/users/[username]` (client-side routing)
7. Repository cards link to `/repos/[owner]/[repo]`

### Server Actions

All API calls run on the server via Next.js `'use server'` actions:

| Action                  | File                                |
| ----------------------- | ----------------------------------- |
| `fetchGitHubUsers`      | `app/actions/github-users.ts`       |
| `fetchGitHubUserDetail` | `app/actions/github-user-detail.ts` |
| `fetchGitHubRepos`      | `app/actions/github-repos.ts`       |
| `fetchGitHubRepoDetail` | `app/actions/github-repo-detail.ts` |

### API Routes

| Route                 | File                         |
| --------------------- | ---------------------------- |
| `POST /api/ai-search` | `app/api/ai-search/route.ts` |

Benefits: API token stays server-side, prevents CORS issues, better error handling.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Configure environment (optional — increases API rate limit)
cp .env.example .env.local
# Edit .env.local and add your GitHub token

# Run development server
npm run dev
```

### Environment Variables

| Variable         | Required | Description                                        |
| ---------------- | -------- | -------------------------------------------------- |
| `GITHUB_TOKEN`   | No       | GitHub Personal Access Token (60 → 5,000 req/hour) |
| `OPENAI_API_KEY` | Yes      | OpenAI API key for AI search feature               |

Generate a GitHub token at https://github.com/settings/tokens (no scopes needed for public data).
Get an OpenAI API key at https://platform.openai.com/api-keys.

### Scripts

```bash
npm run dev           # Development server
npm run build         # Production build
npm start             # Production server
npm test              # Run tests
npm run test:watch    # Tests in watch mode
npm run test:coverage # Coverage report
npm run lint          # ESLint
```

## Testing

130 tests across 20 suites covering:

- **Components**: SearchBar, UserCard, UserGrid, UserProfile, RepoCard, RepoList, RepoSortControls, ThemeToggle, Card UI
- **Hooks**: useInfiniteScroll
- **Stores**: useGitHubUsersStore, useGitHubUserDetailStore, useGitHubRepoDetailStore
- **Actions**: All 4 GitHub API server actions (axios mocked)
- **Pages**: Home page, User detail page, Repo detail page
- **Theme**: ThemeProvider integration

```bash
npm test
```

## Demo

https://github.com/user-attachments/assets/9942969c-087e-48e4-ad00-74bdf6331b42
