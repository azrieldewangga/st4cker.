import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-muted",
                className
            )}
        />
    );
};

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
    return (
        <div className="rounded-md border">
            <div className="p-4">
                <div className="space-y-3">
                    {Array.from({ length: rows }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const SkeletonCard: React.FC = () => {
    return (
        <div className="rounded-lg border bg-card p-6">
            <div className="space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    );
};

export const SkeletonChart: React.FC = () => {
    return (
        <div className="rounded-lg border bg-card p-6">
            <Skeleton className="h-4 w-1/3 mb-4" />
            <Skeleton className="h-[200px] w-full" />
        </div>
    );
};
