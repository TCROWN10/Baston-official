"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UssapShell } from "@/components/ussap/UssapShell";
import { useAuth } from "@/lib/auth";
import { allSites } from "@/lib/ussap/data";
import { canAccessAdminConsole, dashboardPath } from "@/lib/ussap/rbac";
import type { UssapRole } from "@/lib/ussap/types";

export default function ConsolePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const role = user?.role as UssapRole | undefined;
  const allowed = canAccessAdminConsole(role);

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
        System oversight for the platform. Government officers use the{" "}
        <Link href="/government" className="font-medium text-[#1e3a5f] underline">
          Government portal
        </Link>{" "}
        instead — not this page.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Object.entries(bySector).map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">{k}</p>
            <p className="mt-2 text-3xl font-bold text-[#1e3a5f]">{v}</p>
            <p className="text-xs text-slate-500">addressed sites</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Access rules</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Only the <strong>admin</strong> role can open this console.</li>
            <li>Government users land on <code className="text-xs">/government</code>.</li>
            <li>Citizens, telecom, schools, and field agents each have their own workspace.</li>
          </ul>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Quick links</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              ["/ussap/map", "Live map"],
              ["/ussap/telecom", "Telecom"],
              ["/ussap/traffic", "Traffic"],
              ["/ussap/projects", "Projects"],
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
    </UssapShell>
  );
}
