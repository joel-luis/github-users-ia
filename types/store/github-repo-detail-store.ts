import type { GitHubRepoDetail } from '@/types/github'

export interface GitHubRepoDetailState {
  owner: string
  repo: string
  repoData: GitHubRepoDetail | null
  isLoading: boolean
  error: string | null
}

export interface GitHubRepoDetailActions {
  fetchRepoDetail: (owner: string, repo: string) => Promise<void>
  reset: () => void
}

export interface GitHubRepoDetailStore {
  state: GitHubRepoDetailState
  actions: GitHubRepoDetailActions
}
