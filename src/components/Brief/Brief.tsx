import { cn } from "@/lib/utils";

import styles from "./Brief.module.css";

export interface BriefBreakdownItem {
  title: string;
  sub?: string;
  body: string;
  /** Punchy stat line, used by the three-step variant. */
  stat?: string;
}

export interface BriefProps {
  eyebrow: string;
  /** Each string becomes its own block line in the headline. */
  headlineLines: string[];
  /** Body paragraphs (pass JSX to include <u>/<strong> emphasis). */
  body: React.ReactNode[];
  /** Optional breakdown rendered below the body. */
  breakdown?: BriefBreakdownItem[];
  breakdownVariant?: "cols" | "steps";
}

/** Section 4: the brief, decoded. Eyebrow + multi-line headline on the left,
 *  body on the right, with an optional 3-col or 3-step breakdown below. */
export function Brief({
  eyebrow,
  headlineLines,
  body,
  breakdown,
  breakdownVariant = "cols",
}: BriefProps) {
  return (
    <section data-reveal-section className={styles.section}>
      <div className={styles.brief}>
        <div>
          <div className={styles.label} data-reveal>
            {eyebrow}
          </div>
          <h3 className={styles.ttl} data-reveal>
            {headlineLines.map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </h3>
        </div>
        <div className={styles.right}>
          {body.map((p, i) => (
            <p key={i} data-reveal>
              {p}
            </p>
          ))}
        </div>
      </div>

      {breakdown ? (
        <div
          className={cn(
            styles.threeCol,
            breakdownVariant === "steps" && styles.steps,
          )}
        >
          {breakdown.map((item, i) => (
            <div key={i} data-reveal>
              {breakdownVariant === "steps" ? (
                <div className={styles.stepNum}>
                  {String(i + 1).padStart(2, "0")}
                </div>
              ) : null}
              <h4 className={styles.colTtl}>{item.title}</h4>
              {item.sub ? <div className={styles.colSub}>{item.sub}</div> : null}
              <p className={styles.colBody}>{item.body}</p>
              {item.stat ? <p className={styles.colStat}>{item.stat}</p> : null}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
