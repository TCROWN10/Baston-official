"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { BRAND_NAME } from "@/lib/data";

const NAV = [
  { href: "/government", label: "Overview" },
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
];

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
        Checking government access...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/government" className="font-bold text-black">
            {BRAND_NAME} · Government
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-600">{user.fullName}</span>
            <Link href="/" className="text-gray-600 hover:text-black">
              Public site
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="rounded-lg border border-gray-300 px-3 py-1.5"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-2xl bg-white p-3 shadow-sm">
          <nav className="space-y-1">
            {NAV.map((item) => {
              const active =
                item.href === "/government"
                  ? pathname === "/government"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                    active ? "bg-[#1e3a5f] text-white" : "text-gray-700 hover:bg-[#1e3a5f]/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
