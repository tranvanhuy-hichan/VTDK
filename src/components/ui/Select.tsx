"use client";

import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

export type SelectSize = "sm" | "md" | "lg";

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  selectSize?: SelectSize;
  options?: SelectOption[];
  error?: string;
  label?: string;
  containerClassName?: string;
}

const sizeStyles: Record<SelectSize, string> = {
  sm: "h-7.5 text-xs py-1 pl-2.5 pr-7 rounded-md",
  md: "h-8.5 text-xs py-1.5 pl-3 pr-8 rounded-lg",
  lg: "h-10 text-sm py-2 pl-3.5 pr-9 rounded-xl",
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      selectSize = "md",
      options,
      error,
      label,
      children,
      className = "",
      containerClassName = "",
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={`flex flex-col gap-1 w-full text-left ${containerClassName}`}>
        {label && (
          <label htmlFor={selectId} className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={`w-full appearance-none bg-slate-50 dark:bg-slate-800 border transition-all text-slate-900 dark:text-white font-bold cursor-pointer focus:bg-white dark:focus:bg-slate-900 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                : "border-slate-200 dark:border-slate-700 focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8]"
            } ${sizeStyles[selectSize]} ${className}`}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <span className="absolute right-2.5 pointer-events-none text-slate-400 dark:text-slate-500 flex items-center">
            <ChevronDown className="w-3.5 h-3.5" />
          </span>
        </div>
        {error && <p className="text-[10.5px] text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
