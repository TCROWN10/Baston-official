import { SiteShell } from "@/components/Footer";
import { BRAND_NAME } from "@/lib/data";

export default function ContactPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-black">Contact Us</h1>
        <p className="mt-2 text-gray-600">
          Reach the {BRAND_NAME} team for support, partnerships, or listing help.
        </p>
        <div className="mt-8 space-y-3 rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-700">
          <p>
            <strong>Email:</strong> hello@myapp.ng
          </p>
          <p>
            <strong>Phone:</strong> +234 800 123 4567
          </p>
          <p>
            <strong>Hours:</strong> Mon–Sat, 9am–6pm WAT
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
