"use client";

import { UssapMapExplorer } from "@/components/ussap/UssapMapExplorer";
import { UssapShell } from "@/components/ussap/UssapShell";
import { useAuth } from "@/lib/auth";
import { privacyViewerFromUser } from "@/lib/ussap/property-privacy";
import type { UssapRole } from "@/lib/ussap/types";

export default function MapPage() {
  const { user } = useAuth();
  const role = user?.role as UssapRole | undefined;

  return (
    <UssapShell>
      <UssapMapExplorer
        role={role}
        viewer={privacyViewerFromUser(user)}
        description={`OpenStreetMap streets and Esri satellite imagery with sector overlays. Layer visibility respects your access${role ? ` (${role.replace("_", " ")})` : " (public only — sign in for restricted sites)"}.`}
      />
    </UssapShell>
  );
}
