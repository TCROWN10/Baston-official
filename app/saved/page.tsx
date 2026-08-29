"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/Footer";
import { getSavedHomes, removeSavedHome } from "@/lib/saved";
import type { SavedHome } from "@/lib/types";

export default function SavedPage() {
  const [homes, setHomes] = useState<SavedHome[]>([]);

  const refresh = () => setHomes(getSavedHomes());

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("saved-homes-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("saved-homes-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-10">
        <h1 className="mb-2 text-3xl font-bold text-black">Saved Homes</h1>
        <p className="mb-8 text-gray-600">Properties you&apos;ve saved for later.</p>

        {homes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <p className="text-lg font-medium text-black">No saved homes yet</p>
            <p className="mt-2 text-gray-600">Tap the heart on any listing to save it here.</p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-sm font-medium text-white"
            >
              Browse listings
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {homes.map((home) => (
              <article
                key={home.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="relative h-48">
                  <Image src={home.image} alt={home.title} fill className="object-cover" sizes="33vw" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-black">{home.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{home.location}</p>
                  <p className="mt-1 text-sm font-medium text-black">{home.price}</p>
                  <p className="mt-1 text-xs text-gray-500">{home.details}</p>
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/property/${home.id}`}
                      className="flex-1 rounded-lg bg-[#1e3a5f] px-3 py-2 text-center text-sm font-medium text-white"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        removeSavedHome(home.id);
                        refresh();
                      }}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
