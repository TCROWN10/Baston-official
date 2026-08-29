"use client";

import { useMemo, useState } from "react";
import { UssapShell } from "@/components/ussap/UssapShell";
import { useAuth } from "@/lib/auth";
import { formatCode } from "@/lib/ussap/geocode";
import { sitesBySector, upsertSite } from "@/lib/ussap/registry";
import type { ProjectMedia, ProjectSite, UssapRole } from "@/lib/ussap/types";

export default function ProjectsPage() {
  const { user } = useAuth();
  const role = user?.role as UssapRole | undefined;
  const [tick, setTick] = useState(0);
  const sites = useMemo(() => {
    void tick;
    return sitesBySector("project", role) as ProjectSite[];
  }, [role, tick]);

  const canUpload =
    role === "project_manager" || role === "admin" || role === "government" || role === "field_agent";

  const addMedia = (site: ProjectSite, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const media: ProjectMedia = {
        id: `media_${Date.now()}`,
        type: file.type.startsWith("video") ? "video" : "photo",
        url: String(reader.result),
        caption: file.name,
        lat: site.lat,
        lng: site.lng,
        capturedAt: new Date().toISOString(),
        uploadedBy: user?.email || "anonymous",
      };
      upsertSite({ ...site, media: [media, ...site.media], updatedAt: new Date().toISOString() });
      setTick((t) => t + 1);
    };
    reader.readAsDataURL(file);
  };

  return (
    <UssapShell>
      <h1 className="text-3xl font-bold">Project monitoring module</h1>
      <p className="mt-1 text-sm text-slate-600">
        Geo-tagged photo and video evidence linked to a project site digital address for remote
        progress verification.
      </p>

      <div className="mt-8 space-y-6">
        {sites.map((site) => (
          <article key={site.code} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{site.label}</h2>
                <p className="font-mono text-sm text-[#1e3a5f]">{formatCode(site.code)}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {site.projectCode} · {site.contractor} · {site.status}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#152a45]">{site.progress}%</p>
                <p className="text-xs text-slate-500">progress</p>
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full bg-[#1e3a5f]" style={{ width: `${site.progress}%` }} />
            </div>

            {canUpload ? (
              <label className="mt-4 inline-flex cursor-pointer items-center rounded-lg bg-[#1e3a5f] px-3 py-2 text-xs font-medium text-white">
                Upload geo-tagged media
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) addMedia(site, f);
                  }}
                />
              </label>
            ) : (
              <p className="mt-3 text-xs text-slate-500">
                Sign in as pm@ussap.ng to upload progress media.
              </p>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {site.media.map((m) => (
                <div key={m.id} className="overflow-hidden rounded-xl bg-slate-50">
                  {m.type === "photo" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.url} alt={m.caption || "Progress"} className="h-32 w-full object-cover" />
                  ) : (
                    <video src={m.url} className="h-32 w-full object-cover" controls />
                  )}
                  <p className="p-2 text-[11px] text-slate-600">
                    {m.caption}
                    <br />
                    {m.lat.toFixed(5)}, {m.lng.toFixed(5)} · {new Date(m.capturedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
        {sites.length === 0 ? (
          <p className="text-sm text-slate-600">No project sites visible for your role.</p>
        ) : null}
      </div>
    </UssapShell>
  );
}
