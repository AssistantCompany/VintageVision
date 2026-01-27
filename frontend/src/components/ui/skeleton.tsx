import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Animation style */
  animation?: "pulse" | "shimmer" | "none"
}

function Skeleton({
  className,
  animation = "shimmer",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted",
        animation === "pulse" && "animate-pulse",
        animation === "shimmer" && "skeleton-shimmer",
        className
      )}
      {...props}
    />
  )
}

// Collection Item Skeleton (Dark Theme)
function CollectionItemSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}

// Collection Grid Skeleton
function CollectionGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CollectionItemSkeleton key={i} />
      ))}
    </div>
  )
}

// Analysis Result Skeleton (Dark Theme)
function AnalysisResultSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Tab Header Skeleton */}
      <div className="flex gap-2 p-1.5 bg-muted rounded-lg">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-md" />
        ))}
      </div>

      {/* Hero Section Skeleton */}
      <div className="rounded-lg border border-border bg-card overflow-hidden p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <Skeleton className="aspect-[4/3] w-full rounded-lg" />

          {/* Content */}
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-22 rounded-full" />
            </div>
            <Skeleton className="h-10 w-36" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex gap-3 pt-4">
              <Skeleton className="h-11 w-30 rounded-lg" />
              <Skeleton className="h-11 w-24 rounded-lg" />
              <Skeleton className="h-11 w-11 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Details Skeleton */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Wishlist Item Skeleton
function WishlistItemSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex gap-4">
        <Skeleton className="h-20 w-20 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-2/3" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  )
}

// Stats Card Skeleton
function StatsCardSkeleton() {
  return (
    <div className="glass rounded-lg p-4 text-center">
      <Skeleton className="h-6 w-6 rounded-full mx-auto mb-2" />
      <Skeleton className="h-7 w-16 mx-auto mb-1" />
      <Skeleton className="h-3 w-20 mx-auto" />
    </div>
  )
}

// Page Header Skeleton
function PageHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-5 w-96 max-w-full" />
    </div>
  )
}

// Card List Skeleton
function CardListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-4 flex gap-4">
          <Skeleton className="h-16 w-16 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

export {
  Skeleton,
  CollectionItemSkeleton,
  CollectionGridSkeleton,
  AnalysisResultSkeleton,
  WishlistItemSkeleton,
  StatsCardSkeleton,
  PageHeaderSkeleton,
  CardListSkeleton,
}
