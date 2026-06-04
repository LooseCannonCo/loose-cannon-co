import type { SanityImageSource } from "@sanity/image-url";

import { CaseImage } from "@/components/CaseImage/CaseImage";

import styles from "./WorkRow.module.css";

export interface WorkRowProps {
  slug: string;
  client: string;
  discipline: string;
  year: string;
  /** One-line preview from hero.headline; rendered as the support paragraph. */
  headline?: string;
  /** Sanity cover image. Falls back to the on-brand halftone placeholder if
   *  absent so every row reads as intentional print design. */
  coverImage?: SanityImageSource;
}

/**
 * Compact case teaser used by the home featured-work section, the about
 * page proof list, and the services page Smolotov pin. Cover image + case
 * name + discipline/year meta + a one-line preview. No stat number; the
 * big slot-roll lives only on the individual case study detail pages
 * where the number has context. /work uses CaseBand for the big
 * alternating treatment.
 */
export function WorkRow({
  slug,
  client,
  discipline,
  year,
  headline,
  coverImage,
}: WorkRowProps) {
  const preview = (headline ?? "").replace(/\s*\n\s*/g, " ").trim();
  // Display layer only: normalize meta to "Discipline · Year", stripping any
  // month from a full date like "May 2026" (Sanity doc is untouched).
  const displayYear = (year ?? "").match(/\d{4}/)?.[0] ?? year;

  return (
    <a
      href={`/work/${slug}`}
      className={styles.row}
      data-flippy-react="work"
    >
      <CaseImage
        image={coverImage}
        alt={`${client} cover`}
        aspect="4-3"
        width={600}
        className={styles.cover}
      />

      <div className={styles.left}>
        <h2 className={styles.client}>{client}.</h2>
        <div className={styles.meta}>
          {discipline} · {displayYear}
        </div>
        {preview ? <p className={styles.preview}>{preview}</p> : null}
      </div>
    </a>
  );
}
