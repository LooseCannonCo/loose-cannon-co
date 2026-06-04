import type { SanityImageSource } from "@sanity/image-url";

import { urlFor } from "@/sanity/image";
import { cn } from "@/lib/utils";

import { FrameVideo } from "./FrameVideo";
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
  /** Override the derived height. Normally CaseImage derives height from
   *  `aspect` + `width` so Sanity can apply a hotspot-aware crop server-side
   *  to match the frame. Override only when you need a specific pixel height. */
  height?: number;
  /** Extra class on the outer frame for parent positioning. */
  className?: string;
  /** When set, renders an autoplaying (muted/loop/playsinline) cover video in
   *  the frame instead of an image, taking priority over `image`. Reduced
   *  motion shows the poster, paused. Used for the Ayye work card. */
  videoSrc?: string;
  videoPoster?: string;
  /** Native aspect ratio (w/h). When provided, the frame uses the cover's own
   *  ratio (no fixed crop) capped by a max-height, instead of the `aspect`
   *  enum. The image is requested at native aspect. */
  ratio?: number;
  /** object-position for the media (e.g. "50% 20%" from a hotspot), used when
   *  a tall cover is capped by max-height so the focal area stays in frame. */
  objectPosition?: string;
}

/** Frame aspect ratio as W:H, used to derive crop dimensions for the URL. */
const ASPECT_RATIO: Record<CaseImageAspect, number> = {
  "4-3": 4 / 3,
  "16-9": 16 / 9,
  "1-1": 1,
  "3-4": 3 / 4,
};

/**
 * Reusable case-cover image. Same frame treatment whether content is real or
 * pending. The frame is a plum 1.5px border with an offset violet registration
 * bleed behind (the locked LC.co print-registration treatment). Sanity is
 * asked for a specific width AND height matching the frame aspect, with
 * fit("crop"), so the URL builder honors the per-field hotspot set in Studio
 * and returns a server-side crop that keeps the focal point in frame. CSS
 * `object-fit: cover` stays as a safety net for any asset that returns at
 * an off-ratio. When no image is set, the frame fills with a pink-1 base +
 * plum halftone via the global url(#ht-p) pattern and gets a small printer's
 * registration crosshair in the top-right corner.
 */
export function CaseImage({
  image,
  alt = "",
  aspect = "4-3",
  width = 800,
  height,
  className,
  videoSrc,
  videoPoster,
  ratio,
  objectPosition,
}: CaseImageProps) {
  const aspectClass = ASPECT_CLASS[aspect];
  // Native-aspect mode: the frame takes the cover's own ratio (capped by a
  // max-height in .coverNative) instead of a fixed crop, so nothing is sliced.
  const native = typeof ratio === "number" && ratio > 0;
  const shapeClass = native ? styles.coverNative : aspectClass;
  const frameStyle = native ? { aspectRatio: String(ratio) } : undefined;
  const mediaStyle = objectPosition ? { objectPosition } : undefined;

  if (videoSrc) {
    return (
      <div className={cn(styles.frame, shapeClass, className)} style={frameStyle}>
        <FrameVideo
          src={videoSrc}
          poster={videoPoster}
          objectPosition={objectPosition}
          className={styles.img}
        />
      </div>
    );
  }

  if (image) {
    // Native: request the image at width with no forced crop so it keeps its
    // own aspect (the frame matches, so cover does not crop until max-height).
    const src = native
      ? urlFor(image).width(width).quality(70).auto("format").url()
      : urlFor(image)
          .width(width)
          .height(height ?? Math.round(width / ASPECT_RATIO[aspect]))
          .quality(70)
          .fit("crop")
          .auto("format")
          .url();
    return (
      <div className={cn(styles.frame, shapeClass, className)} style={frameStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={styles.img}
          style={mediaStyle}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(styles.frame, shapeClass, styles.placeholder, className)}
      style={frameStyle}
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
