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
const PUBLIC_MODES: { id: UssapRole | "any"; label: string }[] = [
  { id: "any", label: "My account" },
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
  const [mode, setMode] = useState<UssapRole | "any">("any");
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
    <div className="flex min-h-screen bg-[#f8fafc]">
      <div className="relative hidden w-[42%] bg-[linear-gradient(160deg,#0c1929,#1e3a5f_55%,#152a45)] lg:block">
        <div className="absolute inset-0 p-10 text-white">
          <p className="text-sm font-bold tracking-wide">{BRAND.name}</p>
          <h2 className="mt-16 max-w-sm text-3xl font-bold leading-tight">
            Sign in to your workspace
          </h2>
          <p className="mt-4 max-w-sm text-sm text-white/90/85">
            Each account type opens a different area. Citizens, operators, and government officers
            do not share the platform admin console.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-3 py-8 sm:px-4 sm:py-10 lg:w-[58%]">
        <div className="w-full max-w-md">
          <Link href="/" className="text-sm font-semibold text-[#1e3a5f]">
            ← {BRAND.name}
          </Link>
          <h1 className="mt-5 text-2xl font-bold text-slate-900 sm:mt-6 sm:text-3xl">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-600">
            Choose your account type, then sign in with your own credentials.
          </p>

          <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap">
            {PUBLIC_MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={`cursor-pointer shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-medium ${
                  mode === m.id ? "bg-[#1e3a5f] text-white" : "bg-white text-slate-600"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {selectedDef ? (
            <p className="mt-3 rounded-xl bg-[#1e3a5f]/10 px-3 py-2 text-xs text-slate-700">
              <strong>{selectedDef.title}:</strong> {selectedDef.audience}
            </p>
          ) : (
            <p className="mt-3 rounded-xl bg-[#1e3a5f]/10 px-3 py-2 text-xs text-slate-700">
              We’ll open the correct workspace for your account after sign-in.
            </p>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <input
              type="email"
              required
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="field-control w-full px-4 py-2.5 text-sm"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="field-control w-full px-4 py-2.5 pr-16 text-sm"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full rounded-xl bg-[#1e3a5f] py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            New here?{" "}
            <Link href="/signup" className="font-medium text-[#1e3a5f] hover:underline">
              Create a citizen or agent account
            </Link>
          </p>
        </div>
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
