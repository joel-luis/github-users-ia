'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Github,
  Loader2,
  Star,
  GitFork,
  Eye,
  AlertCircle,
  ExternalLink,
  Code2,
  Calendar,
  Scale
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import { useGitHubRepoDetailStore } from '@/store/use-github-repo-detail-store'

export default function RepoDetailPage() {
  const params = useParams<{ owner: string; repo: string }>()
  const { owner, repo } = params

  const { repoData, isLoading, error } = useGitHubRepoDetailStore(
    (store) => store.state
  )
  const { fetchRepoDetail } = useGitHubRepoDetailStore((store) => store.actions)

  useEffect(() => {
    fetchRepoDetail(owner, repo)
  }, [owner, repo, fetchRepoDetail])

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="border-border/40 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="icon">
                <Link href={`/users/${owner}`}>
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <div className="bg-foreground text-background flex h-8 w-8 items-center justify-center rounded-lg">
                  <Github className="h-4 w-4" />
                </div>
                <span className="text-muted-foreground text-sm">
                  <Link
                    href={`/users/${owner}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {owner}
                  </Link>
                  <span className="mx-1">/</span>
                </span>
                <h1 className="text-foreground text-lg font-semibold">
                  {repo}
                </h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-8">
        {isLoading && (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <Loader2 className="text-muted-foreground mx-auto mb-3 h-8 w-8 animate-spin" />
              <p className="text-muted-foreground text-sm">
                Loading repository...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-32">
            <div className="max-w-md text-center">
              <div className="bg-destructive/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <span className="text-destructive text-xl">!</span>
              </div>
              <h2 className="text-foreground mb-2 text-lg font-medium">
                Repository not found
              </h2>
              <p className="text-muted-foreground mb-6 text-sm">{error}</p>
              <Button asChild variant="outline">
                <Link href={`/users/${owner}`}>Back to {owner}</Link>
              </Button>
            </div>
          </div>
        )}

        {!isLoading && !error && repoData && (
          <div className="mx-auto max-w-3xl space-y-8">
            <div>
              <h2 className="text-foreground text-2xl font-bold md:text-3xl">
                {repoData.name}
              </h2>
              {repoData.description && (
                <p className="text-muted-foreground mt-2 text-lg leading-relaxed">
                  {repoData.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Card>
                <CardContent className="flex flex-col items-center p-4">
                  <Star className="text-muted-foreground mb-1 h-5 w-5" />
                  <span className="text-foreground text-xl font-bold">
                    {repoData.stargazers_count.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground text-xs">Stars</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-4">
                  <GitFork className="text-muted-foreground mb-1 h-5 w-5" />
                  <span className="text-foreground text-xl font-bold">
                    {repoData.forks_count.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground text-xs">Forks</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-4">
                  <Eye className="text-muted-foreground mb-1 h-5 w-5" />
                  <span className="text-foreground text-xl font-bold">
                    {repoData.watchers_count.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    Watchers
                  </span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-4">
                  <AlertCircle className="text-muted-foreground mb-1 h-5 w-5" />
                  <span className="text-foreground text-xl font-bold">
                    {repoData.open_issues_count.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground text-xs">Issues</span>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="space-y-4 p-6">
                <h3 className="text-foreground text-lg font-semibold">
                  Details
                </h3>

                <div className="text-sm">
                  <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {repoData.language && (
                      <div className="flex items-center gap-2">
                        <Code2 className="text-muted-foreground h-4 w-4 shrink-0" />
                        <dt className="text-muted-foreground">Language:</dt>
                        <dd className="text-foreground font-medium">
                          {repoData.language}
                        </dd>
                      </div>
                    )}
                    {repoData.license && (
                      <div className="flex items-center gap-2">
                        <Scale className="text-muted-foreground h-4 w-4 shrink-0" />
                        <dt className="text-muted-foreground">License:</dt>
                        <dd className="text-foreground font-medium">
                          {repoData.license.name}
                        </dd>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Code2 className="text-muted-foreground h-4 w-4 shrink-0" />
                      <dt className="text-muted-foreground">Default branch:</dt>
                      <dd className="text-foreground font-medium">
                        {repoData.default_branch}
                      </dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="text-muted-foreground h-4 w-4 shrink-0" />
                      <dt className="text-muted-foreground">Created:</dt>
                      <dd className="text-foreground font-medium">
                        {new Date(repoData.created_at).toLocaleDateString()}
                      </dd>
                    </div>
                  </dl>
                </div>

                {repoData.topics && repoData.topics.length > 0 && (
                  <div>
                    <h4 className="text-muted-foreground mb-2 text-sm font-medium">
                      Topics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {repoData.topics.map((topic) => (
                        <span
                          key={topic}
                          className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <a
                  href={repoData.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  View on GitHub
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
