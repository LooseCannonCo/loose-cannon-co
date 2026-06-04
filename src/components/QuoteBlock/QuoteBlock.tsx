import styles from "./QuoteBlock.module.css";

export interface QuoteBlockProps {
  quote: string;
  attribution: string;
  role: string;
}

/** Section 9: the pull quote. Sticker-free per the one-sticker-per-case
 *  strategy (the sole sticker per case study lives on the hero stat number). */
export function QuoteBlock({ quote, attribution, role }: QuoteBlockProps) {
  return (
    <section data-reveal-section className={styles.quoteBlock}>
      <div className={styles.inner}>
        <div className={styles.row}>
          <span className={styles.markBig} data-reveal aria-hidden="true">
            {"“"}
          </span>
          <div>
            <p className={styles.text} data-reveal>
              {quote}
            </p>
            <p className={styles.attr} data-reveal>
              {attribution}
              <br />
              <span className={styles.role}>{role}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
