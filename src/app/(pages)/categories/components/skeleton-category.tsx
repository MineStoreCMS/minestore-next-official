import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonCategory() {
    return (
        <div>
            <div className="w-full flex-col items-center justify-center p-4">
                <Skeleton className="mb-4 h-6 w-1/2" />

                <Skeleton className="h-4 w-1/4" />
                <hr className="mt-5 w-full border-[3px] border-primary" />
            </div>
            <div className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(min(16rem,100%),1fr))] gap-4 p-4">
                {Array(6)
                    .fill(0)
                    .map((_, i) => (
                        <Skeleton
                            key={i}
                            className="min-h-[220px] border border-accent-foreground/10"
                        />
                    ))}
            </div>
        </div>
    );
}
