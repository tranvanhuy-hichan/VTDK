"use client";

import React, { forwardRef } from "react";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  inputSize?: InputSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  helperText?: string;
  label?: string;
  containerClassName?: string;
}

const sizeStyles: Record<InputSize, { input: string; leftPad: string; rightPad: string }> = {
  sm: { input: "h-7.5 text-xs py-1 px-2.5 rounded-md", leftPad: "pl-7.5", rightPad: "pr-7.5" },
  md: { input: "h-8.5 text-xs py-1.5 px-3 rounded-lg", leftPad: "pl-8.5", rightPad: "pr-8.5" },
  lg: { input: "h-10 text-sm py-2 px-3.5 rounded-xl", leftPad: "pl-10", rightPad: "pr-10" },
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      inputSize = "md",
      leftIcon,
      rightIcon,
      error,
      helperText,
      label,
      className = "",
      containerClassName = "",
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const sizeConfig = sizeStyles[inputSize];

    return (
      <div className={`flex flex-col gap-1 w-full text-left ${containerClassName}`}>
        {label && (
          <label htmlFor={inputId} className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <span className="absolute left-2.5 pointer-events-none text-slate-400 dark:text-slate-500 flex items-center justify-center">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={`w-full bg-slate-50 dark:bg-slate-800 border transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                : "border-slate-200 dark:border-slate-700 focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8]"
            } ${sizeConfig.input} ${leftIcon ? sizeConfig.leftPad : ""} ${rightIcon ? sizeConfig.rightPad : ""} ${className}`}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-2.5 flex items-center justify-center text-slate-400 dark:text-slate-500">
              {rightIcon}
            </span>
          )}
        </div>
        {error ? (
          <p className="text-[10.5px] text-red-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-[10.5px] text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
