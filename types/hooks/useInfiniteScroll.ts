export type UseInfiniteScrollOptions = {
  hasMore: boolean
  isFetching: boolean
  onLoadMore: () => void
  threshold?: number
}
