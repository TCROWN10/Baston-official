"use client";

import { GovShell } from "@/components/civic/GovShell";
import { StatusBadge, naira } from "@/components/civic/StatusBadge";
import { PROJECTS } from "@/lib/civic/government";

export default function GovProjectsPage() {
  return (
    <GovShell>
      <h1 className="text-2xl font-bold text-black">Project management</h1>
      <p className="mt-1 text-sm text-gray-600">
        Track public works, CCTV rollouts, tourism digitisation and market infrastructure.
      </p>
      <div className="mt-6 grid gap-4">
        {PROJECTS.map((p) => (
          <article key={p.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-black">{p.title}</h2>
                <p className="mt-1 text-sm text-gray-600">
                  {p.ministry} · {p.state} · {p.contractor}
                </p>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-gray-500">
                <span>Progress {p.progress}%</span>
                <span>
                  {naira(p.spent)} / {naira(p.budget)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#1e3a5f]"
                  style={{ width: `${p.progress}%` }}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </GovShell>
  );
}
