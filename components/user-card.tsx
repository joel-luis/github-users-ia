import { UserIcon } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { GitHubUser } from '@/types/github'

export function UserCard({ user }: { user: GitHubUser }) {
  return (
    <Card className="bg-card border-border overflow-hidden border transition-shadow duration-300 hover:shadow-lg dark:border-zinc-800">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="ring-border mb-4 h-24 w-24 ring-2">
            <AvatarImage
              src={user.avatar_url || '/placeholder.svg'}
              alt={user.login}
            />
            <AvatarFallback>
              <UserIcon className="text-muted-foreground h-12 w-12" />
            </AvatarFallback>
          </Avatar>

          <h3 className="text-foreground mb-1 w-full truncate text-lg font-semibold">
            {user.login}
          </h3>

          {user.type && (
            <span className="text-muted-foreground bg-muted mb-4 rounded-full px-2 py-1 text-xs">
              {user.type}
            </span>
          )}

          <Button
            asChild
            variant="outline"
            size="sm"
            className="mt-2 w-full bg-transparent"
          >
            <Link href={`/users/${user.login}`}>View Profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
