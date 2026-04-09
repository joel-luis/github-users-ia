export type AISearchIntent =
  | 'search_users'
  | 'view_user'
  | 'view_repo'
  | 'unknown'

export interface AISearchParams {
  query?: string
  username?: string
  owner?: string
  repo?: string
}

export interface AISearchResponse {
  intent: AISearchIntent
  params: AISearchParams
  message: string
}

export interface AISearchRequest {
  prompt: string
}
