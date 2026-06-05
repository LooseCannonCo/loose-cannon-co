import type { SanityImageSource } from "@sanity/image-url";

import { CaseImage } from "@/components/CaseImage/CaseImage";
import { cn } from "@/lib/utils";

import styles from "./CaseBand.module.css";

export interface CaseBandProps {
  slug: string;
  client: string;
  discipline: string;
  year: string;
  /** One-line hook from hero.headline; rendered as the support paragraph. */
  headline?: string;
  /** Sanity cover image. Falls back to the on-brand halftone swatch. */
  coverImage?: SanityImageSource;
  /** Native aspect ratio (w/h) of the cover image, so the card uses the
   *  cover's own shape instead of a fixed crop. */
  coverRatio?: number;
  /** Cover hotspot; keeps the focal area in frame if a tall cover is capped. */
  coverHotspot?: { x: number; y: number };
  /** Optional cover video (autoplay/muted/loop/playsinline). Overrides the
   *  cover image for this band. Used only by the Ayye card. */
  coverVideo?: { src: string; poster: string };
  /** Presentation-only: extra class on the band root (e.g. the scroll-reveal
   *  class from /work). Does not affect the Sanity-driven content. */
  className?: string;
  /** Presentation-only: vertical sidelabel text for this row (e.g.
   *  "Receipt 01"), numbered by the row's order on /work. Hidden under 900px. */
  receiptLabel?: string;
}

/**
 * Big alternating case band for /work. Half-width image, half-width text:
 * eyebrow (discipline + year), the client name at statement scale with an
 * arrow that nudges on hover, and a one-line hook. The big hero stat
 * number lives only on the individual case study detail pages now; /work
 * is an immersive index, not a stats showcase. Alternation per band is
 * handled in CSS via :nth-child. WorkRow remains for the home / about /
 * services compact teasers.
 */
export function CaseBand({
  slug,
  client,
  discipline,
  year,
  headline,
  coverImage,
  coverRatio,
  coverHotspot,
  coverVideo,
  className,
  receiptLabel,
}: CaseBandProps) {
  // Squash any \n breaks in the hero headline into a single line for the
  // band's hook paragraph.
  const hook = (headline ?? "").replace(/\s*\n\s*/g, " ").trim();
  // Strip any month prefix from a freeform year so the eyebrow stays tight.
  const displayYear = (year ?? "").match(/\d{4}/)?.[0] ?? year;
  // Video covers (Ayye) are 16:9; image covers use their native ratio.
  const ratio = coverVideo ? 16 / 9 : coverRatio;
  // Hotspot to object-position, used only if the cover gets capped.
  const objectPosition = coverHotspot
    ? `${coverHotspot.x * 100}% ${coverHotspot.y * 100}%`
    : undefined;

  return (
    <a
      href={`/work/${slug}`}
      className={cn(styles.band, className)}
      data-flippy-react="work"
    >
      {receiptLabel ? (
        <span className={styles.sidelabel} aria-hidden="true">
          {receiptLabel}
        </span>
      ) : null}
      <div className={styles.bandImage}>
        <CaseImage
          image={coverImage}
          videoSrc={coverVideo?.src}
          videoPoster={coverVideo?.poster}
          ratio={ratio}
          objectPosition={objectPosition}
          alt={`${client} cover`}
          width={1100}
          className={styles.image}
        />
      </div>
      <div className={styles.bandText}>
        <div className={styles.eyebrow}>
          {discipline} · {displayYear}
        </div>
        <h2 className={styles.name}>
          <span>{client}.</span>
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </h2>
        {hook ? <p className={styles.hook}>{hook}</p> : null}
      </div>
    </a>
  );
}
