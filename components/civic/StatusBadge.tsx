export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    verified: "bg-emerald-50 text-emerald-800",
    pending: "bg-amber-50 text-amber-800",
    flagged: "bg-red-50 text-red-700",
    unregistered: "bg-slate-100 text-slate-600",
    licensed: "bg-[#1e3a5f]/10 text-[#1e3a5f]",
    "not licensed": "bg-slate-100 text-slate-600",
    registered: "bg-teal-50 text-teal-900",
    "not registered": "bg-slate-100 text-slate-600",
    compliant: "bg-emerald-50 text-emerald-800",
    expired: "bg-red-50 text-red-700",
    watchlist: "bg-[#1e3a5f]/10 text-[#1e3a5f]",
    online: "bg-emerald-50 text-emerald-800",
    offline: "bg-slate-100 text-slate-600",
    "on-track": "bg-emerald-50 text-emerald-800",
    delayed: "bg-amber-50 text-amber-800",
    completed: "bg-[#1e3a5f]/10 text-[#152a45]",
  };

  const label = status.replace(/-/g, " ");

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
        styles[status] || styles[label] || "bg-slate-100 text-slate-700"
      }`}
    >
      {label}
    </span>
  );
}

/** Verified / licensed / registered badges for marketplace properties. */
export function PropertyComplianceBadges({
  verification = "pending",
  licensed = false,
  registered = false,
  compact,
}: {
  verification?: string;
  licensed?: boolean;
  registered?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={`flex flex-wrap gap-1 ${compact ? "" : "gap-1.5"}`}>
      <StatusBadge status={verification} />
      <StatusBadge status={licensed ? "licensed" : "not licensed"} />
      <StatusBadge status={registered ? "registered" : "not registered"} />
    </div>
  );
}

/** Hotel / directory compliance from registry fields. */
export function hotelCompliance(item: {
  verification: string;
  tourismBoardNo?: string;
  cacNumber?: string;
  live?: boolean;
  source?: string;
}) {
  if (item.source === "openstreetmap" || item.source === "google" || item.live) {
    const ok = item.verification === "verified";
    return {
      verification: item.verification,
      licensed: ok,
      registered: ok,
    };
  }
  const board = (item.tourismBoardNo || "").toLowerCase();
  const cac = (item.cacNumber || "").toLowerCase();
  const licensed =
    Boolean(item.tourismBoardNo) &&
    !board.includes("pending") &&
    !board.startsWith("osm/");
  const registered =
    Boolean(item.cacNumber) && !cac.includes("pending") && cac.length > 3;
  return {
    verification: item.verification,
    licensed: licensed || item.verification === "verified",
    registered: registered || item.verification === "verified",
  };
}

export function naira(amount: number) {
  return `₦${amount.toLocaleString()}`;
}
