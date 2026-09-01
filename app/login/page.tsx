"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAuth } from "@/lib/auth";
import { BRAND } from "@/lib/ussap/data";
import { ROLE_DEFINITIONS, dashboardPath } from "@/lib/ussap/rbac";
import type { UssapRole } from "@/lib/ussap/types";
import type { UserRole } from "@/lib/types";

/** Public login modes — no admin password dump on this page. */
const PUBLIC_MODES: { id: UssapRole | "any" | "agent"; label: string }[] = [
  { id: "any", label: "My account" },
  { id: "agent", label: "Agent / listings" },
  { id: "citizen", label: "Citizen" },
  { id: "telecom", label: "Telecom" },
  { id: "project_manager", label: "Projects" },
  { id: "education", label: "Schools" },
  { id: "field_agent", label: "Field agent" },
  { id: "government", label: "Government" },
];

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();
  const [mode, setMode] = useState<UssapRole | "any" | "agent">("any");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const roleHint = mode === "any" ? undefined : (mode as UserRole);
    const result = await login(form.email, form.password, roleHint);
    setLoading(false);
    if (!result.success) {
      setError(result.message || "Login failed.");
      return;
    }
    const role = (result.role || "citizen") as UssapRole;
    const redirect = params.get("redirect");
    // Never send non-admins into the admin console via redirect tricks
    if (redirect === "/ussap/console" && role !== "admin") {
      router.push(dashboardPath(role));
      return;
    }
    if (redirect) {
      router.push(redirect);
      return;
    }
    router.push(dashboardPath(role));
  };

  const selectedDef = ROLE_DEFINITIONS.find((r) => r.role === mode);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f4f8] px-4 py-8">
      <div className="w-full max-w-sm rounded-xl border border-slate-200/80 bg-white p-5 shadow-lg shadow-[#1e3a5f]/8 sm:p-6">
        <div className="text-center">
          <Link
            href="/"
            className="text-sm font-bold tracking-[0.12em] text-[#1e3a5f] hover:text-[#152a45]"
          >
            {BRAND.name}
          </Link>
        </div>

        <h1 className="mt-4 text-xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          Use <strong>My account</strong> if you signed up here, or pick a role for demo access.
        </p>

        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap">
          {PUBLIC_MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`cursor-pointer shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-medium ${
                mode === m.id ? "bg-[#1e3a5f] text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {selectedDef ? (
          <p className="mt-3 rounded-lg bg-[#1e3a5f]/10 px-3 py-2 text-xs text-slate-700">
            <strong>{selectedDef.title}:</strong> {selectedDef.audience}
          </p>
        ) : mode === "agent" ? (
          <p className="mt-3 rounded-lg bg-[#1e3a5f]/10 px-3 py-2 text-xs text-slate-700">
            <strong>Agents & companies:</strong> sign in with the email and password you used at
            signup, or try the demo <code className="text-[11px]">agent@myapp.ng</code> /{" "}
            <code className="text-[11px]">agent123</code>.
          </p>
        ) : (
          <p className="mt-3 rounded-lg bg-[#1e3a5f]/10 px-3 py-2 text-xs text-slate-700">
            We’ll open the correct workspace for your account after sign-in.
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-4 space-y-2">
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="field-control w-full px-3 py-2 text-sm"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="field-control w-full px-3 py-2 pr-14 text-sm"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full rounded-lg bg-[#1e3a5f] py-2 text-sm font-semibold text-white hover:bg-[#152a45] disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-600">
          New here?{" "}
          <Link href="/signup" className="font-medium text-[#1e3a5f] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
