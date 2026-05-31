import type { SanityImageSource } from "@sanity/image-url";

import { urlFor } from "@/sanity/image";
import { cn } from "@/lib/utils";

import styles from "./CaseImage.module.css";

export type CaseImageAspect = "4-3" | "16-9" | "1-1" | "3-4";

export interface CaseImageProps {
  /** Sanity image source. When absent, an on-brand halftone print swatch
   *  renders in its place (same frame, same drop-shadow, no gray rectangle). */
  image?: SanityImageSource;
  /** Alt text for the rendered image. Ignored by the placeholder. */
  alt?: string;
  /** Frame aspect ratio. Default 4:3. */
  aspect?: CaseImageAspect;
  /** Render target width hint passed to Sanity's image URL builder. */
  width?: number;
  /** Render target height hint passed to Sanity's image URL builder. */
  height?: number;
  /** Extra class on the outer frame for parent positioning. */
  className?: string;
}

/**
 * Reusable case-cover image. Same frame treatment whether content is real or
 * pending. The frame is a plum 1.5px border with an offset violet registration
 * bleed behind (the locked LC.co print-registration treatment). When no image
 * is set, the frame fills with a pink-1 base + plum halftone via the global
 * url(#ht-p) pattern and gets a small printer's registration crosshair in the
 * top-right corner. Reads as intentional print design, not "missing image".
 */
export function CaseImage({
  image,
  alt = "",
  aspect = "4-3",
  width = 800,
  height,
  className,
}: CaseImageProps) {
  const aspectClass = ASPECT_CLASS[aspect];

  if (image) {
    let builder = urlFor(image).width(width).quality(70).fit("crop").auto("format");
    if (height) builder = builder.height(height);
    const src = builder.url();
    return (
      <div className={cn(styles.frame, aspectClass, className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={styles.img} loading="lazy" />
      </div>
    );
  }

  return (
    <div
      className={cn(styles.frame, aspectClass, styles.placeholder, className)}
      aria-hidden="true"
    >
      {/* Pink-1 base under plum halftone, mirroring the print-registration
          base layer. Halftone uses the global ht-p pattern at 55% so the
          plum dots read clearly but don't go solid. */}
      <svg
        className={styles.halftone}
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <rect width="100" height="100" fill="var(--lc-pink-1)" />
        <rect width="100" height="100" fill="url(#ht-p)" opacity="0.55" />
      </svg>
      {/* Registration crosshair (real press production artifact): circle + cross.
          Sits top-right inside the frame, plum, ~22px in viewBox units. */}
      <svg className={styles.regMark} viewBox="0 0 24 24" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="7.5"
          fill="none"
          stroke="var(--lc-plum)"
          strokeWidth="1.5"
        />
        <line
          x1="12"
          y1="1.5"
          x2="12"
          y2="22.5"
          stroke="var(--lc-plum)"
          strokeWidth="1.5"
        />
        <line
          x1="1.5"
          y1="12"
          x2="22.5"
          y2="12"
          stroke="var(--lc-plum)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

const ASPECT_CLASS: Record<CaseImageAspect, string> = {
  "4-3": styles.aspect43,
  "16-9": styles.aspect169,
  "1-1": styles.aspect11,
  "3-4": styles.aspect34,
};
