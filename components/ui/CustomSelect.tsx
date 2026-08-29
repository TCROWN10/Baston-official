"use client";

import { useEffect, useId, useRef, useState } from "react";

export type SelectOption = { value: string; label: string };

export function CustomSelect({
  value,
  onChange,
  options,
  ariaLabel,
  placeholder = "Select",
  className = "",
  size = "md",
  leading,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  ariaLabel?: string;
  placeholder?: string;
  className?: string;
  size?: "sm" | "md";
  leading?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((o) => o.value === value);
  const isPlaceholder = !selected || selected.value === "";
  const label = selected?.label || placeholder;

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={ariaLabel || placeholder}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className={`custom-select-trigger flex w-full cursor-pointer items-center gap-2 text-left ${
          size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-4 py-2.5 text-sm sm:py-3"
        } ${leading ? "pl-10 sm:pl-11" : ""} ${open ? "is-open" : ""}`}
      >
        {leading ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#1e3a5f]">
            {leading}
          </span>
        ) : null}
        <span
          className={`min-w-0 flex-1 truncate ${
            isPlaceholder ? "text-slate-500" : "font-medium text-[#1e3a5f]"
          }`}
        >
          {label}
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-[#1e3a5f] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="custom-select-menu absolute z-50 mt-2 max-h-64 w-full overflow-auto py-2"
        >
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <li key={`${opt.value}::${opt.label}`} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-center px-3.5 py-2.5 text-left text-sm transition-colors ${
                    active
                      ? "bg-[#1e3a5f] font-medium text-white"
                      : "text-slate-800 hover:bg-[#1e3a5f]/08 hover:text-[#1e3a5f]"
                  }`}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
