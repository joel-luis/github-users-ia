'use client'

import { useRef, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Send, Loader2, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useGitHubUsersStore } from '@/store/use-github-users-store'
import { useAISearchStore } from '@/store/use-ai-search-store'

interface AISearchDialogProps {
  open: boolean
  onClose: () => void
}

export function AISearchDialog({ open, onClose }: AISearchDialogProps) {
  const { prompt, isLoading, response, error } = useAISearchStore(
    (store) => store.state
  )
  const { setPrompt, submitPrompt } = useAISearchStore((store) => store.actions)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { setSearchQuery } = useGitHubUsersStore((store) => store.actions)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      await submitPrompt({
        pushRoute: (path) => router.push(path),
        setSearchQuery,
        pathname
      })
    },
    [submitPrompt, router, setSearchQuery, pathname]
  )

  const handleInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      ;(inputRef as React.RefObject<HTMLInputElement | null>).current = node
      if (open && node) {
        node.focus()
      }
    },
    [open]
  )

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="bg-card border-border fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border shadow-2xl">
        <div className="border-border flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary h-5 w-5" />
            <h2 className="text-foreground text-sm font-semibold">AI Search</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <p className="text-muted-foreground mb-3 text-xs">
            Describe what you want to search in natural language. Example:
            &quot;show me octocat&apos;s repositories&quot;
          </p>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              ref={handleInputRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g.: find repos by joel-luis..."
              disabled={isLoading}
              className="flex-1"
              maxLength={500}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>

          {response && (
            <div className="bg-muted/50 mt-3 rounded-lg p-3">
              <p className="text-foreground text-sm">{response.message}</p>
              {response.intent === 'unknown' && (
                <p className="text-muted-foreground mt-1 text-xs">
                  Try something like: &quot;show me octocat&apos;s repos&quot;
                  or &quot;search for react developers&quot;
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 mt-3 rounded-lg p-3">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
