import { SiteShell } from "@/components/Footer";
import { BRAND_NAME } from "@/lib/data";

export default function FaqsPage() {
  const faqs = [
    {
      q: "Do I need an account to browse listings?",
      a: "No. Anyone can browse Buy, Rent, and Shortlet adverts without signing in.",
    },
    {
      q: "Who needs to register?",
      a: "Only agents, owners, and companies that want to publish listings. Registration is free.",
    },
    {
      q: "How do I contact a host or agent?",
      a: "Open any property page and use Call, Email, or WhatsApp.",
    },
  ];

  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-black">FAQs</h1>
        <p className="mt-2 text-gray-600">Common questions about {BRAND_NAME}.</p>
        <div className="mt-8 space-y-4">
          {faqs.map((item) => (
            <div key={item.q} className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-semibold text-black">{item.q}</h2>
              <p className="mt-2 text-sm text-gray-600">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
