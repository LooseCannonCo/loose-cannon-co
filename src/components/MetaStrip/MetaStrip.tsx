import styles from "./MetaStrip.module.css";

export interface MetaStripProps {
  client: string;
  discipline: string;
  year: string;
  /** Optional right-side tag, e.g. "Featured". Only renders the right column
   *  when present. The case-number label was removed; caseNumber stays in
   *  the schema for sort order but no longer surfaces in the UI. */
  tag?: string;
}

/** Section 2: the client / discipline / year strip, with an optional tag
 *  on the right. */
export function MetaStrip({ client, discipline, year, tag }: MetaStripProps) {
  return (
    <div className={styles.metaStrip}>
      <div className={styles.grp}>
        <Col label="Client" value={client} />
        <Col label="Discipline" value={discipline} />
        <Col label="Year" value={year} />
      </div>
      {tag ? (
        <div className={`${styles.col} ${styles.right}`}>
          <span className={styles.val}>{tag}</span>
        </div>
      ) : null}
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
