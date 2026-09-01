"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserAvatarMenu } from "@/components/UserAvatarMenu";
import { AppSidebarLayout } from "@/components/layout/AppSidebarLayout";
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
        className="block rounded-lg px-3 py-2 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
      >
        USSAP console
      </Link>
      <Link
        href="/ussap/sectors"
        className="block rounded-lg px-3 py-2 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
      >
        All sectors
      </Link>
      <Link
        href="/"
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
    <AppSidebarLayout
      brandHref="/admin"
      brandTitle={BRAND_NAME}
      brandSubtitle="Admin console"
      mobileTitle={`${BRAND_NAME} Admin`}
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
