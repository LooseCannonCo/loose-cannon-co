"use client";

import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/lib/motion";

export interface FrameVideoProps {
  src: string;
  poster: string;
  /** Class applied to the <video> (object-fit cover fill of the frame). */
  className?: string;
}

/**
 * Cover video used inside a CaseImage frame (the Ayye work card). Muted, loop,
 * playsinline, object-fit cover. Autoplays on mount via play() (no autoPlay
 * attribute), EXCEPT under prefers-reduced-motion, where it stays paused on
 * its poster frame. Decorative cover, so aria-hidden and no controls; the
 * band's client name + link carry the accessible label.
 */
export function FrameVideo({ src, poster, className }: FrameVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return; // leave paused on the poster
    const v = ref.current;
    if (v) {
      void v.play().catch(() => {
        /* Autoplay can be refused; the poster stays up, which is fine. */
      });
    }
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
