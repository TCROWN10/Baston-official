"use client";

import Link from "next/link";
import { SiteShell } from "@/components/Footer";
import { BRAND_NAME } from "@/lib/data";

export default function SellPage() {
  return (
    <SiteShell>
      <section className="relative bg-gradient-to-br from-[#1e3a5f] to-[#0f1f35] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Sell Your Property with {BRAND_NAME}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90 sm:text-xl">
            Advertise your property to serious buyers. Visitors browse without signing in and contact
            you by phone, email, or WhatsApp.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 text-base font-semibold text-[#1e3a5f] transition-colors hover:bg-slate-100"
          >
            Register to list
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <h2 className="mb-8 text-2xl font-bold text-black sm:text-3xl">
          Why sell on {BRAND_NAME}
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Wide reach",
              body: "Your listing is seen by buyers searching across Nigeria.",
            },
            {
              title: "Trusted platform",
              body: `Buyers trust ${BRAND_NAME} for verified listings and agents.`,
            },
            {
              title: "Direct contact",
              body: "Interested clients call, email, or WhatsApp you straight from the advert.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f]">
                ●
              </div>
              <h3 className="mb-2 font-semibold text-black">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
