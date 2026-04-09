import { create } from 'zustand'
import type {
  AISearchStore,
  AISearchNavigator
} from '@/types/store/ai-search-store'
import type { AISearchResponse } from '@/types/ai-search'

const initialState = {
  isOpen: false,
  prompt: '',
  isLoading: false,
  response: null as AISearchResponse | null,
  error: null as string | null
}

function executeIntent(data: AISearchResponse, navigator: AISearchNavigator) {
  switch (data.intent) {
    case 'view_user':
      if (data.params.username) {
        navigator.pushRoute(`/users/${data.params.username}`)
      }
      break
    case 'view_repo':
      if (data.params.owner && data.params.repo) {
        navigator.pushRoute(`/repos/${data.params.owner}/${data.params.repo}`)
      }
      break
    case 'search_users':
      if (data.params.query) {
        if (navigator.pathname !== '/') {
          navigator.pushRoute(`/?q=${encodeURIComponent(data.params.query)}`)
        } else {
          navigator.setSearchQuery(data.params.query)
        }
      }
      break
  }
}

export const useAISearchStore = create<AISearchStore>((set, get) => ({
  state: initialState,
  actions: {
    open: () => {
      set(({ state }) => ({ state: { ...state, isOpen: true } }))
    },

    close: () => {
      set({ state: { ...initialState } })
    },

    setPrompt: (prompt: string) => {
      set(({ state }) => ({ state: { ...state, prompt } }))
    },

    submitPrompt: async (navigator: AISearchNavigator) => {
      const { state, actions } = get()
      const trimmed = state.prompt.trim()
      if (!trimmed || state.isLoading) return

      set(({ state }) => ({
        state: { ...state, isLoading: true, response: null, error: null }
      }))

      try {
        const res = await fetch('/api/ai-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: trimmed })
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to process request')
        }

        const data: AISearchResponse = await res.json()

        set(({ state }) => ({
          state: { ...state, isLoading: false, response: data }
        }))

        if (data.intent !== 'unknown') {
          setTimeout(() => {
            executeIntent(data, navigator)
          }, 1200)
        }
      } catch (error) {
        set(({ state }) => ({
          state: {
            ...state,
            isLoading: false,
            error: error instanceof Error ? error.message : 'An error occurred'
          }
        }))
      }
    },

    reset: () => {
      set({ state: { ...initialState } })
    }
  }
}))
