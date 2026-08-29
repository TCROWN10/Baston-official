"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { SiteShell } from "@/components/Footer";
import { StatusBadge, naira } from "@/components/civic/StatusBadge";
import { SafeImage } from "@/components/ui/SafeImage";
import { getCompany } from "@/lib/civic/directory";

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const company = getCompany(id);

  if (!company) {
    return (
      <SiteShell>
        <div className="px-4 py-16 text-center">Organisation not found.</div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Link href="/companies" className="text-sm text-gray-600 hover:text-black">
          ← Companies
        </Link>
        <div className="relative mt-4 h-64 overflow-hidden rounded-2xl">
          <SafeImage
            src={company.images[0]}
            alt={company.name}
            fill
            className="object-cover"
            sizes="800px"
            fallbackSrc="/listings/company-1.jpg"
          />
        </div>
        <div className="mt-6 flex items-start justify-between gap-3">
          <h1 className="text-3xl font-bold text-black">{company.name}</h1>
          <StatusBadge status={company.verification} />
        </div>
        <p className="mt-2 text-gray-600">
          {company.sector} · {company.city}, {company.state}
        </p>
        <dl className="mt-6 grid gap-4 rounded-2xl border border-gray-200 bg-white p-6 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-gray-500">CAC</dt>
            <dd className="font-medium">{company.cacNumber}</dd>
          </div>
          <div>
            <dt className="text-gray-500">TIN</dt>
            <dd className="font-medium">{company.tin}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Tax paid</dt>
            <dd className="font-medium">{naira(company.taxPaid)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Tax owed</dt>
            <dd className="font-medium text-red-700">{naira(company.taxOwed)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Employees (est.)</dt>
            <dd className="font-medium">{company.employees.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Address</dt>
            <dd className="font-medium">{company.address}</dd>
          </div>
        </dl>
      </div>
    </SiteShell>
  );
}
