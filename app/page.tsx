'use client'

import { useEffect } from 'react'
import { SearchBar } from '@/components/search-bar'
import { UserGrid } from '@/components/user-grid'
import { ThemeToggle } from '@/components/theme-toggle'
import { Loader2, SearchIcon, Github } from 'lucide-react'
import { useGitHubUsersStore } from '@/store/use-github-users-store'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { useAISearchStore } from '@/store/use-ai-search-store'
import { AISearchButton } from '@/components/ai-search-button'

export default function HomePage() {
  const {
    users,
    total,
    hasMore,
    isLoading,
    isFetchingMore,
    error,
    searchQuery
  } = useGitHubUsersStore((store) => store.state)
  const { fetchNextPage, initFromUrl } = useGitHubUsersStore(
    (store) => store.actions
  )

  const resetAISearch = useAISearchStore((store) => store.actions.reset)

  useEffect(() => {
    initFromUrl()
    resetAISearch()
  }, [initFromUrl, resetAISearch])

  const loadMoreRef = useInfiniteScroll({
    hasMore,
    isFetching: isFetchingMore,
    onLoadMore: fetchNextPage
  })

  const showEmptyState =
    !isLoading && !error && users.length === 0 && !searchQuery
  const showNoResults =
    !isLoading && !error && users.length === 0 && searchQuery

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="border-border/40 bg-background border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-foreground text-background flex h-10 w-10 items-center justify-center rounded-lg">
                <Github className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-foreground text-xl font-semibold">
                  GitHub Users
                </h1>
                <p className="text-muted-foreground text-xs">
                  Search for developers
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-12">
        <div className="mx-auto mb-12 max-w-3xl">
          <SearchBar />
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <Loader2 className="text-muted-foreground mx-auto mb-3 h-8 w-8 animate-spin" />
              <p className="text-muted-foreground text-sm">Searching...</p>
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
                Something went wrong
              </h2>
              <p className="text-muted-foreground text-sm">{error}</p>
            </div>
          </div>
        )}

        {showEmptyState && (
          <div className="flex items-center justify-center py-32">
            <div className="max-w-md text-center">
              <div className="bg-muted mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
                <SearchIcon className="text-muted-foreground h-8 w-8" />
              </div>
              <h2 className="text-foreground mb-3 text-2xl font-semibold">
                Search for users
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Type a developer&apos;s name in the field above to find GitHub
                profiles
              </p>
              <AISearchButton />
            </div>
          </div>
        )}

        {showNoResults && (
          <div className="flex items-center justify-center py-32">
            <div className="max-w-md text-center">
              <div className="bg-muted mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
                <SearchIcon className="text-muted-foreground h-8 w-8" />
              </div>
              <h2 className="text-foreground mb-3 text-2xl font-semibold">
                No results found
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We couldn&apos;t find any users for{' '}
                <span className="text-foreground font-medium">
                  &quot;{searchQuery}&quot;
                </span>
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                Try searching for another term
              </p>
            </div>
          </div>
        )}

        {!isLoading && !error && users.length > 0 && (
          <>
            <div className="mb-8">
              <p className="text-muted-foreground text-center text-sm">
                {Math.min(users.length, total).toLocaleString()} of{' '}
                {total.toLocaleString()} users
              </p>
            </div>

            <UserGrid users={users} />

            <div
              ref={loadMoreRef}
              className="flex items-center justify-center py-12"
            >
              {isFetchingMore && (
                <div className="text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Loading more...</span>
                </div>
              )}

              {!hasMore && (
                <p className="text-muted-foreground mt-4 text-center text-sm">
                  All users have been loaded
                </p>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="border-border/40 bg-background mt-auto border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Github className="h-4 w-4" />
              <span>GitHub Users Search</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-6 text-sm">
              <a
                href="https://docs.github.com/en/rest"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                API Documentation
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
