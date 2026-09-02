"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserAvatarMenu } from "@/components/UserAvatarMenu";
import { AppSidebarLayout } from "@/components/layout/AppSidebarLayout";
import { useAuth } from "@/lib/auth";
import { BRAND_NAME } from "@/lib/data";
import { HOME_HREF } from "@/lib/site-nav";
import { BRAND } from "@/lib/brand";

const NAV = [
  { href: "/government", label: "Overview", exact: true },
  { href: "/government/accounts", label: "All accounts" },
  { href: "/government/hotels", label: "Hotels" },
  { href: "/government/companies", label: "Companies" },
  { href: "/government/schools", label: "Schools" },
  { href: "/government/vehicles", label: "Vehicles & plates" },
  { href: "/government/cctv", label: "CCTV & traffic" },
  { href: "/government/taxes", label: "Taxes paid / owed" },
  { href: "/government/billboards", label: "Billboards" },
  { href: "/government/markets", label: "Markets" },
  { href: "/government/projects", label: "Projects" },
] as const;

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact || href === "/government") return pathname === "/government";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function GovShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user || (user.role !== "government" && user.role !== "admin")) {
      router.replace("/login?redirect=/government");
    }
  }, [loading, user, router]);

  if (loading || !user || (user.role !== "government" && user.role !== "admin")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-gray-600">
        Checking government access…
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
        href="/ussap/sectors"
        className="block rounded-lg px-3 py-2 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
      >
        {BRAND.name} sectors
      </Link>
      <Link
        href="/ussap/map"
        className="block rounded-lg px-3 py-2 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
      >
        Live map
      </Link>
      <Link
        href={HOME_HREF}
        className="block rounded-lg px-3 py-2 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
      >
        Public site
      </Link>
      <button
        type="button"
        onClick={() => {
          logout();
          router.push(HOME_HREF);
        }}
        className="mt-2 w-full cursor-pointer rounded-lg border border-white/20 px-3 py-2 text-left text-sm font-medium text-white/80 hover:bg-white/10"
      >
        Log out
      </button>
    </nav>
  );

  return (
    <AppSidebarLayout
      brandHref="/government"
      brandTitle={BRAND_NAME}
      brandSubtitle="Government portal"
      mobileTitle={`${BRAND_NAME} · Gov`}
      nav={nav}
      headerRight={<UserAvatarMenu size="sm" />}
      footer={
        <div className="flex items-center gap-3">
          <UserAvatarMenu size="sm" align="left" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user.fullName}</p>
            <p className="truncate text-xs text-white/55">{user.email}</p>
          </div>
        </div>
      }
    >
      {children}
    </AppSidebarLayout>
  );
}
