import { Skeleton } from '@/components/ui/skeleton';

export const LoanCardSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card p-5 shadow-sm">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-muted/10 to-muted/5" />
      <div className="relative space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-4 w-24 rounded-full" />
          </div>
          <Skeleton className="h-12 w-12 rounded-2xl" />
        </div>

        <div className="grid gap-3 border-y border-border/40 py-4 md:grid-cols-3">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-20 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-20 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
        </div>

        <Skeleton className="h-11 w-full rounded-full" />
      </div>
    </div>
  );
};
