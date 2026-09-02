"use client";

import { useRouter } from "next/navigation";
import { useRef, type ReactNode } from "react";
import { HOME_HREF, INTRO_HREF } from "@/lib/site-nav";

const DOUBLE_CLICK_MS = 320;

type BrandLogoLinkProps = {
  children: ReactNode;
  className?: string;
  singleHref?: string;
  title?: string;
};

/** Single click → landing page; double click → intro video. */
export function BrandLogoLink({
  children,
  className = "",
  singleHref = HOME_HREF,
  title = "Go to home. Double-click for intro video.",
}: BrandLogoLinkProps) {
  const router = useRouter();
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    if (clickTimer.current) return;
    clickTimer.current = setTimeout(() => {
      clickTimer.current = null;
      router.push(singleHref);
    }, DOUBLE_CLICK_MS);
  };

  const handleDoubleClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
    router.push(INTRO_HREF);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`cursor-pointer text-left ${className}`}
      title={title}
    >
      {children}
    </button>
  );
}
