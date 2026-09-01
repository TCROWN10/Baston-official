"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AccountsRegistry } from "@/components/accounts/AccountsRegistry";
import { UssapShell } from "@/components/ussap/UssapShell";
import { useAuth } from "@/lib/auth";
import { listAllAccounts } from "@/lib/accounts";
import { allSites } from "@/lib/ussap/data";
import { canAccessAdminConsole, dashboardPath } from "@/lib/ussap/rbac";
import type { UssapRole } from "@/lib/ussap/types";

type ConsoleTab = "overview" | "accounts";

export default function ConsolePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const role = user?.role as UssapRole | undefined;
  const allowed = canAccessAdminConsole(role);
  const [tab, setTab] = useState<ConsoleTab>("overview");
  const [accountsTick, setAccountsTick] = useState(0);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login?redirect=/ussap/console");
      return;
    }
    if (!canAccessAdminConsole(user.role)) {
      router.replace(dashboardPath(user.role));
    }
  }, [loading, user, router]);

  const sites = allSites();
  const bySector = {
    telecom: sites.filter((s) => s.sector === "telecom").length,
    project: sites.filter((s) => s.sector === "project").length,
    traffic: sites.filter((s) => s.sector === "traffic").length,
    school: sites.filter((s) => s.sector === "school").length,
    residential: sites.filter((s) => s.sector === "residential").length,
  };

  const accounts = useMemo(() => {
    void accountsTick;
    return listAllAccounts();
  }, [accountsTick]);

  useEffect(() => {
    if (allowed) setAccountsTick((t) => t + 1);
  }, [allowed, tab]);

  if (loading || !user || !allowed) {
    return (
      <UssapShell>
        <p className="text-sm text-slate-600">Checking access…</p>
      </UssapShell>
    );
  }

  return (
    <UssapShell>
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
        Platform administrators only
      </p>
      <h1 className="mt-1 text-2xl font-bold sm:text-3xl">USSAP admin console</h1>
      <p className="mt-1 text-sm text-slate-600">
        System oversight — sites, sectors, and every registered account on the platform.
      </p>

      <div className="mt-6 flex gap-2">
        {(
          [
            ["overview", "Platform overview"],
            ["accounts", "All accounts"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium ${
              tab === id ? "bg-[#1e3a5f] text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "accounts" ? (
        <div className="mt-8">
          <AccountsRegistry
            title="Account registry"
            description="Track every user on USSAP — personal sign-ups, demo roles, linked properties, and locations."
            accounts={accounts}
            variant="admin"
          />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {Object.entries(bySector).map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">{k}</p>
                <p className="mt-2 text-3xl font-bold text-[#1e3a5f]">{v}</p>
                <p className="text-xs text-slate-500">addressed sites</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Total accounts", value: accounts.length },
              {
                label: "Personal accounts",
                value: accounts.filter((a) => !a.isDemo).length,
              },
              {
                label: "With property linked",
                value: accounts.filter((a) => a.propertyCount > 0).length,
              },
            ].map((card) => (
              <div key={card.label} className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-xs text-slate-500">{card.label}</p>
                <p className="mt-1 text-2xl font-bold text-[#1e3a5f]">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="font-semibold">Account oversight</h2>
              <p className="mt-2 text-sm text-slate-600">
                Admins can monitor every account — email, role, state/LGA, and how many properties
                each user has registered.
              </p>
              <button
                type="button"
                onClick={() => setTab("accounts")}
                className="mt-4 cursor-pointer rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white"
              >
                Open account registry →
              </button>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="font-semibold">Quick links</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  ["/ussap/map", "Live map"],
                  ["/ussap/telecom", "Telecom"],
                  ["/ussap/traffic", "Traffic"],
                  ["/ussap/projects", "Projects"],
                  ["/government/accounts", "Gov account view"],
                  ["/government", "Government portal"],
                ].map(([href, label]) => (
                  <Link
                    key={href}
                    href={href}
                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium hover:bg-[#1e3a5f]/10"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </UssapShell>
  );
}
