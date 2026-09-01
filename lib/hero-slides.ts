export type HeroSlide = {
  id: string;
  label: string;
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  kicker?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  type: "property" | "sector";
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "education",
    label: "Education",
    type: "sector",
    image: "/facilities/ekiti/schools/christs-school-ado-ekiti.jpg",
    imageAlt: "Christ's School Ado-Ekiti — Ekiti State secondary school",
    title: "Map every school by tier and setting",
    description:
      "Registered vs. non-registered institutions across Primary, Secondary, and Tertiary — with infrastructure audits and teacher–student metrics.",
    ctaLabel: "Education module",
    ctaHref: "/ussap/schools",
    secondaryLabel: "Module overview",
    secondaryHref: "/ussap/sectors/education",
  },
  {
    id: "health",
    label: "Health",
    type: "sector",
    image: "/Health-Hero.jpg",
    imageAlt: "Modern Nigerian hospital and healthcare facility",
    title: "Locate health facilities in minutes",
    description:
      "From tertiary hospitals to rural health centres — track equipment, pharmaceutical stock, mobile teams, and cold-chain coverage.",
    ctaLabel: "Health module",
    ctaHref: "/ussap/health",
    secondaryLabel: "Module overview",
    secondaryHref: "/ussap/sectors/health",
  },
  {
    id: "billboards",
    label: "Billboards",
    type: "sector",
    image: "/Abuja-image.jpg",
    imageAlt: "Outdoor advertising and urban signage in Nigeria",
    title: "Audit outdoor signage in minutes",
    description:
      "Geo-tagged legal vs. unauthorized billboards with permit expiry tracking, dimension verification, and revenue enforcement.",
    ctaLabel: "Billboard registry",
    ctaHref: "/ussap/billboards",
    secondaryLabel: "Module overview",
    secondaryHref: "/ussap/sectors/billboards",
  },
  {
    id: "telecom",
    label: "Telecom",
    type: "sector",
    image: "/Lagos-Image.jpg",
    imageAlt: "Telecom tower infrastructure across Lagos skyline",
    title: "Track every tower and fibre node",
    description:
      "Cellular towers, BTS sites, and fibre routing with signal footprint logging, uptime analytics, and maintenance photo verification.",
    ctaLabel: "Telecom registry",
    ctaHref: "/ussap/telecom",
    secondaryLabel: "Module overview",
    secondaryHref: "/ussap/sectors/telecom",
  },
  {
    id: "core",
    label: "Bastion",
    type: "sector",
    image: "/Blog1-image.jpg",
    imageAlt: "Bastion TECHNOLOGY field data collection and project monitoring",
    title: "Monitoring, assessment & data for every sector",
    description:
      "Universal data gathering with GPS-tagged forms, offline sync, and media uploads — plus project lifecycle tracking from conception to completion.",
    ctaLabel: "Field collection",
    ctaHref: "/ussap/field",
    secondaryLabel: "Our services",
    secondaryHref: "/ussap/sectors/core",
  },
  {
    id: "hospitality",
    label: "Hotels",
    type: "sector",
    image: "/Hotel-image.jpg",
    imageAlt: "Nigerian hotel and hospitality property",
    title: "Verify hospitality in minutes",
    description:
      "Complete hotel directory by tier and capacity — with hygiene, fire safety, structural compliance, and tourist tax auditing.",
    ctaLabel: "Browse hotels",
    ctaHref: "/hotels",
    secondaryLabel: "Module overview",
    secondaryHref: "/ussap/sectors/hospitality",
  },
  {
    id: "property",
    label: "Stays",
    type: "property",
    image: "/Hero-Image.jpg",
    imageAlt: "Modern homes and shortlet apartments in Nigeria",
    title: "Find a place to stay in minutes",
    description:
      "Discover verified shortlets, rentals, and homes for sale — powered by USSAP digital addresses across Nigeria.",
  },
];

/** How long each slide stays visible before advancing. */
export const HERO_AUTOPLAY_MS = 9000;

/** Slide transition duration — keep this slow and smooth. */
export const HERO_TRANSITION_MS = 1400;
