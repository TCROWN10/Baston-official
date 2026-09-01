"use client";

import Link from "next/link";
import { PropertyComplianceBadges } from "@/components/civic/StatusBadge";
import { SafeImage } from "@/components/ui/SafeImage";
import type { BillboardRecord } from "@/lib/civic/types";

export const DEFAULT_BILLBOARD_FALLBACK = "/facilities/billboards/roadside-billboard-1.jpg";

function BoardTypeBadge({ type }: { type?: BillboardRecord["boardType"] }) {
  if (!type) return null;
  return (
    <span className="rounded-md bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
      {type}
    </span>
  );
}

export function BillboardCard({
  board,
  href,
}: {
  board: BillboardRecord;
  href?: string;
}) {
  const content = (
    <>
      <div className="relative h-44 sm:h-48">
        <SafeImage
          src={board.image || DEFAULT_BILLBOARD_FALLBACK}
          alt={`Outdoor billboard at ${board.location}`}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          fallbackSrc={DEFAULT_BILLBOARD_FALLBACK}
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <BoardTypeBadge type={board.boardType} />
        </div>
      </div>
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 font-bold text-black">{board.location}</h3>
        <PropertyComplianceBadges
          verification={board.verification}
          licensed={board.verification === "verified"}
          registered={board.verification !== "flagged"}
          compact
        />
        <p className="text-sm text-gray-600">
          {board.lga || board.city}, {board.state}
          {board.sizeLabel ? ` · ${board.sizeLabel}` : ""}
        </p>
        <p className="text-sm text-gray-600">Operator: {board.operator}</p>
        <dl className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 text-sm">
          <div>
            <dt className="text-xs text-slate-500">Permit</dt>
            <dd className="truncate font-medium text-slate-900">{board.permitNo}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Expiry</dt>
            <dd className="font-medium text-slate-900">{board.permitExpiry}</dd>
          </div>
        </dl>
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group min-w-0 overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
      >
        {content}
      </Link>
    );
  }

  return (
    <article className="group min-w-0 overflow-hidden rounded-xl bg-white shadow-md">
      {content}
    </article>
  );
}
