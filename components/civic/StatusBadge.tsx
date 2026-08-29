export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    verified: "bg-emerald-50 text-emerald-800",
    pending: "bg-amber-50 text-amber-800",
    flagged: "bg-red-50 text-red-700",
    unregistered: "bg-slate-100 text-slate-600",
    compliant: "bg-emerald-50 text-emerald-800",
    expired: "bg-red-50 text-red-700",
    watchlist: "bg-[#1e3a5f]/10 text-[#1e3a5f]",
    online: "bg-emerald-50 text-emerald-800",
    offline: "bg-slate-100 text-slate-600",
    "on-track": "bg-emerald-50 text-emerald-800",
    delayed: "bg-amber-50 text-amber-800",
    completed: "bg-[#1e3a5f]/10 text-[#152a45]",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status.replace("-", " ")}
    </span>
  );
}

export function naira(amount: number) {
  return `₦${amount.toLocaleString()}`;
}
