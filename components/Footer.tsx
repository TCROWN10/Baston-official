"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { BRAND_NAME } from "@/lib/data";
import { MOBILE_TAB_NAV } from "@/lib/site-nav";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="safe-area-inset-bottom fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-1.5 shadow-lg backdrop-blur sm:px-4 sm:py-2 lg:hidden">
      <div className="mx-auto grid max-w-7xl grid-cols-4 gap-0.5 sm:gap-1">
        {MOBILE_TAB_NAV.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-center transition-colors sm:gap-1 sm:px-2 sm:py-2 ${
                active ? "bg-[#1e3a5f]/10 text-[#1e3a5f]" : "text-slate-600 hover:bg-slate-50 active:bg-slate-100"
              }`}
            >
              <span className="text-xl sm:text-2xl">{item.icon}</span>
              <span
                className={`text-[10px] font-semibold sm:text-xs ${
                  active ? "text-[#1e3a5f]" : "text-slate-600"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Newsletter() {
  return (
    <section className="bg-white px-4 py-8 sm:px-6 sm:py-12 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
          <div className="absolute inset-0">
            <Image
              alt="Newsletter background"
              fill
              className="object-cover"
              src="/Newsetter-image.jpg"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8">
            <h2 className="mb-6 text-lg font-bold leading-tight text-white sm:mb-8 sm:text-xl md:text-2xl lg:text-4xl">
              Get USSAP updates on digital addressing, sector registries, and spatial intelligence —
              delivered to your inbox every week
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:gap-4"
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="flex-1 field-control bg-white px-4 py-2.5 text-sm text-black placeholder:text-gray-400 focus:outline-none sm:py-3 sm:text-base"
              />
              <button
                type="submit"
                className="cursor-pointer rounded-lg bg-[#1e3a5f] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#152a45] sm:px-8 sm:py-3 sm:text-base"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <Newsletter />
      <div className="bg-[#1e3a5f]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-3 xl:grid-cols-5">
            <div className="sm:col-span-2 md:col-span-3 xl:col-span-1">
              <Link className="mb-3 flex items-center gap-2 sm:mb-4" href="/">
                <svg className="h-6 w-6 shrink-0 text-white sm:h-8 sm:w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
                <span className="text-lg font-bold text-white sm:text-xl">{BRAND_NAME}</span>
              </Link>
              <p className="text-xs leading-5 text-white/90 sm:text-sm sm:leading-6">
                {BRAND_NAME} — Unified Smart Spatial Addressing Platform. Find verified stays and
                precise digital addresses for homes, schools, telecom sites, projects, and civic
                infrastructure across Nigeria.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-white sm:mb-4 sm:text-base">Helpful Information</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link href="/faqs" className="text-sm text-white/90 transition-colors hover:text-white">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-white/90 transition-colors hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-white/90 transition-colors hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-white/90 transition-colors hover:text-white">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/#blog" className="text-sm text-white/90 transition-colors hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-white sm:mb-4 sm:text-base">Properties</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link href="/buy" className="text-sm text-white/90 transition-colors hover:text-white">
                    Buy
                  </Link>
                </li>
                <li>
                  <Link href="/rent" className="text-sm text-white/90 transition-colors hover:text-white">
                    Rent
                  </Link>
                </li>
                <li>
                  <Link href="/shortlet" className="text-sm text-white/90 transition-colors hover:text-white">
                    Shortlet
                  </Link>
                </li>
                <li>
                  <Link href="/hotels" className="text-sm text-white/90 transition-colors hover:text-white">
                    Hotels
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="text-sm text-white/90 transition-colors hover:text-white">
                    Search
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-white sm:mb-4 sm:text-base">USSAP</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link href="/ussap/map" className="text-sm text-white/90 transition-colors hover:text-white">
                    Live map
                  </Link>
                </li>
                <li>
                  <Link href="/ussap/residential" className="text-sm text-white/90 transition-colors hover:text-white">
                    Digital addresses
                  </Link>
                </li>
                <li>
                  <Link href="/ussap/field" className="text-sm text-white/90 transition-colors hover:text-white">
                    Field / offline
                  </Link>
                </li>
                <li>
                  <Link href="/government" className="text-sm text-white/90 transition-colors hover:text-white">
                    Government
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-white sm:mb-4 sm:text-base">Directories</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link href="/schools" className="text-sm text-white/90 transition-colors hover:text-white">
                    Schools directory
                  </Link>
                </li>
                <li>
                  <Link href="/companies" className="text-sm text-white/90 transition-colors hover:text-white">
                    Companies
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-white sm:mb-4 sm:text-base">Legal</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link href="/terms" className="text-sm text-white/90 transition-colors hover:text-white">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-white/90 transition-colors hover:text-white">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({
  children,
  showMobileNav = true,
}: {
  children: React.ReactNode;
  showMobileNav?: boolean;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-slate-50">
      <Header />
      <main className={`min-w-0 flex-1 ${showMobileNav ? "pb-24 lg:pb-0" : ""}`}>{children}</main>
      <Footer />
      {showMobileNav ? <MobileNav /> : null}
    </div>
  );
}
