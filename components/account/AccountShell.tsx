"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserAvatarMenu } from "@/components/UserAvatarMenu";
import { AppSidebarLayout } from "@/components/layout/AppSidebarLayout";
import { useAuth } from "@/lib/auth";
import { BRAND } from "@/lib/ussap/data";
import { canAccessAdminConsole, canAccessGovernmentPortal, dashboardPath } from "@/lib/ussap/rbac";
import type { UssapRole } from "@/lib/ussap/types";

const NAV = [
  { href: "/account", label: "Profile settings", icon: "⚙", exact: true },
  { href: "/account/trips", label: "My trips", icon: "✈" },
] as const;

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact || href === "/account") return pathname === "/account";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type Props = {
  children: React.ReactNode;
  requireAuth?: boolean;
  wide?: boolean;
};

export function AccountShell({ children, requireAuth = true, wide = false }: Props) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!requireAuth || loading) return;
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [requireAuth, loading, user, router, pathname]);

  if (requireAuth && (loading || !user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-600">
        Loading profile…
      </div>
    );
  }

  const dashHref = user ? dashboardPath(user.role as UssapRole) : "/dashboard";
  const showGov = canAccessGovernmentPortal(user?.role);
  const showConsole = canAccessAdminConsole(user?.role);

  const nav = (
    <nav className="space-y-1">
      {NAV.map((item) => {
        const active = isActive(pathname, item.href, "exact" in item ? item.exact : false);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-white/15 text-white"
                : "text-white/75 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span aria-hidden className="w-5 text-center text-xs">
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}

      <p className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
        Workspace
      </p>
      <Link
        href={dashHref}
        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
      >
        <span aria-hidden className="w-5 text-center text-xs">
          ⌂
        </span>
        Dashboard
      </Link>
      <Link
        href="/ussap/sectors"
        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
      >
        <span aria-hidden className="w-5 text-center text-xs">
          ▦
        </span>
        USSAP sectors
      </Link>
      {showGov ? (
        <Link
          href="/government"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
        >
          <span aria-hidden className="w-5 text-center text-xs">
            🏛
          </span>
          Government
        </Link>
      ) : null}
      {showConsole ? (
        <Link
          href="/ussap/console"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
        >
          <span aria-hidden className="w-5 text-center text-xs">
            🛠
          </span>
          Admin console
        </Link>
      ) : null}
      <Link
        href="/"
        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
      >
        <span aria-hidden className="w-5 text-center text-xs">
          ↗
        </span>
        Public site
      </Link>
      {user ? (
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="mt-2 flex w-full cursor-pointer items-center gap-2.5 rounded-lg border border-white/20 px-3 py-2 text-left text-sm font-medium text-white/80 hover:bg-white/10"
        >
          <span aria-hidden className="w-5 text-center text-xs">
            ⎋
          </span>
          Log out
        </button>
      ) : null}
    </nav>
  );

  return (
    <AppSidebarLayout
      brandHref="/account"
      brandTitle={BRAND.name}
      brandSubtitle="My account"
      mobileTitle="My account"
      nav={nav}
      headerRight={
        user ? (
          <UserAvatarMenu size="sm" />
        ) : (
          <Link href="/login?redirect=/account" className="text-sm font-medium text-[#1e3a5f]">
            Sign in
          </Link>
        )
      }
      footer={
        user ? (
          <div className="flex items-center gap-3">
            <UserAvatarMenu size="sm" align="left" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user.fullName}</p>
              <p className="truncate text-xs text-white/55">{user.email}</p>
            </div>
          </div>
        ) : undefined
      }
      mainClassName={wide ? "[&>*]:mx-auto [&>*]:max-w-5xl" : "[&>*]:mx-auto [&>*]:max-w-3xl"}
    >
      {children}
    </AppSidebarLayout>
  );
}
