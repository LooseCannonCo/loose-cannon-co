"use client";

import { useEffect, useRef, useState } from "react";

import { prefersReducedMotion } from "@/lib/motion";

export interface AyyeVideoProps {
  src: string;
  poster: string;
  /** Accessible label, e.g. "Creators". */
  label: string;
  className?: string;
}

/**
 * UGC spot. 16:9, muted, loop, playsinline. Autoplays on mount, EXCEPT under
 * prefers-reduced-motion, where it stays paused on its poster and exposes
 * native controls so the viewer can start it themselves. No `autoPlay`
 * attribute is set; playback is started imperatively so reduced-motion never
 * gets a flash of motion.
 */
export function AyyeVideo({ src, poster, label, className }: AyyeVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const r = prefersReducedMotion();
    setReduce(r);
    const v = ref.current;
    if (v && !r) {
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
      controls={reduce}
      preload="metadata"
      aria-label={label}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
