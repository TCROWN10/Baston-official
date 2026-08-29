"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type Props = Omit<ImageProps, "src" | "onError"> & {
  src: string;
  fallbackSrc?: string;
};

export function SafeImage({
  src,
  fallbackSrc = "/listings/hotel-1.jpg",
  alt,
  ...props
}: Props) {
  const [current, setCurrent] = useState(src || fallbackSrc);
  const isApiPhoto = typeof current === "string" && current.startsWith("/api/");

  return (
    <Image
      {...props}
      alt={alt}
      src={current || fallbackSrc}
      unoptimized={isApiPhoto || props.unoptimized}
      onError={() => {
        if (current !== fallbackSrc) setCurrent(fallbackSrc);
      }}
    />
  );
}
