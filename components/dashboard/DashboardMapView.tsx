"use client";

import { UssapMapExplorer } from "@/components/ussap/UssapMapExplorer";
import { privacyViewerFromUser } from "@/lib/ussap/property-privacy";
import type { DashboardUser } from "./types";

export function DashboardMapView({ user }: { user: DashboardUser }) {
  return (
    <UssapMapExplorer
      role={user.role}
      viewer={privacyViewerFromUser(user)}
      embedded
      title="Live map"
      description="Explore Bastion Technology sites by sector. Tap a marker to inspect the record here — without leaving your dashboard."
      heightClass="h-[280px] sm:h-[380px] md:h-[440px] lg:h-[520px]"
    />
  );
}
