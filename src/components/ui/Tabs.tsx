"use client";

import React from "react";

export interface TabItem<T extends string = string> {
  key: T;
  label: string;
  count?: number;
  icon?: React.ReactNode;
  dot?: boolean;
}

export interface TabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeKey: T;
  onChange: (key: T) => void;
  size?: "sm" | "md";
  variant?: "segmented" | "pills";
  className?: string;
}

export function Tabs<T extends string = string>({
  tabs,
  activeKey,
  onChange,
  size = "md",
  variant = "segmented",
  className = "",
}: TabsProps<T>) {
  const isSegmented = variant === "segmented";

  const sizeClasses = {
    sm: "h-7 text-[10.5px] px-2 rounded-md gap-1",
    md: "h-8 text-xs px-2.5 rounded-lg gap-1.5",
  }[size];

  return (
    <div className="w-full max-w-full overflow-x-auto custom-scrollbar py-0.5">
      <div
        className={`inline-flex items-center gap-1 flex-nowrap min-w-full sm:min-w-0 ${
          isSegmented
            ? "bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80"
            : "pb-0.5"
        } ${className}`}
      >
        {tabs.map((tab) => {
          const isActive = activeKey === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`font-bold transition-all inline-flex items-center justify-center cursor-pointer select-none shrink-0 whitespace-nowrap !min-h-0 ${sizeClasses} ${
                isActive
                  ? isSegmented
                    ? "bg-white dark:bg-slate-900 text-[#075FA8] dark:text-blue-400 shadow-2xs font-black"
                    : "bg-[#075FA8] text-white shadow-xs"
                  : isSegmented
                  ? "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={`text-[9px] px-1 py-0.2 rounded-full font-mono font-bold ${
                    isActive
                      ? isSegmented
                        ? "bg-blue-50 dark:bg-blue-950 text-[#075FA8] dark:text-blue-300"
                        : "bg-white/20 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {tab.dot && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
