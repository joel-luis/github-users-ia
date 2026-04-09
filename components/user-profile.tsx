import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  UserIcon,
  MapPin,
  Building2,
  Link as LinkIcon,
  Mail,
  Users,
  Calendar
} from 'lucide-react'
import type { GitHubUserDetail } from '@/types/github'

export function UserProfile({ user }: { user: GitHubUserDetail }) {
  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
      <Avatar className="ring-border h-32 w-32 ring-2 md:h-40 md:w-40">
        <AvatarImage src={user.avatar_url} alt={user.login} />
        <AvatarFallback>
          <UserIcon className="text-muted-foreground h-16 w-16" />
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 text-center md:text-left">
        <h1 className="text-foreground text-2xl font-bold md:text-3xl">
          {user.name || user.login}
        </h1>
        {user.name && (
          <p className="text-muted-foreground text-lg">@{user.login}</p>
        )}

        {user.bio && (
          <p className="text-foreground mt-3 max-w-2xl leading-relaxed">
            {user.bio}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 md:justify-start">
          <div className="flex items-center gap-1.5">
            <Users className="text-muted-foreground h-4 w-4" />
            <span className="text-foreground font-semibold">
              {user.followers.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-sm">followers</span>
          </div>
          <span className="text-border">·</span>
          <div className="flex items-center gap-1.5">
            <span className="text-foreground font-semibold">
              {user.following.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-sm">following</span>
          </div>
        </div>

        <div className="text-muted-foreground mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm md:justify-start">
          {user.email && (
            <a
              href={`mailto:${user.email}`}
              className="hover:text-foreground flex items-center gap-1.5 transition-colors"
            >
              <Mail className="h-4 w-4" />
              {user.email}
            </a>
          )}
          {user.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {user.location}
            </span>
          )}
          {user.company && (
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              {user.company}
            </span>
          )}
          {user.blog && (
            <a
              href={
                user.blog.startsWith('http')
                  ? user.blog
                  : `https://${user.blog}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground flex items-center gap-1.5 transition-colors"
            >
              <LinkIcon className="h-4 w-4" />
              {user.blog}
            </a>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            Joined {joinDate}
          </span>
        </div>
      </div>
    </div>
  )
}
