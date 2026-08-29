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

  return (
    <Image
      {...props}
      alt={alt}
      src={current || fallbackSrc}
      onError={() => {
        if (current !== fallbackSrc) setCurrent(fallbackSrc);
      }}
    />
  );
}
