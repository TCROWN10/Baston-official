/** Shared site navigation — USSAP sectors + properties & hotels marketplace */

export const SECTOR_NAV = [
  { href: "/ussap/map", label: "Live Map" },
  { href: "/ussap/schools", label: "Education" },
  { href: "/ussap/health", label: "Health" },
  { href: "/ussap/billboards", label: "Billboards" },
  { href: "/ussap/telecom", label: "Telecom" },
  { href: "/ussap/projects", label: "Projects" },
  { href: "/ussap/traffic", label: "Traffic" },
  { href: "/ussap/residential", label: "Addresses" },
  { href: "/ussap/field", label: "Field" },
] as const;

export const PROPERTIES_NAV = [
  { href: "/buy", label: "Buy" },
  { href: "/rent", label: "Rent" },
  { href: "/shortlet", label: "Shortlet" },
  { href: "/hotels", label: "Hotels" },
] as const;

/** Primary links on large desktop screens (xl+). */
export const DESKTOP_NAV = [
  { href: "/ussap/schools", label: "Education" },
  { href: "/ussap/health", label: "Health" },
  { href: "/ussap/billboards", label: "Billboards" },
  { href: "/ussap/telecom", label: "Telecom" },
  { href: "/ussap/map", label: "Live Map" },
  { href: "/hotels", label: "Hotels" },
  { href: "/shortlet", label: "Stays" },
] as const;

/** Bottom bar on phones — USSAP-first, hotels included. */
export const MOBILE_TAB_NAV = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/ussap/schools", label: "Education", icon: "🎓" },
  { href: "/ussap/health", label: "Health", icon: "🏥" },
  { href: "/hotels", label: "Hotels", icon: "🏨" },
] as const;

/** Horizontal chip strip on tablets. */
export const TABLET_CHIP_NAV = [
  { href: "/ussap/schools", label: "Education" },
  { href: "/ussap/health", label: "Health" },
  { href: "/ussap/billboards", label: "Billboards" },
  { href: "/ussap/telecom", label: "Telecom" },
  { href: "/ussap/map", label: "Live Map" },
  { href: "/hotels", label: "Hotels" },
  { href: "/shortlet", label: "Stays" },
] as const;

/** Key USSAP links in the mobile drawer (full list). */
export const MOBILE_USSAP_NAV = [
  { href: "/ussap/map", label: "Live map" },
  { href: "/ussap/schools", label: "Education" },
  { href: "/ussap/health", label: "Health" },
  { href: "/ussap/billboards", label: "Billboards" },
  { href: "/ussap/telecom", label: "Telecom" },
  { href: "/ussap/projects", label: "Projects" },
  { href: "/ussap/field", label: "Field data" },
  { href: "/ussap/sectors/core", label: "Bastion services" },
] as const;

/** Marketplace links in the mobile drawer. */
export const MOBILE_MARKETPLACE_NAV = [
  { href: "/buy", label: "Buy property" },
  { href: "/rent", label: "Rent property" },
  { href: "/shortlet", label: "Short stays" },
  { href: "/hotels", label: "Hotels & hospitality" },
] as const;

export const PROPERTIES_HUB = [
  {
    href: "/buy",
    title: "Buy a home",
    body: "Verified houses, apartments, and land for sale across Nigeria.",
    cta: "Browse for sale",
  },
  {
    href: "/rent",
    title: "Rent a home",
    body: "Long-term rentals from trusted agents — apartments, houses, and studios.",
    cta: "Browse rentals",
  },
  {
    href: "/shortlet",
    title: "Shortlet stays",
    body: "Short-stay apartments and serviced flats — contact hosts directly.",
    cta: "Browse shortlets",
  },
  {
    href: "/hotels",
    title: "Hotels",
    body: "Hotel directory with adverts and government registration verification.",
    cta: "Browse hotels",
  },
] as const;

export function navActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/hotels") return pathname.startsWith("/hotels");
  if (href === "/buy") return pathname.startsWith("/buy") || pathname.startsWith("/property");
  if (href === "/rent") return pathname.startsWith("/rent");
  if (href === "/shortlet") return pathname.startsWith("/shortlet");
  if (href === "/ussap/schools") return pathname.startsWith("/ussap/schools") || pathname.startsWith("/schools");
  if (href === "/ussap/health") return pathname.startsWith("/ussap/health");
  if (href === "/ussap/sectors") return pathname.startsWith("/ussap/sectors");
  if (href === "/saved") return pathname.startsWith("/saved");
  return pathname.startsWith(href);
}
