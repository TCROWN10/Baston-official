"use client";

import { SiteShell } from "@/components/Footer";

/** USSAP pages use the same Header / Footer / mobile nav as the marketplace site. */
export function UssapShell({ children }: { children: React.ReactNode }) {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-10">{children}</div>
    </SiteShell>
  );
}
