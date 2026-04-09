'use client'

import { Button } from '@/components/ui/button'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import type { RepoSortField, SortDirection } from '@/types/github'

const sortLabels: Record<RepoSortField, string> = {
  stars: 'Stars',
  name: 'Name',
  updated: 'Updated'
}

interface RepoSortControlsProps {
  sortField: RepoSortField
  sortDirection: SortDirection
  onSortChange: (field: RepoSortField) => void
}

export function RepoSortControls({
  sortField,
  sortDirection,
  onSortChange
}: RepoSortControlsProps) {
  const DirectionIcon = sortDirection === 'asc' ? ArrowUp : ArrowDown

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-muted-foreground mr-1 text-sm">Sort by:</span>
      {(Object.keys(sortLabels) as RepoSortField[]).map((field) => (
        <Button
          key={field}
          variant={sortField === field ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSortChange(field)}
          className="gap-1.5"
        >
          {sortLabels[field]}
          {sortField === field ? (
            <DirectionIcon className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
          )}
        </Button>
      ))}
    </div>
  )
}
