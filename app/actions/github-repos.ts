'use server'

import { githubApi } from '@/lib/axios'
import type { GitHubRepo } from '@/types/github'

export interface GitHubReposResponse {
  data: GitHubRepo[]
  hasMore: boolean
  nextPage: number
}

const PER_PAGE = 10

export async function fetchGitHubRepos(
  username: string,
  page: number = 1
): Promise<GitHubReposResponse> {
  const { data, headers } = await githubApi.get<GitHubRepo[]>(
    `/users/${encodeURIComponent(username)}/repos`,
    {
      params: {
        per_page: PER_PAGE,
        sort: 'updated',
        page
      }
    }
  )

  const linkHeader = headers['link'] || ''
  const hasMore = linkHeader.includes('rel="next"')

  return {
    data,
    hasMore,
    nextPage: page + 1
  }
}
