"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserAvatarMenu } from "@/components/UserAvatarMenu";
import { useAuth } from "@/lib/auth";
import { BRAND_NAME } from "@/lib/data";

const NAV = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/blogs", label: "Blogs" },
  { href: "/admin/properties", label: "Listings" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/settings", label: "Settings" },
] as const;

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact || href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.replace("/login?redirect=/admin");
    }
  }, [loading, user, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-gray-600">
        Checking admin access…
      </div>
    );
  }

  const nav = (
    <nav className="space-y-1">
      {NAV.map((item) => {
        const active = isActive(pathname, item.href, "exact" in item ? item.exact : false);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-white/15 text-white"
                : "text-white/75 hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
      <p className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
        Platform
      </p>
      <Link
        href="/ussap/console"
        onClick={() => setMobileOpen(false)}
        className="block rounded-lg px-3 py-2 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
      >
        USSAP console
      </Link>
      <Link
        href="/ussap/sectors"
        onClick={() => setMobileOpen(false)}
        className="block rounded-lg px-3 py-2 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
      >
        All sectors
      </Link>
      <Link
        href="/"
        onClick={() => setMobileOpen(false)}
        className="block rounded-lg px-3 py-2 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
      >
        Public site
      </Link>
      <button
        type="button"
        onClick={() => {
          logout();
          router.push("/");
        }}
        className="mt-2 w-full cursor-pointer rounded-lg border border-white/20 px-3 py-2 text-left text-sm font-medium text-white/80 hover:bg-white/10"
      >
        Log out
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700"
        >
          Menu
        </button>
        <span className="text-sm font-bold tracking-[0.1em] text-[#1e3a5f]">{BRAND_NAME} Admin</span>
        <UserAvatarMenu size="sm" />
      </header>

      <div className="mx-auto flex max-w-[1440px]">
        <aside className="hidden w-60 shrink-0 flex-col bg-[#1e3a5f] lg:sticky lg:top-0 lg:flex lg:h-screen lg:overflow-y-auto">
          <div className="border-b border-white/10 px-5 py-5">
            <Link href="/admin" className="text-base font-bold tracking-[0.12em] text-white">
              {BRAND_NAME}
            </Link>
            <p className="mt-1 text-xs text-white/60">Admin console</p>
          </div>
          <div className="flex-1 px-3 py-4">{nav}</div>
          <div className="border-t border-white/10 px-4 py-4">
            <div className="flex items-center gap-3">
              <UserAvatarMenu size="sm" align="left" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{user.fullName}</p>
                <p className="truncate text-xs text-white/55">{user.email}</p>
              </div>
            </div>
          </div>
        </aside>

        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="relative flex h-full w-72 flex-col bg-[#1e3a5f] shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
                <span className="font-bold tracking-[0.1em] text-white">{BRAND_NAME}</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="cursor-pointer text-white/80"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-4">{nav}</div>
            </aside>
          </div>
        ) : null}

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
