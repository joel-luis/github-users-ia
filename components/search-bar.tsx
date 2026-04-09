'use client'

import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useGitHubUsersStore } from '@/store/use-github-users-store'

export function SearchBar() {
  const searchQuery = useGitHubUsersStore((s) => s.state.searchQuery)
  const { setSearchQuery } = useGitHubUsersStore((s) => s.actions)

  return (
    <div className="relative">
      <div className="group relative">
        <Search className="text-muted-foreground group-focus-within:text-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transition-colors" />
        <Input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-background border-border/20 focus-visible:border-border/40 focus-visible:ring-border/10 hover:border-border/30 h-12 pr-12 pl-12 text-base shadow-sm focus-visible:ring-2 dark:border-gray-600"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchQuery('')}
            className="hover:bg-muted absolute top-1/2 right-1 h-9 w-9 -translate-y-1/2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
