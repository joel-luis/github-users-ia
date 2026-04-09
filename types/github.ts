export type GitHubUser = {
  id: number
  login: string
  avatar_url: string
  html_url: string
  type: string
  score: number
}

export type GitHubUsersResponse = {
  data: GitHubUser[]
  total: number
  hasMore: boolean
  nextPage: number
}

export type GitHubUserDetail = {
  id: number
  login: string
  avatar_url: string
  html_url: string
  name: string | null
  bio: string | null
  email: string | null
  followers: number
  following: number
  public_repos: number
  location: string | null
  company: string | null
  blog: string | null
  created_at: string
}

export type GitHubRepo = {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  owner: {
    login: string
  }
}

export type GitHubRepoDetail = GitHubRepo & {
  homepage: string | null
  watchers_count: number
  open_issues_count: number
  default_branch: string
  license: {
    name: string
    spdx_id: string
  } | null
  topics: string[]
  created_at: string
}

export type RepoSortField = 'stars' | 'name' | 'updated'
export type SortDirection = 'asc' | 'desc'
