import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const LoanCardSkeleton = () => {
  return (
    <Card className="p-6 animate-fade-in">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-28" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>

        {/* Button */}
        <Skeleton className="h-10 w-full rounded-full" />
      </div>
    </Card>
  );
};
