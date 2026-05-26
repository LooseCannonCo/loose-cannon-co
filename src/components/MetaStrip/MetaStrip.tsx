import styles from "./MetaStrip.module.css";

export interface MetaStripProps {
  client: string;
  discipline: string;
  year: string;
  /** e.g. "Case 001". */
  caseLabel: string;
  /** e.g. "Featured". */
  tag?: string;
}

/** Section 2: the client / discipline / year strip, with the case number and
 *  an optional tag on the right. */
export function MetaStrip({
  client,
  discipline,
  year,
  caseLabel,
  tag,
}: MetaStripProps) {
  return (
    <div className={styles.metaStrip}>
      <div className={styles.grp}>
        <Col label="Client" value={client} />
        <Col label="Discipline" value={discipline} />
        <Col label="Year" value={year} />
      </div>
      <div className={`${styles.col} ${styles.right}`}>
        <span className={styles.lbl}>{caseLabel}</span>
        {tag ? <span className={styles.val}>{tag}</span> : null}
      </div>
    </div>
  );
}

function Col({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.col}>
      <span className={styles.lbl}>{label}</span>
      <span className={styles.val}>{value}</span>
    </div>
  );
}
