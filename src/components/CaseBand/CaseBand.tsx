import type { SanityImageSource } from "@sanity/image-url";

import { CaseImage } from "@/components/CaseImage/CaseImage";

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
  /** Optional cover video (autoplay/muted/loop/playsinline). Overrides the
   *  cover image for this band. Used only by the Ayye card. */
  coverVideo?: { src: string; poster: string };
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
  coverVideo,
}: CaseBandProps) {
  // Squash any \n breaks in the hero headline into a single line for the
  // band's hook paragraph.
  const hook = (headline ?? "").replace(/\s*\n\s*/g, " ").trim();
  // Strip any month prefix from a freeform year so the eyebrow stays tight.
  const displayYear = (year ?? "").match(/\d{4}/)?.[0] ?? year;

  return (
    <a
      href={`/work/${slug}`}
      className={styles.band}
      data-flippy-react="work"
    >
      <div className={styles.bandImage}>
        <CaseImage
          image={coverImage}
          videoSrc={coverVideo?.src}
          videoPoster={coverVideo?.poster}
          alt={`${client} cover`}
          aspect="4-3"
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
