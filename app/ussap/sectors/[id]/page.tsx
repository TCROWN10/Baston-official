import { notFound } from "next/navigation";
import { SectorModuleOverview } from "@/components/ussap/SectorModuleOverview";
import { UssapShell } from "@/components/ussap/UssapShell";
import {
  SECTOR_DEFINITIONS,
  getSectorDefinition,
  type SectorModuleId,
} from "@/lib/ussap/sector-modules";

const VALID_IDS = SECTOR_DEFINITIONS.map((s) => s.id);

export function generateStaticParams() {
  return VALID_IDS.map((id) => ({ id }));
}

export default async function SectorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sector = getSectorDefinition(id as SectorModuleId);
  if (!sector) notFound();

  return (
    <UssapShell>
      <SectorModuleOverview sector={sector} />
    </UssapShell>
  );
}
