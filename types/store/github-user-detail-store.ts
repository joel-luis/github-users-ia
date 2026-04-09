import type { GitHubUserDetail, GitHubRepo } from '@/types/github'

export interface GitHubUserDetailState {
  username: string
  user: GitHubUserDetail | null
  repos: GitHubRepo[]
  reposPage: number
  hasMoreRepos: boolean
  isFetchingMoreRepos: boolean
  isLoading: boolean
  error: string | null
}

export interface GitHubUserDetailActions {
  fetchUserDetail: (username: string) => Promise<void>
  fetchNextReposPage: () => Promise<void>
  reset: () => void
}

export interface GitHubUserDetailStore {
  state: GitHubUserDetailState
  actions: GitHubUserDetailActions
}
