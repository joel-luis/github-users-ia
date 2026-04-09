'use server'

import { githubApi } from '@/lib/axios'
import type { GitHubRepoDetail } from '@/types/github'

export async function fetchGitHubRepoDetail(
  owner: string,
  repo: string
): Promise<GitHubRepoDetail> {
  const { data } = await githubApi.get<GitHubRepoDetail>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`
  )

  return data
}
