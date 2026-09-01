import Link from "next/link";
import { PropertyComplianceBadges } from "@/components/civic/StatusBadge";
import { SafeImage } from "@/components/ui/SafeImage";
import type { SectorOffer } from "@/lib/civic/sector-offers";

const SECTOR_BADGE: Record<SectorOffer["kind"], string> = {
  hotel: "bg-[#1e3a5f] text-white",
  school: "bg-blue-600 text-white",
  health: "bg-rose-600 text-white",
  billboard: "bg-amber-600 text-white",
  telecom: "bg-violet-600 text-white",
  shortlet: "bg-emerald-600 text-white",
};

export function SectorOfferCard({ offer }: { offer: SectorOffer }) {
  return (
    <Link
      href={offer.href}
      className="group min-w-0 overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
    >
      <div className="relative h-44 sm:h-48">
        <SafeImage
          src={offer.image}
          alt={offer.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          fallbackSrc="/listings/hotel-1.jpg"
        />
        <span
          className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${SECTOR_BADGE[offer.kind]}`}
        >
          {offer.sectorLabel}
        </span>
        {offer.dealText ? (
          <span className="absolute bottom-3 left-3 rounded-md bg-black/65 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {offer.dealText}
          </span>
        ) : null}
      </div>
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 font-bold text-black">{offer.title}</h3>
        <PropertyComplianceBadges
          verification={offer.verification}
          licensed={offer.verification === "verified"}
          registered={offer.verification === "verified"}
          compact
        />
        <p className="text-sm text-gray-600">{offer.location}</p>
        {offer.meta ? <p className="text-sm text-gray-500">{offer.meta}</p> : null}
      </div>
    </Link>
  );
}
