"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { SidebarPanelToggleIcon } from "@/components/icons/NavIcons";
import { BrandLogo } from "@/components/BrandLogo";
import { BrandLogoLink } from "@/components/BrandLogoLink";

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

function SidebarPanel({
  brandHref,
  brandTitle,
  brandSubtitle,
  nav,
  footer,
  navClassName = "",
}: {
  brandHref: string;
  brandTitle: string;
  brandSubtitle: string;
  nav: ReactNode;
  footer?: ReactNode;
  navClassName?: string;
}) {
  return (
    <>
      <div className="border-b border-white/10 px-4 py-4 sm:px-5 sm:py-5">
        <BrandLogoLink singleHref={brandHref} className="flex items-center gap-3">
          <BrandLogo size="sm" />
          <span className="text-base font-bold tracking-[0.08em] text-white">{brandTitle}</span>
        </BrandLogoLink>
        <p className="mt-1 text-xs text-white/60">{brandSubtitle}</p>
      </div>
      <div className={`flex-1 overflow-y-auto px-3 py-3 lg:py-4 ${navClassName}`}>{nav}</div>
      {footer ? (
        <div className="shrink-0 border-t border-white/10 px-4 py-4">{footer}</div>
      ) : null}
    </>
  );
}

function PanelToggleButton({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="app-sidebar-mobile"
      aria-label={open ? "Close sidebar" : "Open sidebar"}
      title={open ? "Close sidebar" : "Open sidebar"}
      className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#1e3a5f] transition hover:bg-slate-100"
    >
      <SidebarPanelToggleIcon className="h-5 w-5" />
    </button>
  );
}

function SeamToggleIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
      {collapsed ? (
        <path
          d="M1.5 2.5L4.5 5L1.5 7.5M5.5 2.5L8.5 5L5.5 7.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M8.5 2.5L5.5 5L8.5 7.5M4.5 2.5L1.5 5L4.5 7.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

/**
 * Mobile & tablet: narrow slide-out drawer (does not cover the whole page).
 * Desktop: sticky sidebar with seam chevron on the edge.
 */
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
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("ussap-sidebar-collapsed") === "1") {
      setDesktopCollapsed(true);
    }
  }, []);

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

  const closeMobile = () => {
    setMobileOpen(false);
    localStorage.setItem("ussap-sidebar-mobile-open", "0");
  };

  const toggleMobile = () => {
    setMobileOpen((prev) => {
      const next = !prev;
      localStorage.setItem("ussap-sidebar-mobile-open", next ? "1" : "0");
      return next;
    });
  };

  const toggleDesktop = () => {
    setDesktopCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("ussap-sidebar-collapsed", next ? "1" : "0");
      return next;
    });
  };

  return (
    <div className="min-h-screen max-w-[100vw] overflow-x-hidden bg-slate-100">
      {/* Mobile + tablet header */}
      <header className="relative z-[60] flex items-center gap-2 border-b border-slate-200 bg-white px-3 py-3 lg:hidden">
        <PanelToggleButton open={mobileOpen} onToggle={toggleMobile} />
        <Link
          href={brandHref}
          className="min-w-0 flex-1 truncate text-sm font-bold tracking-[0.1em] text-[#1e3a5f]"
        >
          {mobileTitle ?? brandTitle}
        </Link>
        {headerRight}
      </header>

      {/* Mobile + tablet: dim backdrop + narrow drawer */}
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-[50] bg-black/40 lg:hidden"
          onClick={closeMobile}
        />
      ) : null}

      <aside
        id="app-sidebar-mobile"
        aria-hidden={!mobileOpen}
        className={`fixed left-0 top-0 z-[55] flex h-full w-[min(280px,85vw)] max-w-[280px] flex-col bg-[#1e3a5f] shadow-xl transition-transform duration-200 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
      >
        <SidebarPanel
          brandHref={brandHref}
          brandTitle={brandTitle}
          brandSubtitle={brandSubtitle}
          nav={nav}
          footer={footer}
        />
      </aside>

      <div className="mx-auto flex max-w-[1440px] flex-col lg:flex-row">
        {/* Desktop sidebar */}
        <div
          className={`relative hidden shrink-0 overflow-visible transition-[width] duration-200 ease-out lg:block ${
            desktopCollapsed ? "w-0" : "w-60"
          }`}
        >
          <aside
            id="app-sidebar"
            className={`sticky top-0 flex h-screen flex-col overflow-hidden bg-[#1e3a5f] transition-[width] duration-200 ease-out ${
              desktopCollapsed ? "w-0" : "w-60"
            }`}
          >
            <div
              className={`flex h-full w-60 flex-col transition-opacity duration-200 ${
                desktopCollapsed ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
            >
              <SidebarPanel
                brandHref={brandHref}
                brandTitle={brandTitle}
                brandSubtitle={brandSubtitle}
                nav={nav}
                footer={footer}
              />
            </div>
          </aside>

          <button
            type="button"
            onClick={toggleDesktop}
            aria-expanded={!desktopCollapsed}
            aria-controls="app-sidebar"
            title={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="absolute top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md hover:bg-slate-50"
            style={{ right: -14 }}
          >
            <SeamToggleIcon collapsed={desktopCollapsed} />
          </button>
        </div>

        <main
          className={`min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 ${mainClassName}`.trim()}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
