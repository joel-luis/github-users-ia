import type { GitHubUser } from '@/types/github'

export interface GitHubUsersState {
  searchQuery: string
  users: GitHubUser[]
  total: number
  page: number
  hasMore: boolean
  isLoading: boolean
  isFetchingMore: boolean
  error: string | null
}

export interface GitHubUsersActions {
  setSearchQuery: (query: string) => void
  fetchNextPage: () => Promise<void>
  initFromUrl: () => void
}

export interface GitHubUsersStore {
  state: GitHubUsersState
  actions: GitHubUsersActions
}
