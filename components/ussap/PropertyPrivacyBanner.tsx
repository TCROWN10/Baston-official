import type { PropertyAccessMode } from "@/lib/ussap/property-privacy";

type Props = {
  mode: PropertyAccessMode | "public";
  redactedFields?: readonly string[];
  className?: string;
};

export function PropertyPrivacyBanner({ mode, redactedFields, className = "" }: Props) {
  if (mode === "full") {
    return (
      <div
        className={`rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs text-violet-900 ${className}`}
      >
        <strong>Privileged access:</strong> you are viewing the full property record (admin /
        government).
      </div>
    );
  }

  if (mode === "owner") {
    return (
      <div
        className={`rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900 ${className}`}
      >
        <strong>Your property:</strong> you are viewing your own record with full details.
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 ${className}`}
    >
      <strong>Privacy protected:</strong> public view only. Owner contact, exact coordinates, and
      confidential fields are hidden. Only the property owner, platform admin, and government can
      see full details.
      {redactedFields && redactedFields.length > 0 ? (
        <span className="mt-1 block text-[11px] text-slate-500">
          Withheld: {redactedFields.slice(0, 4).join(", ")}
          {redactedFields.length > 4 ? "…" : ""}
        </span>
      ) : null}
    </div>
  );
}
