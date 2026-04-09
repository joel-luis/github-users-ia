import { create } from 'zustand'
import type { GitHubUserDetailStore } from '@/types/store/github-user-detail-store'
import { fetchGitHubUserDetail } from '@/app/actions/github-user-detail'
import { fetchGitHubRepos } from '@/app/actions/github-repos'

const initialState = {
  username: '',
  user: null,
  repos: [],
  reposPage: 1,
  hasMoreRepos: false,
  isFetchingMoreRepos: false,
  isLoading: false,
  error: null
}

export const useGitHubUserDetailStore = create<GitHubUserDetailStore>(
  (set, get) => ({
    state: initialState,
    actions: {
      fetchUserDetail: async (username: string) => {
        const { state } = get()
        if (state.username === username && state.user) return

        set({
          state: {
            ...initialState,
            username,
            isLoading: true
          }
        })

        try {
          const [user, reposResponse] = await Promise.all([
            fetchGitHubUserDetail(username),
            fetchGitHubRepos(username, 1)
          ])

          set(({ state }) => ({
            state: {
              ...state,
              user,
              repos: reposResponse.data,
              reposPage: reposResponse.nextPage,
              hasMoreRepos: reposResponse.hasMore,
              isLoading: false
            }
          }))
        } catch (error) {
          set(({ state }) => ({
            state: {
              ...state,
              isLoading: false,
              error:
                error instanceof Error
                  ? error.message
                  : 'User not found or failed to load data.'
            }
          }))
        }
      },

      fetchNextReposPage: async () => {
        const { state } = get()
        if (!state.hasMoreRepos || state.isFetchingMoreRepos || !state.username)
          return

        set(({ state }) => ({
          state: { ...state, isFetchingMoreRepos: true }
        }))

        try {
          const reposResponse = await fetchGitHubRepos(
            state.username,
            state.reposPage
          )

          set(({ state }) => ({
            state: {
              ...state,
              repos: [...state.repos, ...reposResponse.data],
              reposPage: reposResponse.nextPage,
              hasMoreRepos: reposResponse.hasMore,
              isFetchingMoreRepos: false
            }
          }))
        } catch (error) {
          set(({ state }) => ({
            state: {
              ...state,
              isFetchingMoreRepos: false,
              error:
                error instanceof Error
                  ? error.message
                  : 'Failed to load more repositories.'
            }
          }))
        }
      },

      reset: () => {
        set({ state: initialState })
      }
    }
  })
)
