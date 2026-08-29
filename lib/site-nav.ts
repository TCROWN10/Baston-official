/** Shared site navigation — USSAP sectors + properties & hotels marketplace */

export const SECTOR_NAV = [
  { href: "/ussap/map", label: "Live Map" },
  { href: "/ussap/telecom", label: "Telecom" },
  { href: "/ussap/projects", label: "Projects" },
  { href: "/ussap/traffic", label: "Traffic" },
  { href: "/ussap/schools", label: "Schools" },
  { href: "/ussap/residential", label: "Addresses" },
  { href: "/ussap/field", label: "Field" },
] as const;

export const PROPERTIES_NAV = [
  { href: "/buy", label: "Buy" },
  { href: "/rent", label: "Rent" },
  { href: "/shortlet", label: "Shortlet" },
  { href: "/hotels", label: "Hotels" },
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
  if (href === "/search") return pathname.startsWith("/search");
  if (href === "/saved") return pathname.startsWith("/saved");
  return pathname.startsWith(href);
}
