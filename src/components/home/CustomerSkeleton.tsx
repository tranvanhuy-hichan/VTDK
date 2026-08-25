"use client";

import React from "react";

export const CustomerProductCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col animate-pulse">
    {/* Image placeholder */}
    <div className="aspect-[16/10] bg-slate-200 dark:bg-slate-800 w-full" />
    
    {/* Body placeholder */}
    <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
      <div className="space-y-1.5">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-4/5" />
        <div className="h-3 bg-slate-150 dark:bg-slate-800/60 rounded-md w-3/5" />
      </div>

      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-1">
        <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded-sm w-16" />
        <div className="h-4 bg-slate-250 dark:bg-slate-700 rounded-md w-24" />
      </div>
    </div>
  </div>
);

export const CustomerHeroSkeleton: React.FC = () => (
  <div className="w-full bg-slate-900 text-white py-8 sm:py-12 px-4 animate-pulse">
    <div className="max-w-4xl mx-auto text-center space-y-3">
      <div className="h-5 bg-slate-800 rounded-full w-44 mx-auto" />
      <div className="h-9 bg-slate-800 rounded-xl w-3/4 mx-auto" />
      <div className="h-4 bg-slate-800 rounded-md w-1/2 mx-auto" />
    </div>
  </div>
);

export const CustomerProductDetailSkeleton: React.FC = () => (
  <div className="w-full min-h-screen bg-[#F6F8FA] dark:bg-[#0F172A] pt-0 pb-8">
    <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-4">
      {/* Breadcrumb line skeleton */}
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-56 animate-pulse my-1" />

      {/* Main Product Card skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-md p-4 sm:p-8 lg:p-10 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Left Column: Image skeleton */}
          <div className="lg:col-span-5 w-full aspect-square sm:aspect-[4/3] lg:aspect-square bg-slate-200 dark:bg-slate-800 rounded-2xl max-h-[380px]" />

          {/* Right Column: Details skeleton */}
          <div className="lg:col-span-7 space-y-4">
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-24" />
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4" />
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2" />
            <div className="flex gap-2 pt-2">
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-24" />
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-24" />
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-24" />
            </div>
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Related Products skeleton */}
      <div className="pt-4 space-y-3">
        <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-xl w-56 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-4.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <CustomerProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const CustomerCatalogSkeleton: React.FC = () => (
  <div className="w-full min-h-screen bg-[#F6F8FA] dark:bg-[#0F172A] pb-16">
    {/* Hero skeleton */}
    <div className="bg-gradient-to-r from-[#075FA8] via-[#08457A] to-[#0B2540] py-6 sm:py-8 px-4 animate-pulse">
      <div className="w-full max-w-[1700px] mx-auto space-y-3">
        <div className="h-4 bg-white/20 rounded-md w-40" />
        <div className="h-8 bg-white/20 rounded-xl w-72 mx-auto" />
        <div className="h-4 bg-white/20 rounded-md w-96 max-w-full mx-auto" />
      </div>
    </div>

    {/* Sticky Pills bar skeleton */}
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 px-4">
      <div className="w-full max-w-[1700px] mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-28 shrink-0 animate-pulse" />
        ))}
      </div>
    </div>

    {/* Section grid skeleton (5 Cột trên PC) */}
    <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-10">
      {[1, 2].map((sec) => (
        <div key={sec} className="space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-40 animate-pulse" />
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-20 animate-pulse" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-4.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <CustomerProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const CustomerSolutionsSkeleton: React.FC = () => (
  <div className="w-full min-h-screen bg-[#F6F8FA] dark:bg-[#0F172A] pb-16">
    <div className="bg-gradient-to-r from-[#075FA8] via-[#08457A] to-[#0B2540] py-6 sm:py-8 px-4 animate-pulse">
      <div className="w-full max-w-[1700px] mx-auto space-y-3">
        <div className="h-4 bg-white/20 rounded-md w-40" />
        <div className="h-8 bg-white/20 rounded-xl w-80 mx-auto" />
      </div>
    </div>

    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-2/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="h-10 bg-slate-150 dark:bg-slate-800 rounded-xl" />
            <div className="h-10 bg-slate-150 dark:bg-slate-800 rounded-xl" />
            <div className="h-10 bg-slate-150 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const CustomerContactSkeleton: React.FC = () => (
  <div className="w-full min-h-screen bg-[#F6F8FA] dark:bg-[#0F172A] pb-16">
    <div className="bg-gradient-to-r from-[#075FA8] via-[#08457A] to-[#0B2540] py-6 sm:py-8 px-4 animate-pulse">
      <div className="w-full max-w-[1700px] mx-auto space-y-3">
        <div className="h-4 bg-white/20 rounded-md w-32" />
        <div className="h-8 bg-white/20 rounded-xl w-64 mx-auto" />
      </div>
    </div>

    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2" />
        <div className="space-y-3 pt-2">
          <div className="h-14 bg-slate-150 dark:bg-slate-800 rounded-2xl" />
          <div className="h-14 bg-slate-150 dark:bg-slate-800 rounded-2xl" />
          <div className="h-14 bg-slate-150 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3" />
        <div className="h-64 bg-slate-150 dark:bg-slate-800 rounded-2xl" />
      </div>
    </div>
  </div>
);

export const CustomerHomeSkeleton: React.FC = () => (
  <div className="w-full bg-[#F6F8FA] dark:bg-[#0F172A] pb-16">
    <CustomerHeroSkeleton />
    <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-2 max-w-md mx-auto">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-32 mx-auto animate-pulse" />
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-64 mx-auto animate-pulse" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-4.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <CustomerProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);
