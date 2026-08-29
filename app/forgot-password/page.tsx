"use client";

import Link from "next/link";
import { useState } from "react";
import { SiteShell } from "@/components/Footer";
import { BRAND_NAME } from "@/lib/data";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <SiteShell showMobileNav={false}>
      <section className="mx-auto flex max-w-md flex-col px-4 py-16">
        <h1 className="text-3xl font-bold text-black">Forgot Password?</h1>
        <p className="mt-2 text-gray-600">No worries, we&apos;ll send you reset instructions.</p>

        {sent ? (
          <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            If an account exists for {email}, reset instructions have been prepared. For this demo,
            use your existing {BRAND_NAME} password.
          </div>
        ) : (
          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-black">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full field-control px-4 py-2.5 text-sm"
                placeholder="Enter your email"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-[#1e3a5f] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#152a45]"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <Link href="/login" className="mt-6 text-sm font-medium text-[#1e3a5f] hover:underline">
          Back to Login
        </Link>
      </section>
    </SiteShell>
  );
}
