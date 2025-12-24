import React from 'react';
import MediaItem from './MediaItem';
import { LuImageOff } from 'react-icons/lu';

const MediaGrid = ({ items, status, error, lastItemRef }) => {
  // 1. Loading State with Skeleton Grids
  if (status === 'loading' && items.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-slate-800 animate-pulse rounded-xl aspect-[3/4] w-full" />
        ))}
      </div>
    );
  }

  // 2. Error State
  if (status === 'failed') {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-900/30">
        <LuImageOff className="text-red-400 dark:text-red-500 mb-3" size={40} />
        <p className="text-red-600 dark:text-red-400 font-medium">Failed to load media</p>
        <span className="text-red-400 dark:text-red-500 text-sm">{error}</span>
      </div>
    );
  }

  // 3. Empty State
  if (status === 'succeeded' && items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-slate-400 text-lg">No assets match your search.</p>
      </div>
    );
  }

  // 4. Final Grid Layout (Masonry-like)
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5 p-4 md:p-8">
      {items.map((item, index) => {
        const isLastItem = items.length === index + 1;
        return (
          <div ref={isLastItem ? lastItemRef : null} key={`${item.id}-${item.source}`} className="break-inside-avoid animate-in fade-in zoom-in duration-500">
            <MediaItem item={item} />
          </div>
        );
      })}
    </div>
  );
};

export default MediaGrid;