"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { ResidentialPropertyPanel } from "@/components/ussap/ResidentialPropertyPanel";
import { UssapShell } from "@/components/ussap/UssapShell";
import { useAuth } from "@/lib/auth";
import { lookupDigitalAddress } from "@/lib/ussap/user-properties";
import {
  privacyViewerFromUser,
  viewResidentialProperty,
} from "@/lib/ussap/property-privacy";

export default function AddressDetailPage() {
  const { code } = useParams<{ code: string }>();
  const { user } = useAuth();
  const decoded = decodeURIComponent(code || "");

  const view = useMemo(() => {
    const site = lookupDigitalAddress(decoded);
    if (!site) return null;
    return viewResidentialProperty(site, privacyViewerFromUser(user));
  }, [decoded, user]);

  if (!view) {
    return (
      <UssapShell>
        <h1 className="text-2xl font-bold">Address not found</h1>
        <p className="mt-2 text-sm text-slate-600">
          This digital address is not in the registry, or it is not a residential property record.
        </p>
        <Link href="/ussap/map" className="mt-4 inline-block text-sm text-[#1e3a5f]">
          ← Back to map
        </Link>
      </UssapShell>
    );
  }

  return (
    <UssapShell>
      <Link href="/ussap/map" className="text-sm text-slate-600 hover:text-[#1e3a5f]">
        ← Map
      </Link>
      <div className="mt-4">
        <ResidentialPropertyPanel view={view} />
      </div>
    </UssapShell>
  );
}
