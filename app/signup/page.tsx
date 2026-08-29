"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BRAND_NAME } from "@/lib/data";
import { useAuth } from "@/lib/auth";

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
    password: "",
    companyName: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await register({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
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
    <div className="relative flex min-h-screen">
      <div className="relative hidden w-[42%] lg:block">
        <Image
          src="/Auth-image.png"
          alt={`${BRAND_NAME} background`}
          fill
          priority
          className="object-cover"
          sizes="42vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-x-8 top-1/3 text-white">
          <h1 className="text-3xl font-bold leading-tight xl:text-4xl">
            List properties. Get calls from serious clients.
          </h1>
          <p className="mt-4 text-white/90">
            {BRAND_NAME} is an advert directory: visitors browse without signing in and contact you
            directly. Only agents and owners register to post listings.
          </p>
        </div>
      </div>

      <div className="flex w-full items-start justify-center px-4 py-10 lg:w-[58%]">
        <div className="w-full max-w-xl">
          <Link href="/" className="mb-6 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1e3a5f]">
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-black">{BRAND_NAME}</span>
          </Link>

          <h2 className="text-2xl font-bold text-black">Agent / owner registration</h2>
          <p className="mt-2 text-sm text-gray-600">
            Create a free account to publish listings. Visitors browse without signing in and contact
            you directly.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setAccountType("agent")}
              className={`rounded-xl border p-4 text-left transition ${
                accountType === "agent"
                  ? "border-[#1e3a5f] bg-[#1e3a5f]/10"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <p className="font-semibold text-black">Agent / owner</p>
              <p className="mt-1 text-xs text-gray-600">Individual listings</p>
            </button>
            <button
              type="button"
              onClick={() => setAccountType("company")}
              className={`rounded-xl border p-4 text-left transition ${
                accountType === "company"
                  ? "border-[#1e3a5f] bg-[#1e3a5f]/10"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <p className="font-semibold text-black">Company / brand</p>
              <p className="mt-1 text-xs text-gray-600">Agency or developer name on listings</p>
            </button>
          </div>

          {error ? (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-5 space-y-3">
            <input
              name="fullName"
              required
              value={form.fullName}
              onChange={onChange}
              placeholder="Full name"
              className="w-full field-control px-4 py-2.5 text-sm"
            />
            {accountType === "company" ? (
              <input
                name="companyName"
                required
                value={form.companyName}
                onChange={onChange}
                placeholder="Company / brand name"
                className="w-full field-control px-4 py-2.5 text-sm"
              />
            ) : null}
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={onChange}
              placeholder="Email"
              className="w-full field-control px-4 py-2.5 text-sm"
            />
            <input
              name="phone"
              required
              value={form.phone}
              onChange={onChange}
              placeholder="Phone"
              className="w-full field-control px-4 py-2.5 text-sm"
            />
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={onChange}
                placeholder="Password"
                className="w-full field-control px-4 py-2.5 pr-16 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#1e3a5f] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#152a45] disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create agent account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Looking around only?{" "}
            <Link href="/" className="font-medium text-[#1e3a5f] hover:underline">
              Browse listings without an account.
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already registered?{" "}
            <Link href="/login" className="font-medium text-[#1e3a5f] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
