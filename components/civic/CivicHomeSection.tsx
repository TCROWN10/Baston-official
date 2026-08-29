import Link from "next/link";
import { COMPANIES, HOTELS, SCHOOLS } from "@/lib/civic/directory";
import { CCTV_CAMERAS, VEHICLES } from "@/lib/civic/government";

const services = [
  {
    href: "/hotels",
    title: "Hotel adverts",
    body: "Market hotels to guests while government verifies NTDC registration.",
    stat: `${HOTELS.length} hotels`,
  },
  {
    href: "/schools",
    title: "Schools registry",
    body: "Public school directory for verification only — no school advertising.",
    stat: `${SCHOOLS.length} schools`,
  },
  {
    href: "/companies",
    title: "Companies",
    body: "Companies and private organisations with CAC and tax standing.",
    stat: `${COMPANIES.length} organisations`,
  },
  {
    href: "/government/cctv",
    title: "CCTV & plates",
    body: "Traffic and organisation cameras matched to vehicle paper expiry.",
    stat: `${CCTV_CAMERAS.length} cameras · ${VEHICLES.length} plates`,
  },
];

export function CivicHomeSection() {
  return (
    <section className="bg-slate-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-xl font-bold text-black sm:text-2xl lg:text-3xl">
            Civic & government <span className="text-[#1e3a5f]">services</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            My App partners with government to verify hotels, schools and companies, monitor CCTV
            traffic, plate papers, billboards, markets, projects and taxes paid versus owed.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-[#1e3a5f]/40 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[#1e3a5f]">
                {item.stat}
              </p>
              <h3 className="mt-2 text-lg font-bold text-black">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.body}</p>
            </Link>
          ))}
        </div>
        <div className="mt-6">
          <Link
            href="/government"
            className="inline-flex rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#152a45]"
          >
            Open government console
          </Link>
        </div>
      </div>
    </section>
  );
}
