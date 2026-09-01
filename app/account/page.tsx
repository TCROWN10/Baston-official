"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { ProfileSettings } from "@/components/account/ProfileSettings";
import { useAuth } from "@/lib/auth";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/account");
    }
  }, [loading, user, router]);

  return (
    <AccountShell>
      {loading || !user ? (
        <p className="text-sm text-slate-500">Loading profile…</p>
      ) : (
        <ProfileSettings />
      )}
    </AccountShell>
  );
}
