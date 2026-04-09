import { useEffect, useRef } from 'react'
import { UseInfiniteScrollOptions } from '@/types/hooks/useInfiniteScroll'

export function useInfiniteScroll({
  hasMore,
  isFetching,
  onLoadMore,
  threshold = 0.1
}: UseInfiniteScrollOptions) {
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting && hasMore && !isFetching) {
          onLoadMore()
        }
      },
      { threshold }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasMore, isFetching, onLoadMore, threshold])

  return loadMoreRef
}
