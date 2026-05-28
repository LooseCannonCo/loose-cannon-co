import { Button } from "@/components/Button/Button";
import { FinePrintStat } from "@/components/FinePrintStat/FinePrintStat";
import { PrintHeadline } from "@/components/PrintHeadline/PrintHeadline";
import { Splatter } from "@/components/Splatter/Splatter";
import { Sticker } from "@/components/Sticker/Sticker";

import styles from "./ClosingCTA.module.css";

export interface ClosingCTAProps {
  /** Top of the headline. May include <br /> for forced line breaks. */
  headlineTop: React.ReactNode;
  /** Short last line; the sticker tucks into its right edge. */
  headlineLast: React.ReactNode;
  /** The single in-bounds sticker for this page's closing. */
  sticker: { text: string; angle: number };
  ctaText?: string;
  ctaHref?: string;
  /** Splatter seed so each page scatters slightly differently. */
  splatterSeed?: number;
}

/**
 * Shared closing CTA used by / and /services. The 3-column grid mirrors the
 * services/how-it-works 3-col grid on each page so the Fine Print dry-stat
 * lockup aligns to the "03" column above it.
 */
export function ClosingCTA({
  headlineTop,
  headlineLast,
  sticker,
  ctaText = "Start a project",
  ctaHref = "/contact",
  splatterSeed = 3,
}: ClosingCTAProps) {
  return (
    <section className={styles.closing}>
      <Splatter count={5} seed={splatterSeed} excludeCenter />
      <div className={styles.closingContent}>
        <div className={styles.closingLeft}>
          <div className={styles.closingHeadlineWrap}>
            <PrintHeadline as="h2" className={styles.closingHeadline}>
              {headlineTop}
            </PrintHeadline>
            <span className={styles.closingLastLine}>
              <PrintHeadline as="span" className={styles.closingHeadline}>
                {headlineLast}
              </PrintHeadline>
              <Sticker
                text={sticker.text}
                angle={sticker.angle}
                variant="hero"
                className={styles.closingSticker}
              />
            </span>
          </div>
          <Button href={ctaHref}>{ctaText}</Button>
        </div>
        <FinePrintStat />
      </div>
    </section>
  );
}
