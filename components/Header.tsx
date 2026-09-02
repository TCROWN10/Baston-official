"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserAvatarMenu } from "@/components/UserAvatarMenu";
import { BrandLogo } from "@/components/BrandLogo";
import { BrandLogoLink } from "@/components/BrandLogoLink";
import { BRAND_NAME } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { HOME_HREF, navActive, DESKTOP_NAV, MOBILE_MARKETPLACE_NAV, MOBILE_USSAP_NAV, TABLET_CHIP_NAV } from "@/lib/site-nav";
import { dashboardPath } from "@/lib/ussap/rbac";
import type { UssapRole } from "@/lib/ussap/types";

export function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const dashHref = user ? dashboardPath(user.role as UssapRole) : "/login";

  const linkClass = (href: string) =>
    navActive(pathname, href)
      ? "rounded-lg bg-[#1e3a5f]/10 px-3 py-1.5 text-sm font-medium text-[#1e3a5f]"
      : "rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-[#1e3a5f]/5 hover:text-[#1e3a5f]";

  return (
    <header className="sticky top-0 left-0 right-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2.5 sm:px-6 sm:py-3.5 lg:px-10">
        <BrandLogoLink className="flex min-w-0 items-center gap-2">
          <BrandLogo size="sm" className="sm:h-10 sm:w-10" />
          <span className="truncate text-base font-bold text-black sm:text-xl">{BRAND_NAME}</span>
        </BrandLogoLink>

        <nav className="hidden items-center gap-1 xl:flex">
          {DESKTOP_NAV.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center lg:flex" role="group" aria-label="Account">
            {user ? (
              <UserAvatarMenu />
            ) : (
              <div className="flex overflow-hidden rounded-md border border-black shadow-sm">
                <Link
                  className="cursor-pointer bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-slate-50"
                  href="/login"
                >
                  Sign in
                </Link>
                <span className="w-px shrink-0 self-stretch bg-black/15" aria-hidden="true" />
                <Link
                  className="cursor-pointer bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#152a45]"
                  href="/signup"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {user ? <UserAvatarMenu size="sm" className="lg:hidden" /> : null}

          <button
            aria-label="Menu"
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-slate-700 hover:bg-slate-50 xl:hidden"
          >
            <span className="text-xl font-semibold">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Tablet chip strip — USSAP sectors + hotels/stays */}
      <div className="scrollbar-hide hidden gap-1 overflow-x-auto border-t border-gray-100 px-3 py-2 md:flex xl:hidden">
        {TABLET_CHIP_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
              navActive(pathname, item.href)
                ? "bg-[#1e3a5f] text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {open ? (
        <div className="max-h-[min(80vh,640px)] overflow-y-auto border-t border-gray-200 bg-white px-3 py-4 sm:px-6 xl:hidden">
          <div className="flex flex-col gap-1">
            <Link href={HOME_HREF} className={linkClass(HOME_HREF)}>
              Home
            </Link>
            <p className="mt-2 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Bastion Technology platform
            </p>
            {MOBILE_USSAP_NAV.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                {item.label}
              </Link>
            ))}
            <p className="mt-2 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Marketplace & hospitality
            </p>
            {MOBILE_MARKETPLACE_NAV.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                {item.label}
              </Link>
            ))}
            <Link href="/search" className={linkClass("/search")}>
              Search listings
            </Link>
            <Link href="/saved" className={linkClass("/saved")}>
              Saved listings
            </Link>
            {user ? (
              <Link href={dashHref} className={linkClass(dashHref)}>
                Dashboard
              </Link>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2 px-1">
                <Link
                  href="/login"
                  className="rounded-lg border border-slate-300 px-3 py-2.5 text-center text-sm font-medium text-black"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-[#1e3a5f] px-3 py-2.5 text-center text-sm font-medium text-white"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
