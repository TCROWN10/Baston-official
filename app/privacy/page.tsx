import { SiteShell } from "@/components/Footer";
import { BRAND_NAME } from "@/lib/data";

export default function PrivacyPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-black">Privacy</h1>
        <div className="mt-6 space-y-4 text-sm leading-6 text-gray-700">
          <p>
            {BRAND_NAME} stores account details you provide during registration (name, email, phone)
            so agents can manage listings and receive inquiries.
          </p>
          <p>
            Saved homes are stored in your browser. We do not sell personal information to third
            parties for advertising.
          </p>
          <p>
            Contact details shown on property pages are provided by listing owners so guests can
            reach them directly.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
