"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { BRAND_NAME, LISTING_FEE_PER_WEEK_NGN } from "@/lib/data";
import { saveUserListing } from "@/lib/listings";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { NIGERIA_STATES } from "@/lib/civic/directory";
import type { ListingCategory, Property, PropertyType } from "@/lib/types";

export default function NewListingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [weeks, setWeeks] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    propertyType: "Apartment" as PropertyType,
    listingCategory: "Shortlet" as ListingCategory,
    price: "",
    city: "Lagos",
    state: "Lagos",
    address: "",
    bedrooms: "2",
    bathrooms: "2",
    maxGuests: "4",
    image: "",
    phone: "",
    whatsapp: "",
  });

  useEffect(() => {
    if (!loading && !user) router.replace("/login?redirect=/dashboard/listing");
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const id = `local-${Date.now()}`;
    const property: Property = {
      id,
      slug: form.title.toLowerCase().replace(/\s+/g, "-") + `-${id.slice(-4)}`,
      title: form.title,
      description: form.description,
      propertyType: form.propertyType,
      listingCategory: form.listingCategory,
      price: Number(form.price) || 0,
      pricePer:
        form.listingCategory === "Shortlet"
          ? "night"
          : form.listingCategory === "Rent"
            ? "year"
            : "total",
      images: [
        form.image || "/listings/stay-1.jpg",
      ],
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 1,
      maxGuests: Number(form.maxGuests) || 2,
      amenities: ["Fast Wifi (50 Mbps)", "24/7 Power", "Maximum Security", "Kitchen"],
      location: {
        address: form.address || form.city,
        city: form.city,
        state: form.state,
        country: "Nigeria",
      },
      owner: {
        id: user.id,
        firstName: user.fullName.split(" ")[0] || "Agent",
        lastName: user.fullName.split(" ").slice(1).join(" ") || "",
        email: user.email,
        phone: form.phone || user.phone || "",
        companyName: user.companyName,
      },
      rating: 4.5,
      reviewsCount: 0,
      hasHourlyReservation: form.listingCategory === "Shortlet",
      whatsappNumber: form.whatsapp || form.phone.replace(/\D/g, ""),
      status: "active",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    saveUserListing(property);
    setSaving(false);
    router.push(`/property/${property.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/dashboard" className="font-bold text-black">
            ← {BRAND_NAME} Dashboard
          </Link>
          <span className="text-sm text-gray-500">
            ₦{(LISTING_FEE_PER_WEEK_NGN * weeks).toLocaleString()} for {weeks} week
            {weeks > 1 ? "s" : ""}
          </span>
        </div>
      </header>

      <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <h1 className="text-2xl font-bold text-black">Add New Listing</h1>
        <p className="text-sm text-gray-600">
          Publish an advert. Visitors can contact you directly — no booking account required for
          them.
        </p>

        <input
          required
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="field-control px-4 py-2.5 text-sm"
        />
        <textarea
          required
          rows={4}
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="field-control px-4 py-2.5 text-sm"
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <CustomSelect
            ariaLabel="Listing category"
            value={form.listingCategory}
            onChange={(v) =>
              setForm((f) => ({ ...f, listingCategory: v as ListingCategory }))
            }
            options={[
              { value: "Shortlet", label: "Shortlet" },
              { value: "Rent", label: "Rent" },
              { value: "Buy", label: "Buy / Sale" },
            ]}
          />
          <CustomSelect
            ariaLabel="Property type"
            value={form.propertyType}
            onChange={(v) => setForm((f) => ({ ...f, propertyType: v as PropertyType }))}
            options={["Apartment", "Hotel", "Serviced", "Resort", "House", "Villa", "Penthouse"].map(
              (t) => ({ value: t, label: t }),
            )}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <input
            required
            type="number"
            placeholder="Price (₦)"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className="field-control px-4 py-2.5 text-sm"
          />
          <input
            placeholder="Bedrooms"
            value={form.bedrooms}
            onChange={(e) => setForm((f) => ({ ...f, bedrooms: e.target.value }))}
            className="field-control px-4 py-2.5 text-sm"
          />
          <input
            placeholder="Bathrooms"
            value={form.bathrooms}
            onChange={(e) => setForm((f) => ({ ...f, bathrooms: e.target.value }))}
            className="field-control px-4 py-2.5 text-sm"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <input
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            className="field-control px-4 py-2.5 text-sm"
          />
          <CustomSelect
            ariaLabel="State"
            placeholder="Select state"
            value={form.state}
            onChange={(state) => setForm((f) => ({ ...f, state }))}
            options={NIGERIA_STATES.map((s) => ({ value: s, label: s }))}
          />
          <input
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            className="field-control px-4 py-2.5 text-sm"
          />
        </div>

        <input
          placeholder="Image URL (optional)"
          value={form.image}
          onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
          className="field-control px-4 py-2.5 text-sm"
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            placeholder="Contact phone"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="field-control px-4 py-2.5 text-sm"
          />
          <input
            placeholder="WhatsApp number"
            value={form.whatsapp}
            onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
            className="field-control px-4 py-2.5 text-sm"
          />
        </div>

        <label className="block text-sm text-gray-700">
          Listing duration (weeks)
          <input
            type="number"
            min={1}
            max={12}
            value={weeks}
            onChange={(e) => setWeeks(Number(e.target.value) || 1)}
            className="field-control mt-1 px-4 py-2.5 text-sm"
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-[#1e3a5f] px-4 py-3 text-sm font-medium text-white hover:bg-[#152a45] disabled:opacity-60"
        >
          {saving ? "Publishing..." : "Publish listing"}
        </button>
      </form>
    </div>
  );
}
