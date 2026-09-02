"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BRAND } from "@/lib/brand";
import { HOME_HREF } from "@/lib/site-nav";

const INTRO_VIDEO = "/First-page-.mp4";

export function IntroPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    video.loop = true;
    const keepPlaying = () => {
      if (video.paused) void video.play().catch(() => undefined);
    };
    video.addEventListener("ended", keepPlaying);
    void video.play().catch(() => {
      // Autoplay may be blocked until user interaction.
    });
    return () => video.removeEventListener("ended", keepPlaying);
  }, [muted]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !video.muted;
    video.muted = next;
    setMuted(next);
    if (!next) void video.play().catch(() => undefined);
  };

  return (
    <main className="relative flex h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-[#0f1f35]">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-contain object-center sm:object-cover"
        autoPlay
        loop
        muted={muted}
        playsInline
        preload="auto"
        src={INTRO_VIDEO}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f1f35]/95 via-[#1e3a5f]/20 to-transparent" />

      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Unmute video" : "Mute video"}
        aria-pressed={muted}
        className="absolute right-3 top-3 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/45 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/60 sm:right-6 sm:top-6 sm:h-11 sm:w-11"
      >
        {muted ? <VolumeMutedIcon /> : <VolumeOnIcon />}
      </button>

      <div className="relative z-10 mt-auto w-full px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8 sm:px-6 sm:pb-10">
        <div className="mx-auto w-full max-w-xl text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80 sm:text-sm sm:tracking-[0.2em]">
            Welcome to {BRAND.name}
          </p>
          <Link
            href={HOME_HREF}
            className="inline-flex w-full touch-manipulation items-center justify-center rounded-xl bg-[#3d7ea6] px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#326a8c] sm:min-w-[320px] sm:px-8 sm:py-4 sm:text-base"
          >
            <span className="sm:hidden">Continue with Bastion</span>
            <span className="hidden sm:inline">Continue with Bastion Technology</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

function VolumeMutedIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
    </svg>
  );
}

function VolumeOnIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.536 8.464a5 5 0 010 7.072M12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M18.364 5.636a9 9 0 010 12.728"
      />
    </svg>
  );
}
