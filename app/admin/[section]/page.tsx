"use client";

import { useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";

const TITLES: Record<string, string> = {
  blogs: "Blogs",
  properties: "Listings",
  users: "Users",
  settings: "Settings",
};

export default function AdminSectionPage() {
  const params = useParams();
  const section = String(params.section || "");
  const title = TITLES[section] || "Admin section";

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-1 text-sm text-slate-600">
        This admin module is ready for content management. Use the sidebar to move between
        sections.
      </p>
      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        {title} tools will appear here.
      </div>
    </AdminShell>
  );
}
