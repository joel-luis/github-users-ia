import { create } from 'zustand'
import type { GitHubUsersStore } from '@/types/store/github-users-store'
import { fetchGitHubUsers } from '@/app/actions/github-users'

const initialState = {
  searchQuery: '',
  users: [],
  total: 0,
  page: 1,
  hasMore: false,
  isLoading: false,
  isFetchingMore: false,
  error: null
}

export const useGitHubUsersStore = create<GitHubUsersStore>((set, get) => {
  let debounceTimer: NodeJS.Timeout | null = null

  const fetchUsers = async (query: string) => {
    if (!query?.trim()) {
      set({ state: { ...initialState } })
      return
    }

    set(({ state }) => ({
      state: { ...state, isLoading: true }
    }))

    try {
      const data = await fetchGitHubUsers(query, 1)

      set(({ state }) => ({
        state: {
          ...state,
          users: data.data,
          total: data.total,
          page: data.nextPage,
          hasMore: data.hasMore,
          isLoading: false
        }
      }))
    } catch (error) {
      set(({ state }) => ({
        state: {
          ...state,
          isLoading: false,
          error: error instanceof Error ? error.message : 'An error occurred'
        }
      }))
    }
  }

  return {
    state: initialState,
    actions: {
      setSearchQuery: (searchQuery: string) => {
        set(({ state }) => ({ state: { ...state, searchQuery } }))

        if (debounceTimer) clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
          const url = new URL(window.location.href)
          if (searchQuery.trim()) {
            url.searchParams.set('q', searchQuery)
          } else {
            url.searchParams.delete('q')
          }
          window.history.replaceState({}, '', url.toString())

          fetchUsers(searchQuery)
        }, 500)
      },

      initFromUrl: () => {
        const url = new URL(window.location.href)
        const queryFromUrl = url.searchParams.get('q')
        const { state } = get()

        const query = queryFromUrl || state.searchQuery

        if (query) {
          if (!url.searchParams.has('q')) {
            url.searchParams.set('q', query)
            window.history.replaceState({}, '', url.toString())
          }

          if (state.searchQuery !== query || state.users.length === 0) {
            set(({ state }) => ({ state: { ...state, searchQuery: query } }))
            fetchUsers(query)
          }
        }
      },

      fetchNextPage: async () => {
        const { state } = get()
        if (!state.hasMore || state.isFetchingMore || !state.searchQuery) return

        set(({ state }) => ({
          state: { ...state, isFetchingMore: true, error: null }
        }))

        try {
          const data = await fetchGitHubUsers(state.searchQuery, state.page)

          set(({ state }) => ({
            state: {
              ...state,
              users: [...state.users, ...data.data],
              page: data.nextPage,
              hasMore: data.hasMore,
              isFetchingMore: false
            }
          }))
        } catch (error) {
          set(({ state }) => ({
            state: {
              ...state,
              isFetchingMore: false,
              error:
                error instanceof Error ? error.message : 'An error occurred'
            }
          }))
        }
      }
    }
  }
})
