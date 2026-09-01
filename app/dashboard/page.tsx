"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DashboardListingsView } from "@/components/dashboard/DashboardListingsView";
import { DashboardMapView } from "@/components/dashboard/DashboardMapView";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { DashboardPropertyView } from "@/components/dashboard/DashboardPropertyView";
import { DashboardSectorView } from "@/components/dashboard/DashboardSectorView";
import { DashboardShell, type DashboardView } from "@/components/dashboard/DashboardShell";
import { ProfileSettings } from "@/components/account/ProfileSettings";
import { useAuth } from "@/lib/auth";
import { getAllProperties } from "@/lib/listings";
import { countPropertiesForUser } from "@/lib/ussap/user-properties";
import type { Property } from "@/lib/types";

const SECTOR_VIEWS: DashboardView[] = [
  "education",
  "health",
  "billboards",
  "hospitality",
  "telecom",
  "core",
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeView, setActiveView] = useState<DashboardView>("overview");
  const [listings, setListings] = useState<Property[]>([]);

  useEffect(() => {
    if (!loading && !user) router.replace("/login?redirect=/dashboard");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    const all = getAllProperties();
    setListings(
      all.filter(
        (p) =>
          p.owner.email === user.email ||
          p.owner.id === user.id ||
          user.role === "admin",
      ),
    );
  }, [user]);

  const propertyCount = useMemo(
    () => (user ? countPropertiesForUser(user.id, user.email) : 0),
    [user],
  );

  const stats = useMemo(
    () => ({
      active: listings.filter((p) => p.status === "active").length,
    }),
    [listings],
  );

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm text-slate-600">Loading…</p>
      </div>
    );
  }

  const renderMain = () => {
    if (activeView === "overview") {
      return (
        <DashboardOverview
          user={user}
          listingCount={listings.length}
          activeListings={stats.active}
          propertyCount={propertyCount}
          onViewChange={setActiveView}
        />
      );
    }
    if (activeView === "property") {
      return <DashboardPropertyView user={user} />;
    }
    if (activeView === "map") {
      return <DashboardMapView user={user} />;
    }
    if (activeView === "listings") {
      return <DashboardListingsView listings={listings} />;
    }
    if (activeView === "profile") {
      return (
        <div className="mx-auto max-w-3xl">
          <ProfileSettings showSignOut={false} />
        </div>
      );
    }
    if (SECTOR_VIEWS.includes(activeView)) {
      return (
        <DashboardSectorView
          sectorId={activeView as Exclude<DashboardView, "overview" | "property" | "map" | "listings" | "profile">}
          user={user}
          onViewChange={setActiveView}
        />
      );
    }
    return null;
  };

  return (
    <DashboardShell user={user} activeView={activeView} onViewChange={setActiveView}>
      {renderMain()}
    </DashboardShell>
  );
}
