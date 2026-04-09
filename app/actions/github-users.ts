'use server'

import { githubApi } from '@/lib/axios'
import { GitHubUsersResponse } from '@/types/github'

export async function fetchGitHubUsers(
  query: string,
  page: number = 1
): Promise<GitHubUsersResponse> {
  if (!query) {
    return { data: [], total: 0, hasMore: false, nextPage: 1 }
  }

  const perPage = 20

  const { data } = await githubApi.get('/search/users', {
    params: {
      q: query,
      per_page: perPage,
      page
    }
  })

  return {
    data: data.items,
    total: data.total_count,
    hasMore: page * perPage < data.total_count,
    nextPage: page + 1
  }
}
