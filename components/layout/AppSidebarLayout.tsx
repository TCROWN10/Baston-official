"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

type Props = {
  brandHref: string;
  brandTitle: string;
  brandSubtitle: string;
  mobileTitle?: string;
  nav: ReactNode;
  footer?: ReactNode;
  headerRight?: ReactNode;
  children: ReactNode;
  mainClassName?: string;
};

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Shared app layout — collapsible sidebar on mobile, always visible on desktop. */
export function AppSidebarLayout({
  brandHref,
  brandTitle,
  brandSubtitle,
  mobileTitle,
  nav,
  footer,
  headerRight,
  children,
  mainClassName = "",
}: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);
  const toggleMobile = () => setMobileOpen((open) => !open);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="relative z-[60] flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={toggleMobile}
            aria-expanded={mobileOpen}
            aria-controls="app-sidebar"
            aria-label={mobileOpen ? "Close sidebar" : "Open sidebar"}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-[#1e3a5f] transition hover:bg-slate-50"
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          <Link
            href={brandHref}
            className="truncate text-sm font-bold tracking-[0.1em] text-[#1e3a5f]"
          >
            {mobileTitle ?? brandTitle}
          </Link>
        </div>
        {headerRight}
      </header>

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 cursor-default bg-black/40 lg:hidden"
          onClick={closeMobile}
        />
      ) : null}

      <div className="mx-auto flex max-w-[1440px] lg:flex-row">
        <aside
          id="app-sidebar"
          className={`fixed inset-y-0 left-0 z-50 flex w-[min(100%,280px)] flex-col bg-[#1e3a5f] shadow-xl transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-60 lg:translate-x-0 lg:shadow-none ${
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-5 sm:py-5">
            <div className="min-w-0">
              <Link href={brandHref} className="text-base font-bold tracking-[0.12em] text-white">
                {brandTitle}
              </Link>
              <p className="mt-1 text-xs text-white/60">{brandSubtitle}</p>
            </div>
            <button
              type="button"
              onClick={closeMobile}
              aria-label="Close sidebar"
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10 lg:hidden"
            >
              <CloseIcon />
            </button>
          </div>

          <div
            className="flex-1 overflow-y-auto overscroll-contain px-3 py-3 lg:py-4"
            onClick={closeMobile}
          >
            {nav}
          </div>

          {footer ? (
            <div className="border-t border-white/10 px-4 py-4 lg:shrink-0">{footer}</div>
          ) : null}
        </aside>

        <main
          className={`min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 ${mainClassName}`.trim()}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
