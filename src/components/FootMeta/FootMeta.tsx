import styles from "./FootMeta.module.css";

/** The closing meta line: copyright on the left, location on the right. */
export function FootMeta() {
  return (
    <div className={styles.footMeta}>
      <span>© Loose Cannon Co.</span>
      <span>Working everywhere</span>
    </div>
  );
}
