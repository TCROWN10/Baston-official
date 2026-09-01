"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

type Props = Omit<ImageProps, "src" | "onError"> & {
  src: string;
  fallbackSrc?: string;
};

function shouldSkipOptimization(src: string) {
  return (
    src.startsWith("/api/") ||
    src.startsWith("/facilities/") ||
    src.startsWith("/listings/")
  );
}

export function SafeImage({
  src,
  fallbackSrc = "/listings/hotel-1.jpg",
  alt,
  ...props
}: Props) {
  const resolvedSrc = src || fallbackSrc;
  const [current, setCurrent] = useState(resolvedSrc);

  useEffect(() => {
    setCurrent(resolvedSrc);
  }, [resolvedSrc]);

  return (
    <Image
      {...props}
      alt={alt}
      src={current || fallbackSrc}
      unoptimized={shouldSkipOptimization(current) || props.unoptimized}
      onError={() => {
        if (current !== fallbackSrc) setCurrent(fallbackSrc);
      }}
    />
  );
}
