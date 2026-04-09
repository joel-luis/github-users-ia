import { create } from 'zustand'
import type { GitHubRepoDetailStore } from '@/types/store/github-repo-detail-store'
import { fetchGitHubRepoDetail } from '@/app/actions/github-repo-detail'

const initialState = {
  owner: '',
  repo: '',
  repoData: null,
  isLoading: false,
  error: null
}

export const useGitHubRepoDetailStore = create<GitHubRepoDetailStore>(
  (set, get) => ({
    state: initialState,
    actions: {
      fetchRepoDetail: async (owner: string, repo: string) => {
        const { state } = get()
        if (state.owner === owner && state.repo === repo && state.repoData)
          return

        set({
          state: {
            ...initialState,
            owner,
            repo,
            isLoading: true
          }
        })

        try {
          const repoData = await fetchGitHubRepoDetail(owner, repo)

          set(({ state }) => ({
            state: {
              ...state,
              repoData,
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
                  : 'Repository not found or failed to load.'
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
