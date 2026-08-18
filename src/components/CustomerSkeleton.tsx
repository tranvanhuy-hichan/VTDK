"use client";

import React from "react";

export const CustomerProductCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col animate-pulse">
    {/* Image placeholder */}
    <div className="aspect-[16/10] bg-slate-200 dark:bg-slate-800 w-full" />
    
    {/* Body placeholder */}
    <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
        <div className="h-3 bg-slate-150 dark:bg-slate-800/60 rounded-md w-1/2" />
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="space-y-1">
          <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded-sm w-12" />
          <div className="h-4 bg-slate-250 dark:bg-slate-700 rounded-md w-20" />
        </div>
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-20" />
      </div>
    </div>
  </div>
);

export const CustomerHeroSkeleton: React.FC = () => (
  <div className="w-full bg-slate-900 text-white py-12 sm:py-16 px-4 animate-pulse">
    <div className="max-w-4xl mx-auto text-center space-y-4">
      <div className="h-6 bg-slate-800 rounded-full w-48 mx-auto" />
      <div className="h-10 bg-slate-800 rounded-xl w-3/4 mx-auto" />
      <div className="h-4 bg-slate-800 rounded-md w-1/2 mx-auto" />
      <div className="h-12 bg-slate-800 rounded-xl w-full max-w-xl mx-auto mt-6" />
    </div>
  </div>
);

export const CustomerCatalogSkeleton: React.FC = () => (
  <div className="w-full min-h-screen bg-[#F6F8FA] dark:bg-[#0F172A] pb-16">
    {/* Hero skeleton */}
    <div className="bg-slate-900 py-8 px-4 animate-pulse">
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <div className="h-5 bg-slate-800 rounded-full w-56 mx-auto" />
        <div className="h-8 bg-slate-800 rounded-xl w-2/3 mx-auto" />
        <div className="h-3 bg-slate-800 rounded-md w-1/2 mx-auto" />
        <div className="h-10 bg-slate-800 rounded-xl w-full max-w-md mx-auto mt-3" />
      </div>
    </div>

    {/* Sticky Pills bar skeleton */}
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-28 shrink-0 animate-pulse" />
        ))}
      </div>
    </div>

    {/* Section grid skeleton */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
      {[1, 2].map((sec) => (
        <div key={sec} className="space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="space-y-1">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-40 animate-pulse" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-60 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CustomerProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const CustomerHomeSkeleton: React.FC = () => (
  <div className="w-full bg-[#F6F8FA] dark:bg-[#0F172A]">
    <CustomerHeroSkeleton />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2 max-w-md mx-auto">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-32 mx-auto animate-pulse" />
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-64 mx-auto animate-pulse" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CustomerProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);
