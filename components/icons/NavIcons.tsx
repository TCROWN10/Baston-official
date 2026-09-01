/** Sidebar & nav icons — SVG so they render on all devices (⌂ often invisible). */

type IconProps = { className?: string };

/** Figma-style panel toggle — rectangle with left sidebar rail. */
export function SidebarPanelToggleIcon({ className = "h-5 w-5 shrink-0" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M9 5v14" />
    </svg>
  );
}

export function DashboardNavIcon({ className = "h-4 w-4 shrink-0" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

export function HomeNavIcon({ className = "h-4 w-4 shrink-0" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}

export function NavIconGlyph({ icon, className }: { icon: string; className?: string }) {
  const box = "flex h-5 w-5 shrink-0 items-center justify-center";

  if (icon === "dashboard") {
    return (
      <span className={box}>
        <DashboardNavIcon className={className ?? "h-4 w-4"} />
      </span>
    );
  }
  if (icon === "home") {
    return (
      <span className={box}>
        <HomeNavIcon className={className ?? "h-4 w-4"} />
      </span>
    );
  }

  return (
    <span aria-hidden className={`${box} text-xs`}>
      {icon}
    </span>
  );
}
