'use client'

import { useMemo, useState, type RefObject } from 'react'
import { Loader2 } from 'lucide-react'
import { RepoCard } from '@/components/repo-card'
import { RepoSortControls } from '@/components/repo-sort-controls'
import type { GitHubRepo, RepoSortField, SortDirection } from '@/types/github'

interface RepoListProps {
  repos: GitHubRepo[]
  hasMore: boolean
  isFetchingMore: boolean
  loadMoreRef: RefObject<HTMLDivElement | null>
}

export function RepoList({
  repos,
  hasMore,
  isFetchingMore,
  loadMoreRef
}: RepoListProps) {
  const [sortField, setSortField] = useState<RepoSortField>('stars')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const sortedRepos = useMemo(() => {
    const sorted = [...repos].sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case 'stars':
          comparison = a.stargazers_count - b.stargazers_count
          break
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'updated':
          comparison =
            new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
          break
      }

      return sortDirection === 'desc' ? -comparison : comparison
    })

    return sorted
  }, [repos, sortField, sortDirection])

  const handleSortChange = (field: RepoSortField) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection(field === 'name' ? 'asc' : 'desc')
    }
  }

  if (repos.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        No repositories found.
      </p>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-foreground text-xl font-semibold">
          Repositories ({repos.length})
        </h2>
        <RepoSortControls
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {sortedRepos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>

      <div ref={loadMoreRef} className="flex items-center justify-center py-8">
        {isFetchingMore && (
          <div className="text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading more repositories...</span>
          </div>
        )}

        {!hasMore && repos.length > 0 && (
          <p className="text-muted-foreground text-center text-sm">
            All repositories have been loaded
          </p>
        )}
      </div>
    </div>
  )
}
