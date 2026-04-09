'use server'

import { githubApi } from '@/lib/axios'
import type { GitHubUserDetail } from '@/types/github'

export async function fetchGitHubUserDetail(
  username: string
): Promise<GitHubUserDetail> {
  const { data } = await githubApi.get<GitHubUserDetail>(
    `/users/${encodeURIComponent(username)}`
  )

  return data
}
