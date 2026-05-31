import { SectionEyebrow } from "@/components/SectionEyebrow/SectionEyebrow";

import styles from "./StatsTrio.module.css";
import { TrioNumber, type TrioNumberProps } from "./TrioNumber";

export interface TrioCell {
  /** The chart visual (RingFill, BarComparison, etc). */
  chart: React.ReactNode;
  number: TrioNumberProps;
  caption: string;
  source: string;
}

export interface StatsTrioProps {
  eyebrow: string;
  title: string;
  body: string;
  /** Exactly three cells, visually distinct from one another. */
  cells: TrioCell[];
}

/** Section 7: "The receipts." A title block above three data-honest chart cells. */
export function StatsTrio({ eyebrow, title, body, cells }: StatsTrioProps) {
  return (
    <section data-reveal-section className={styles.section}>
      <div className={styles.titleBlock}>
        <div>
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h3 className={styles.ttl} data-reveal>
            {title}
          </h3>
        </div>
        <p className={styles.body} data-reveal>
          {body}
        </p>
      </div>

      <div className={styles.trio}>
        {cells.map((cell, i) => (
          <div key={i} className={styles.cell}>
            <div className={styles.vis}>{cell.chart}</div>
            <TrioNumber {...cell.number} />
            <p className={styles.cap} data-reveal>
              {cell.caption}
            </p>
            <p className={styles.src} data-reveal>
              {cell.source}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
