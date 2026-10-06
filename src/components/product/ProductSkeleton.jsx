import React from 'react';
import Skeleton from '../ui/Skeleton';

export default function ProductSkeleton() {
  return (
    <div className="bg-white/50 rounded-2xl overflow-hidden border border-white/40 p-2 flex flex-col gap-2">
      <Skeleton className="w-full aspect-[3/4] rounded-xl" />
      <div className="p-2 space-y-2">
        <Skeleton className="w-3/4 h-4 rounded" />
        <Skeleton className="w-1/3 h-3 rounded" />
      </div>
    </div>
  );
}
