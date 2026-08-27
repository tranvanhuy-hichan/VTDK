"use client";

import React, { forwardRef } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "success" | "ghost";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#075FA8] hover:bg-[#0B1F33] text-white shadow-xs focus-visible:ring-2 focus-visible:ring-[#075FA8]/40 border border-transparent",
  secondary:
    "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs",
  outline:
    "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700",
  danger:
    "bg-red-600 hover:bg-red-700 text-white shadow-xs border border-transparent",
  success:
    "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs border border-transparent",
  ghost:
    "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-6 text-[10px] px-2 rounded-md gap-1",
  sm: "h-7.5 text-[11px] px-2.5 rounded-lg gap-1.5",
  md: "h-8.5 text-xs px-3 rounded-lg gap-1.5",
  lg: "h-10 text-sm px-4 rounded-xl gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      href,
      target,
      rel,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = `inline-flex items-center justify-center whitespace-nowrap font-bold tracking-tight transition-all cursor-pointer select-none shrink-0 !min-h-0 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    const content = (
      <>
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>
        )}
        {typeof children === "string" ? <span>{children}</span> : children}
        {!isLoading && rightIcon && <span className="shrink-0 flex items-center">{rightIcon}</span>}
      </>
    );

    if (href) {
      return (
        <Link href={href} target={target} rel={rel} className={baseClasses}>
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={baseClasses}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
