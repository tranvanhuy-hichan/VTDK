import React from "react";

export function TableSkeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse text-left">
      {/* Toolbar Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-3 sm:p-3.5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          <div className="h-10 w-full sm:w-56 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          <div className="h-10 w-full sm:w-72 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        </div>
        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 justify-end">
          <div className="h-10 w-36 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          <div className="h-10 w-36 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>
      </div>

      {/* Table List Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/5 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-3 w-1/4 bg-slate-100 dark:bg-slate-800 rounded" />
              </div>
              <div className="h-6 w-24 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0" />
              <div className="h-6 w-28 bg-slate-200 dark:bg-slate-700 rounded-lg shrink-0" />
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="w-full py-2 px-1 sm:px-2 space-y-4 animate-pulse text-left">
      {/* Top Header Navigation Skeleton */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          <div className="space-y-1.5">
            <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-6 w-56 bg-slate-300 dark:bg-slate-600 rounded-lg" />
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-20 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          <div className="h-9 w-32 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>
      </div>

      {/* 2-Column Form Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-10 w-full bg-slate-100 dark:bg-slate-800 rounded-xl" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-10 w-full bg-slate-100 dark:bg-slate-800 rounded-xl" />
              <div className="h-10 w-full bg-slate-100 dark:bg-slate-800 rounded-xl" />
            </div>
            <div className="h-20 w-full bg-slate-100 dark:bg-slate-800 rounded-xl" />
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="h-5 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-10 w-full bg-slate-100 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 h-full min-h-[300px]">
            <div className="h-5 w-36 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-40 w-full bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700" />
            <div className="grid grid-cols-3 gap-3">
              <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl" />
              <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl" />
              <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse text-left">
      <div className="flex justify-end mb-3">
        <div className="h-9 w-40 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-3 overflow-hidden">
            <div className="aspect-[16/9] w-full bg-slate-100 dark:bg-slate-800 rounded-lg" />
            <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-3.5 w-5/6 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <div className="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
              <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
