import { Skeleton } from '@/components/ui/skeleton';

export function ProcessSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => {
        return (
          <div key={i}>
            <Skeleton className="h-[210px] w-[412px]" />
          </div>
        );
      })}
    </>
  );
}
