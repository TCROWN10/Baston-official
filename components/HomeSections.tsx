"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { BLOG_POSTS, LOCATIONS, PROPERTY_TYPES } from "@/lib/data";

export function LocationGrid() {
  const items = LOCATIONS;

  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl font-bold text-black sm:text-2xl lg:text-3xl">
            Listings by <span className="text-[#3d7ea6]">location</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:grid-rows-2">
          <div className="sm:col-start-1 sm:row-start-1">
            <LocationCard {...items[0]} />
          </div>
          <div className="md:col-start-2 md:row-span-2 md:row-start-1">
            <LocationCard {...items[1]} />
          </div>
          <div className="md:col-start-3 md:row-start-1">
            <LocationCard {...items[2]} />
          </div>
          <div className="md:col-start-1 md:row-start-2">
            <LocationCard {...items[3]} />
          </div>
          <div className="md:col-start-3 md:row-start-2">
            <LocationCard {...items[4]} />
          </div>
        </div>
      </div>
    </section>
  );
}

function LocationCard({
  city,
  image,
  hasTag,
}: {
  city: string;
  image: string;
  hasTag: boolean;
}) {
  return (
    <Link href={`/search?location=${encodeURIComponent(city)}`}>
      <article className="group relative h-full overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg">
        <div className="relative h-full min-h-[200px] w-full sm:min-h-[240px] md:min-h-[280px]">
          <Image
            alt={city}
            src={image}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 33vw"
          />
          {hasTag ? (
            <div className="absolute left-3 top-3 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-black">
              Hourly Reservation Available
            </div>
          ) : null}
          <button
            type="button"
            aria-label={`Add ${city} to favorites`}
            className="cursor-pointer absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <div className="absolute bottom-3 right-3">
            <p className="text-xl font-bold text-white drop-shadow-lg sm:text-2xl">{city}</p>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function PropertyTypeCarousel() {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    ref.current.scrollTo({
      left: ref.current.scrollLeft + (dir === "left" ? -720 : 720),
      behavior: "smooth",
    });
  };

  return (
    <section className="relative bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <h2 className="mb-2 text-xl font-bold text-black sm:mb-3 sm:text-2xl lg:text-3xl">
            Explore <span className="text-[#3d7ea6]">Bastion Technology</span> Sectors
          </h2>
          <p className="text-sm text-gray-600 sm:text-base lg:max-w-2xl">
            From education and health to billboards, telecom, and digital addressing — discover how
            Bastion Technology maps, verifies, and connects Nigeria&apos;s critical infrastructure.
          </p>
        </div>
        <div className="relative">
          <div ref={ref} className="scrollbar-hide flex gap-4 overflow-x-auto py-4 sm:gap-6">
            {PROPERTY_TYPES.map((item) => (
              <article
                key={item.title}
                className="group relative shrink-0 overflow-hidden rounded-lg border border-gray-200 shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] w-[280px] sm:w-80 md:w-[450px]">
                  <Image
                    alt={item.title}
                    src={item.image}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="450px"
                  />
                  <button
                    type="button"
                    aria-label="Save to favorites"
                    className="cursor-pointer absolute bottom-3 left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm transition hover:bg-white hover:text-red-500"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-16">
                    <h3 className="text-xl font-bold text-white sm:text-2xl">{item.title}</h3>
                    <p className="mt-1 text-sm text-white/90">{item.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <ScrollButtons onLeft={() => scroll("left")} onRight={() => scroll("right")} />
        </div>
      </div>
    </section>
  );
}

export function BlogCarousel() {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    ref.current.scrollTo({
      left: ref.current.scrollLeft + (dir === "left" ? -720 : 720),
      behavior: "smooth",
    });
  };

  return (
    <section id="blog" className="relative bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <h2 className="mb-2 text-xl font-bold text-black sm:mb-3 sm:text-2xl lg:text-3xl">
            Insights From Our <span className="text-[#3d7ea6]">Blog</span>
          </h2>
          <p className="text-sm text-gray-600 sm:text-base lg:max-w-2xl">
            Stay informed on digital addressing, sector registry updates, field data collection, and
            how Bastion Technology is mapping Nigeria&apos;s critical infrastructure.
          </p>
        </div>
        <div className="relative">
          <div ref={ref} className="scrollbar-hide flex gap-4 overflow-x-auto py-4 sm:gap-6">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.slug}
                className="group relative shrink-0 overflow-hidden rounded-lg border border-gray-200 shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] w-[280px] sm:w-80 md:w-[420px]">
                  <Image
                    alt={post.title}
                    src={post.image}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="420px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 sm:p-5">
                    <p className="text-xs text-white/80">
                      {post.date} | {post.category}
                    </p>
                    <h3 className="text-base font-bold leading-snug text-white sm:text-xl md:text-2xl lg:text-3xl">
                      {post.title}
                    </h3>
                    <p className="text-xs text-white/90 sm:text-sm md:text-base lg:text-lg">
                      {post.description}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="cursor-pointer w-fit rounded-lg bg-[#3d7ea6] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#326a8c] sm:px-6 sm:py-3 sm:text-sm lg:px-8 lg:py-3.5"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <ScrollButtons onLeft={() => scroll("left")} onRight={() => scroll("right")} />
        </div>
      </div>
    </section>
  );
}

function ScrollButtons({
  onLeft,
  onRight,
}: {
  onLeft: () => void;
  onRight: () => void;
}) {
  return (
    <>
      <button
        onClick={onLeft}
        aria-label="Scroll left"
        className="cursor-pointer absolute -left-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#3d7ea6] text-white shadow-lg transition-colors hover:bg-[#326a8c] sm:-left-4 sm:h-12 sm:w-12 lg:-left-10"
      >
        <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={onRight}
        aria-label="Scroll right"
        className="cursor-pointer absolute -right-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#3d7ea6] text-white shadow-lg transition-colors hover:bg-[#326a8c] sm:-right-4 sm:h-12 sm:w-12 lg:-right-10"
      >
        <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </>
  );
}
