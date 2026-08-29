import { SiteShell } from "@/components/Footer";
import { BRAND_NAME } from "@/lib/data";

export default function TermsPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-black">Terms</h1>
        <div className="mt-6 space-y-4 text-sm leading-6 text-gray-700">
          <p>
            By using {BRAND_NAME}, you agree to browse listings responsibly and contact agents only
            for genuine property inquiries.
          </p>
          <p>
            Agents are responsible for the accuracy of listing details, pricing, availability, and
            contact information they publish.
          </p>
          <p>
            {BRAND_NAME} may remove listings that violate these terms or local regulations.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
