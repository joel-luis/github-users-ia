import axios from 'axios'

const headers: Record<string, string> = {
  Accept: 'application/vnd.github.v3+json'
}

if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
}

export const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers
})
