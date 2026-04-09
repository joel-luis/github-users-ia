'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Github, Loader2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserProfile } from '@/components/user-profile'
import { RepoList } from '@/components/repo-list'
import { ThemeToggle } from '@/components/theme-toggle'
import { useGitHubUserDetailStore } from '@/store/use-github-user-detail-store'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'

export default function UserDetailPage() {
  const params = useParams<{ username: string }>()
  const username = params.username

  const { user, repos, isLoading, error, hasMoreRepos, isFetchingMoreRepos } =
    useGitHubUserDetailStore((store) => store.state)
  const { fetchUserDetail, fetchNextReposPage } = useGitHubUserDetailStore(
    (store) => store.actions
  )

  const loadMoreRef = useInfiniteScroll({
    hasMore: hasMoreRepos,
    isFetching: isFetchingMoreRepos,
    onLoadMore: fetchNextReposPage
  })

  useEffect(() => {
    fetchUserDetail(username)
  }, [username, fetchUserDetail])

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="border-border/40 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="icon">
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <div className="bg-foreground text-background flex h-8 w-8 items-center justify-center rounded-lg">
                  <Github className="h-4 w-4" />
                </div>
                <h1 className="text-foreground text-lg font-semibold">
                  {username}
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
                Loading profile...
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
                User not found
              </h2>
              <p className="text-muted-foreground mb-6 text-sm">{error}</p>
              <Button asChild variant="outline">
                <Link href="/">Back to search</Link>
              </Button>
            </div>
          </div>
        )}

        {!isLoading && !error && user && (
          <div className="space-y-10">
            <div className="border-border/40 rounded-xl border p-6 md:p-8">
              <UserProfile user={user} />
              <div className="mt-6 flex justify-center md:justify-start">
                <Button asChild variant="outline" size="sm">
                  <a
                    href={user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    View on GitHub
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <RepoList
              repos={repos}
              hasMore={hasMoreRepos}
              isFetchingMore={isFetchingMoreRepos}
              loadMoreRef={loadMoreRef}
            />
          </div>
        )}
      </main>
    </div>
  )
}
