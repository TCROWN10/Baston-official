import { SiteShell } from "@/components/Footer";
import { BRAND_NAME } from "@/lib/data";

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-black">About Us</h1>
        <p className="mt-4 text-gray-700">
          {BRAND_NAME} is Nigeria&apos;s trusted real estate marketplace for shortlets, rentals, and
          homes for sale. We help visitors discover verified listings and contact agents directly.
        </p>
        <p className="mt-4 text-gray-700">
          Agents and companies register once, publish weekly adverts, and get calls from serious
          clients — without forcing every browser to create an account.
        </p>
      </section>
    </SiteShell>
  );
}
