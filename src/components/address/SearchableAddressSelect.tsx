"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Loader2, Search } from "lucide-react";

interface SearchableOption {
  value: string;
  label: string;
}

interface SearchableAddressSelectProps {
  value: string;
  options: SearchableOption[];
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  loading?: boolean;
  emptyMessage?: string;
}

const normalizeSearchText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .trim();

export const SearchableAddressSelect: React.FC<SearchableAddressSelectProps> = ({
  value,
  options,
  onChange,
  placeholder,
  disabled = false,
  loading = false,
  emptyMessage = "Không tìm thấy kết quả",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);
  const [query, setQuery] = useState(selectedOption?.label || "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setQuery(selectedOption?.label || "");
  }, [selectedOption?.label]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setQuery(selectedOption?.label || "");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedOption?.label]);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery || query === selectedOption?.label) return options;
    return options.filter((option) => normalizeSearchText(option.label).includes(normalizedQuery));
  }, [options, query, selectedOption?.label]);

  return (
    <div ref={containerRef} className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={query}
        disabled={disabled}
        placeholder={loading ? "Đang tải danh sách..." : placeholder}
        onFocus={() => !disabled && setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-8 text-xs font-medium text-slate-900 outline-none focus:border-[#075FA8] focus:ring-2 focus:ring-[#075FA8]/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        aria-label="Mở danh sách"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-700 disabled:cursor-not-allowed !min-h-0 dark:hover:text-white"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>

      {open && !disabled && (
        <div className="absolute z-40 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-900">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setQuery(option.label);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors !min-h-0 ${
                  option.value === value
                    ? "bg-blue-50 font-bold text-[#075FA8] dark:bg-blue-950/50 dark:text-blue-300"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <span>{option.label}</span>
                {option.value === value && <Check className="h-3.5 w-3.5 shrink-0" />}
              </button>
            ))
          ) : (
            <p className="px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400">{emptyMessage}</p>
          )}
        </div>
      )}
    </div>
  );
};