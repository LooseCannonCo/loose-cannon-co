import styles from "./UpNext.module.css";

export interface UpNextProps {
  /** Next case name, e.g. "Smolotov.". */
  title: string;
  /** Link to the next case. */
  href: string;
  /** e.g. "Case 002 · Performance Creative". */
  caseLabel: string;
  /** Short descriptor on the right of the meta row. */
  descriptor: string;
  psText?: string;
  psHref?: string;
}

/** Section 10: the "Up next" pointer with the arrow that slides on hover, plus
 *  the P.S. line tucked top-right. */
export function UpNext({
  title,
  href,
  caseLabel,
  descriptor,
  psText = "P.S. want this for your brand? Start a project →",
  psHref = "/contact",
}: UpNextProps) {
  return (
    <section data-reveal-section className={styles.wrap}>
      <a href={href} className={styles.upnext}>
        <div className={styles.lbl} data-reveal>
          Up next
        </div>
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
      </a>
      <a href={psHref} className={styles.ps} data-reveal>
        {psText}
      </a>
    </section>
  );
}
