'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AISearchDialog } from '@/components/ai-search-dialog'
import { useAISearchStore } from '@/store/use-ai-search-store'

export function AISearchButton() {
  const isOpen = useAISearchStore((store) => store.state.isOpen)
  const { open, close } = useAISearchStore((store) => store.actions)
  const pathname = usePathname()
  const prevPathname = useRef(pathname)

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname
      close()
    }
  }, [pathname, close])

  return (
    <>
      <Button
        onClick={open}
        variant="outline"
        className="mt-6 gap-2 rounded-full px-6 py-3"
      >
        <Sparkles className="h-4 w-4" />
        <span className="text-sm font-medium">Search with AI</span>
      </Button>

      <AISearchDialog open={isOpen} onClose={close} />
    </>
  )
}
