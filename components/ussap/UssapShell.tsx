"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserAvatarMenu } from "@/components/UserAvatarMenu";
import { NavIconGlyph } from "@/components/icons/NavIcons";
import { AppSidebarLayout } from "@/components/layout/AppSidebarLayout";
import { useAuth } from "@/lib/auth";
import { BRAND } from "@/lib/ussap/data";
import { HOME_HREF } from "@/lib/site-nav";
import { canAccessAdminConsole, canAccessGovernmentPortal } from "@/lib/ussap/rbac";

type NavItem = { href: string; label: string; icon: string; exact?: boolean };

const PRIMARY_NAV: NavItem[] = [
  { href: "/ussap/sectors", label: "All sectors", icon: "▦", exact: true },
  { href: "/ussap/map", label: "Live map", icon: "🗺" },
];

const SECTOR_NAV: NavItem[] = [
  { href: "/ussap/schools", label: "Education", icon: "🎓" },
  { href: "/ussap/health", label: "Health", icon: "🏥" },
  { href: "/ussap/billboards", label: "Billboards", icon: "📢" },
  { href: "/hotels", label: "Hotels", icon: "🏨" },
  { href: "/ussap/telecom", label: "Telecom", icon: "📡" },
  { href: "/ussap/projects", label: "Projects", icon: "🏗" },
  { href: "/ussap/traffic", label: "Traffic", icon: "🚦" },
  { href: "/ussap/residential", label: "Addresses", icon: "🏠" },
  { href: "/ussap/field", label: "Field", icon: "📍" },
  { href: "/ussap/sectors/core", label: "Bastion", icon: "🛡️" },
];

function isActive(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href;
  if (item.href === "/ussap/sectors") {
    return pathname === "/ussap/sectors" || pathname.startsWith("/ussap/sectors/");
  }
  if (item.href === "/ussap/schools") {
    return pathname === "/ussap/schools" || pathname.startsWith("/ussap/schools/");
  }
  if (item.href === "/ussap/health") {
    return pathname === "/ussap/health" || pathname.startsWith("/ussap/health/");
  }
  if (item.href === "/hotels") {
    return pathname === "/hotels" || pathname.startsWith("/hotels/");
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function NavLink({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const active = isActive(pathname, item);
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-white/15 text-white"
          : "text-white/75 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span aria-hidden className="flex h-5 w-5 shrink-0 items-center justify-center">
        <NavIconGlyph icon={item.icon} />
      </span>
      {item.label}
    </Link>
  );
}

function SidebarNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const showConsole = canAccessAdminConsole(user?.role);
  const showGov = canAccessGovernmentPortal(user?.role);

  return (
    <nav className="space-y-1">
      {PRIMARY_NAV.map((item) => (
        <NavLink key={item.href} item={item} pathname={pathname} />
      ))}

      <p className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
        Sectors
      </p>
      {SECTOR_NAV.map((item) => (
        <NavLink key={item.href} item={item} pathname={pathname} />
      ))}

      <p className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
        Workspace
      </p>
      <NavLink
        item={{ href: "/dashboard", label: "Dashboard", icon: "dashboard" }}
        pathname={pathname}
      />
      <NavLink
        item={{ href: "/account", label: "Profile", icon: "⚙" }}
        pathname={pathname}
      />
      {showGov ? (
        <NavLink
          item={{ href: "/government", label: "Government", icon: "🏛" }}
          pathname={pathname}
        />
      ) : null}
      {showConsole ? (
        <NavLink
          item={{ href: "/ussap/console", label: "Admin console", icon: "🛠" }}
          pathname={pathname}
        />
      ) : null}
      <NavLink item={{ href: HOME_HREF, label: "Public site", icon: "↗" }} pathname={pathname} />
    </nav>
  );
}

/** USSAP app chrome — navy sidebar shared by all sector pages. */
export function UssapShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <AppSidebarLayout
      brandHref="/ussap/sectors"
      brandTitle={BRAND.name}
      brandSubtitle="Spatial sectors"
      nav={<SidebarNav />}
      headerRight={
        user ? (
          <UserAvatarMenu size="sm" />
        ) : (
          <Link href="/login" className="text-sm font-medium text-[#1e3a5f]">
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
        ) : (
          <Link
            href="/login?redirect=/ussap/sectors"
            className="block rounded-lg bg-white/10 px-3 py-2 text-center text-sm font-medium text-white hover:bg-white/15"
          >
            Sign in
          </Link>
        )
      }
    >
      {children}
    </AppSidebarLayout>
  );
}
