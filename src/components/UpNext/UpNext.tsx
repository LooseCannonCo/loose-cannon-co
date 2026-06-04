import type { SanityImageSource } from "@sanity/image-url";

import { CaseImage } from "@/components/CaseImage/CaseImage";
import { SectionEyebrow } from "@/components/SectionEyebrow/SectionEyebrow";

import styles from "./UpNext.module.css";

export interface UpNextProps {
  /** Next case name, e.g. "Smolotov.". */
  title: string;
  /** Link to the next case. */
  href: string;
  /** Left side of the meta row, e.g. "Performance Creative". The case-number
   *  prefix was dropped from the UI; this now carries the discipline only. */
  caseLabel: string;
  /** Short descriptor on the right of the meta row. */
  descriptor: string;
  /** Next case's poster image. Renders a 16:9 teaser frame below the meta row
   *  so the page ends on a visual, not a bare link. When absent, CaseImage
   *  falls back to the on-brand halftone swatch with a registration crosshair
   *  so the teaser still reads as intentional. */
  posterImage?: SanityImageSource;
  psText?: string;
  psHref?: string;
}

/** Section 10: the "Up next" pointer with the arrow that slides on hover, a
 *  16:9 teaser frame of the next case's poster image, plus the P.S. line
 *  tucked top-right. */
export function UpNext({
  title,
  href,
  caseLabel,
  descriptor,
  posterImage,
  psText = "P.S. want this for your brand? Start a project →",
  psHref = "/contact",
}: UpNextProps) {
  return (
    <section data-reveal-section className={styles.wrap}>
      <a href={href} className={styles.upnext}>
        <SectionEyebrow>Up next</SectionEyebrow>
        <div className={styles.ttlRow} data-reveal>
          <h3 className={styles.ttlText}>{title}</h3>
          <span className={styles.arrow} aria-hidden="true">
            {"→"}
          </span>
        </div>
        <div className={styles.metaRow} data-reveal>
          <span>{caseLabel}</span>
          <span>{descriptor}</span>
        </div>
        <div className={styles.teaser} data-reveal>
          <CaseImage
            image={posterImage}
            alt={`${title} teaser`}
            aspect="16-9"
            width={1280}
          />
        </div>
      </a>
      <a href={psHref} className={styles.ps} data-reveal>
        {psText}
      </a>
    </section>
  );
}
