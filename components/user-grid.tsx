import { UserCard } from '@/components/user-card'
import type { GitHubUser } from '@/types/github'

export function UserGrid({ users }: { users: GitHubUser[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {users.map((user, index) => (
        <UserCard key={`${user.id}-${index}`} user={user} />
      ))}
    </div>
  )
}
