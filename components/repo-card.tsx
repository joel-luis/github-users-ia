import Link from 'next/link'
import { Star, GitFork } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { GitHubRepo } from '@/types/github'

export function RepoCard({ repo }: { repo: GitHubRepo }) {
  return (
    <Card className="bg-card border-border overflow-hidden border transition-shadow duration-300 hover:shadow-lg dark:border-zinc-800">
      <CardContent className="flex min-h-36 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <Link
            href={`/repos/${repo.full_name}`}
            className="text-foreground truncate text-lg font-semibold hover:underline"
          >
            {repo.name}
          </Link>
          {repo.language && (
            <span className="bg-muted text-muted-foreground shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium">
              {repo.language}
            </span>
          )}
        </div>

        <p className="text-muted-foreground mb-4 line-clamp-2 flex-1 text-sm leading-relaxed">
          {repo.description || 'No description provided.'}
        </p>

        <div className="text-muted-foreground mt-auto flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            {repo.stargazers_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="h-4 w-4" />
            {repo.forks_count.toLocaleString()}
          </span>
          <span className="text-xs">
            Updated {new Date(repo.updated_at).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
