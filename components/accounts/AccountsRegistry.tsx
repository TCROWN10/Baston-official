"use client";

import { useMemo, useState } from "react";
import { accountStats, type AccountRecord } from "@/lib/accounts";

type Props = {
  title: string;
  description: string;
  accounts: AccountRecord[];
  /** Government view hides demo credential hints */
  variant?: "admin" | "government";
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Platform admin",
  government: "Government",
  agent: "Individual",
  company: "Organisation",
  citizen: "Citizen",
  telecom: "Telecom",
  education: "Education",
  project_manager: "Projects",
  field_agent: "Field agent",
  guest: "Guest",
};

export function AccountsRegistry({ title, description, accounts, variant = "admin" }: Props) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const stats = useMemo(() => accountStats(accounts), [accounts]);

  const filtered = useMemo(() => {
    return accounts.filter((account) => {
      const matchRole = roleFilter === "all" || account.role === roleFilter;
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        account.fullName.toLowerCase().includes(q) ||
        account.email.toLowerCase().includes(q) ||
        account.state?.toLowerCase().includes(q) ||
        account.lga?.toLowerCase().includes(q);
      return matchRole && matchQuery;
    });
  }, [accounts, query, roleFilter]);

  const roles = useMemo(() => {
    const set = new Set(accounts.map((a) => a.role));
    return Array.from(set).sort();
  }, [accounts]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-1 text-sm text-slate-600">{description}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total accounts", value: stats.total },
          { label: "Personal sign-ups", value: stats.personal },
          { label: "With location set", value: stats.withLocation },
          { label: "With property linked", value: stats.withProperty },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-bold text-[#1e3a5f]">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, state, LGA…"
          className="field-control min-w-[200px] flex-1 px-3 py-2 text-sm"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="field-control px-3 py-2 text-sm"
        >
          <option value="all">All roles</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role] ?? role}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Account</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Properties</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                    No accounts match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((account) => (
                  <tr key={account.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{account.fullName}</p>
                      <p className="text-xs text-slate-500">{account.email}</p>
                      {account.companyName ? (
                        <p className="text-xs text-slate-500">{account.companyName}</p>
                      ) : null}
                      {account.isDemo && variant === "admin" ? (
                        <span className="mt-1 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                          Demo
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 capitalize text-slate-700">
                      {ROLE_LABELS[account.role] ?? account.role}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {account.lga && account.state
                        ? `${account.lga}, ${account.state}`
                        : account.state || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{account.propertyCount}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {account.createdAt
                        ? new Date(account.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Showing {filtered.length} of {accounts.length} accounts.
        {variant === "government"
          ? " Government officers can monitor all registered users and linked properties."
          : " Platform admins have full visibility across demo and personal accounts."}
      </p>
    </div>
  );
}
