"use client";

import React from "react";

export type BadgeVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "blue"
  | "outline";

export type BadgeSize = "xs" | "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary:
    "bg-[#075FA8] text-white border border-transparent",
  blue:
    "bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-300 border border-blue-200 dark:border-blue-800",
  success:
    "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60",
  warning:
    "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60",
  danger:
    "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60",
  neutral:
    "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
  outline:
    "bg-transparent text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700",
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: "text-[9px] px-1 py-0.2 rounded font-medium gap-0.5",
  sm: "text-[10px] px-1.5 py-0.5 rounded-md font-bold gap-1",
  md: "text-xs px-2 py-0.5 rounded-md font-bold gap-1",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  size = "sm",
  icon,
  dot,
  children,
  className = "",
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center tracking-tight shrink-0 select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
