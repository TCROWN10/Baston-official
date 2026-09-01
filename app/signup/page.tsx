"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useAuth } from "@/lib/auth";
import { lgasForState, NIGERIA_STATES } from "@/lib/civic/nigeria-admin";
import { BRAND } from "@/lib/ussap/data";

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [accountType, setAccountType] = useState<"agent" | "company">("agent");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    state: "",
    lga: "",
    password: "",
    companyName: "",
  });

  const stateOptions = useMemo(
    () => [
      { value: "", label: "Select state" },
      ...NIGERIA_STATES.map((state) => ({ value: state, label: state })),
    ],
    [],
  );

  const lgaOptions = useMemo(() => {
    const lgas = form.state ? lgasForState(form.state) : [];
    return [
      { value: "", label: "Select local government" },
      ...lgas.map((lga) => ({ value: lga, label: lga })),
    ];
  }, [form.state]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.state || !form.lga) {
      setError("Please select your state and local government area.");
      return;
    }
    setLoading(true);
    setError("");
    const result = await register({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      state: form.state,
      lga: form.lga,
      password: form.password,
      role: accountType,
      companyName: accountType === "company" ? form.companyName || form.fullName : undefined,
    });
    setLoading(false);
    if (!result.success) {
      setError(result.message || "Registration failed.");
      return;
    }
    router.push("/dashboard");
  };

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

        <h1 className="mt-4 text-xl font-bold text-slate-900">Create account</h1>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          Register with your location so {BRAND.name} can place you in the right state and LGA
          workspace.
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setAccountType("agent")}
            className={`cursor-pointer rounded-lg border px-2.5 py-2 text-left text-xs transition ${
              accountType === "agent"
                ? "border-[#1e3a5f] bg-[#1e3a5f]/10 font-medium text-[#1e3a5f]"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            Individual
          </button>
          <button
            type="button"
            onClick={() => setAccountType("company")}
            className={`cursor-pointer rounded-lg border px-2.5 py-2 text-left text-xs transition ${
              accountType === "company"
                ? "border-[#1e3a5f] bg-[#1e3a5f]/10 font-medium text-[#1e3a5f]"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            Organisation
          </button>
        </div>

        {error ? (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-600">
            {error}
          </p>
        ) : null}

        <form onSubmit={onSubmit} className="mt-4 space-y-2">
          <input
            name="fullName"
            required
            value={form.fullName}
            onChange={onChange}
            placeholder="Full name"
            className="field-control w-full px-3 py-2 text-sm"
          />
          {accountType === "company" ? (
            <input
              name="companyName"
              required
              value={form.companyName}
              onChange={onChange}
              placeholder="Organisation name"
              className="field-control w-full px-3 py-2 text-sm"
            />
          ) : null}
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={onChange}
            placeholder="Email"
            className="field-control w-full px-3 py-2 text-sm"
          />
          <input
            name="phone"
            required
            value={form.phone}
            onChange={onChange}
            placeholder="Phone"
            className="field-control w-full px-3 py-2 text-sm"
          />

          <CustomSelect
            value={form.state}
            onChange={(state) => setForm((f) => ({ ...f, state, lga: "" }))}
            options={stateOptions}
            ariaLabel="State"
            placeholder="Select state"
            size="sm"
          />
          <CustomSelect
            value={form.lga}
            onChange={(lga) => setForm((f) => ({ ...f, lga }))}
            options={lgaOptions}
            ariaLabel="Local government area"
            placeholder={form.state ? "Select local government" : "Choose state first"}
            size="sm"
          />

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={form.password}
              onChange={onChange}
              placeholder="Password"
              className="field-control w-full px-3 py-2 pr-14 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full rounded-lg bg-[#1e3a5f] py-2 text-sm font-semibold text-white hover:bg-[#152a45] disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[#1e3a5f] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
