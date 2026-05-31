import { SectionEyebrow } from "@/components/SectionEyebrow/SectionEyebrow";

import styles from "./Credits.module.css";

export interface CreditItem {
  /** Discipline label, e.g. "Creative Direction + Design". */
  label: string;
  /** Person or team credited. */
  name: string;
}

/** Section 9: the 4-column credits grid, discipline label above each name. */
export function Credits({ credits }: { credits: CreditItem[] }) {
  return (
    <section data-reveal-section className={styles.credits}>
      <SectionEyebrow>Credits</SectionEyebrow>
      <div className={styles.grid}>
        {credits.map((c, i) => (
          <div key={i} className={styles.col} data-reveal>
            <div className={styles.lbl}>{c.label}</div>
            <div className={styles.val}>{c.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
