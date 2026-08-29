"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { BRAND_NAME, PROPERTIES } from "@/lib/data";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/blogs", label: "Blogs" },
  { href: "/admin/properties", label: "Listings" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/transactions", label: "Payments" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.replace("/login?redirect=/admin");
    }
  }, [loading, user, router]);

  if (loading || !user || user.role !== "admin") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-2xl bg-white p-4 shadow-sm">
          <p className="mb-4 text-lg font-bold text-black">{BRAND_NAME} Admin</p>
          <nav className="space-y-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                  item.href === "/admin"
                    ? "bg-[#1e3a5f] text-white"
                    : "text-gray-700 hover:bg-[#1e3a5f]/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="mt-6 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            Log out
          </button>
        </aside>

        <main>
          <h1 className="text-2xl font-bold text-black">Overview</h1>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Properties", value: PROPERTIES.length },
              { label: "Active listings", value: PROPERTIES.filter((p) => p.status === "active").length },
              { label: "Categories", value: 3 },
            ].map((card) => (
              <div key={card.label} className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="mt-2 text-3xl font-bold text-black">{card.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-black">Recent listings</h2>
            <ul className="mt-4 divide-y divide-gray-100">
              {PROPERTIES.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center justify-between py-3 text-sm">
                  <span className="font-medium text-black">{p.title}</span>
                  <span className="text-gray-500">{p.listingCategory}</span>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
