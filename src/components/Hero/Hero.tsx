import { HeroNumber, type HeroNumberProps } from "@/components/HeroNumber/HeroNumber";
import { SectionEyebrow } from "@/components/SectionEyebrow/SectionEyebrow";

import styles from "./Hero.module.css";

export interface HeroProps {
  eyebrow: string;
  /** Optional. Omit on stat-less heroes: the entire number block is skipped
   *  and the eyebrow / headline / subhead / meta close up at the existing
   *  intra-loose rhythm with no leftover gap. */
  number?: HeroNumberProps;
  /** Supports "\n" for forced line breaks. */
  headline: string;
  subhead: string;
  meta: string | string[];
  artifact: React.ReactNode;
}

/** Render text with "\n" turned into <br> line breaks. */
function withBreaks(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <span key={i}>
      {line}
      {i < lines.length - 1 ? <br /> : null}
    </span>
  ));
}

export function Hero({
  eyebrow,
  number,
  headline,
  subhead,
  meta,
  artifact,
}: HeroProps) {
  const metaText = Array.isArray(meta) ? meta.join("\n") : meta;

  return (
    <section data-reveal-section className={styles.hero}>
      <div className={styles.left}>
        <SectionEyebrow className={styles.eyebrowRow}>{eyebrow}</SectionEyebrow>

        {number?.digits ? <HeroNumber {...number} /> : null}

        <h1 className={styles.headline} data-reveal>
          {withBreaks(headline)}
        </h1>
        <p className={styles.sub} data-reveal>
          {subhead}
        </p>
        <p className={styles.meta} data-reveal>
          {withBreaks(metaText)}
        </p>
      </div>

      <div className={styles.right} data-reveal>
        <div className={styles.artifactWrap}>{artifact}</div>
      </div>
    </section>
  );
}
