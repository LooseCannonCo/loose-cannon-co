import { Button } from "@/components/Button/Button";
import { FinePrintStat } from "@/components/FinePrintStat/FinePrintStat";
import { PrintHeadline } from "@/components/PrintHeadline/PrintHeadline";

import styles from "./ClosingCTA.module.css";

export interface ClosingCTAProps {
  /** Top of the headline. May include <br /> for forced line breaks. */
  headlineTop: React.ReactNode;
  /** Short last line. */
  headlineLast: React.ReactNode;
  ctaText?: string;
  ctaHref?: string;
}

/**
 * Shared closing CTA used by /, /services, and /about. The 3-column grid
 * mirrors the host page's 3-col grid on each page so the Fine Print dry-stat
 * lockup aligns to the "03" column above it. Headline renders flat plum
 * (no registration bleed) to match every other headline on the site.
 */
export function ClosingCTA({
  headlineTop,
  headlineLast,
  ctaText = "Start a project",
  ctaHref = "/contact",
}: ClosingCTAProps) {
  return (
    <section className={styles.closing}>
      <div className={styles.inner}>
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
              </span>
            </div>
            <Button href={ctaHref} variant="onDark">
              {ctaText}
            </Button>
          </div>
          <FinePrintStat />
        </div>
      </div>
    </section>
  );
}
