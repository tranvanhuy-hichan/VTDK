"use client";

import React from "react";
import Image from "next/image";
import { COMPANY_DATA } from "../../data/company";

export const AuthLoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen w-full flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 animate-pulse transition-colors duration-300">
      {/* 1. Left Showcase Skeleton */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-5/12 bg-gradient-to-br from-[#064B85] via-[#073863] to-[#0A1F33] p-8 xl:p-10 flex-col justify-between relative overflow-hidden border-r border-blue-900/50">
        {/* Top brand placeholder */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <Image
              src={COMPANY_DATA.logoUrl}
              alt="Logo"
              width={36}
              height={36}
              className="h-8 w-auto object-contain opacity-70"
            />
          </div>
          <div className="space-y-1.5">
            <div className="h-3 w-36 bg-white/25 rounded-md" />
            <div className="h-5 w-44 bg-white/30 rounded-md" />
          </div>
        </div>

        {/* Middle placeholder */}
        <div className="space-y-4 my-auto py-2">
          <div className="h-8 w-3/4 bg-white/25 rounded-lg" />
          <div className="h-4 w-full bg-white/15 rounded-md" />
          <div className="h-4 w-2/3 bg-white/15 rounded-md" />

          <div className="grid grid-cols-2 gap-2.5 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 rounded-xl bg-white/10 border border-white/15" />
            ))}
          </div>
        </div>

        {/* Bottom placeholder */}
        <div className="pt-4 border-t border-white/15 flex items-center justify-between">
          <div className="h-3.5 w-40 bg-white/20 rounded-md" />
          <div className="h-3.5 w-28 bg-white/20 rounded-md" />
        </div>
      </div>

      {/* 2. Right Form Skeleton */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-4 my-auto">
          {/* Top back button skeleton */}
          <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />

          {/* Form card skeleton */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/60 dark:shadow-none space-y-5">
            {/* Tab switcher */}
            <div className="h-10 bg-slate-100 dark:bg-slate-800/80 rounded-2xl" />

            {/* Title & subtitle */}
            <div className="space-y-2 text-center flex flex-col items-center">
              <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              <div className="h-3.5 w-64 bg-slate-100 dark:bg-slate-800 rounded-md" />
            </div>

            {/* Input fields */}
            <div className="space-y-3.5 pt-2">
              <div className="space-y-1.5">
                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded-md" />
                <div className="h-10 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded-md" />
                <div className="h-10 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" />
              </div>
            </div>

            {/* Action button */}
            <div className="h-11 bg-[#075FA8]/40 dark:bg-[#075FA8]/30 rounded-xl" />

            {/* Divider */}
            <div className="h-px bg-slate-200 dark:bg-slate-800 w-full my-2" />

            {/* Google button */}
            <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700" />
          </div>
        </div>
      </div>
    </div>
  );
};
