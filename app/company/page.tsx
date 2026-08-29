"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function CompanyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user?.role === "company" || user?.role === "agent") {
      router.replace("/dashboard");
      return;
    }
    router.replace("/signup");
  }, [loading, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      Loading...
    </div>
  );
}
