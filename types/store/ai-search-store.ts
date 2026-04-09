import type { AISearchResponse } from '@/types/ai-search'

export interface AISearchNavigator {
  pushRoute: (path: string) => void
  setSearchQuery: (query: string) => void
  pathname: string
}

export interface AISearchState {
  isOpen: boolean
  prompt: string
  isLoading: boolean
  response: AISearchResponse | null
  error: string | null
}

export interface AISearchActions {
  open: () => void
  close: () => void
  setPrompt: (prompt: string) => void
  submitPrompt: (navigator: AISearchNavigator) => Promise<void>
  reset: () => void
}

export interface AISearchStore {
  state: AISearchState
  actions: AISearchActions
}
