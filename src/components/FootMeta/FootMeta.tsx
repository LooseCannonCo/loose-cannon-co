import styles from "./FootMeta.module.css";

/** The closing meta line: copyright on the left, location on the right. */
export function FootMeta() {
  return (
    <div className={styles.footMeta}>
      <span>© Loose Cannon Co.</span>
      <span>San Diego&nbsp;&nbsp;//&nbsp;&nbsp;Working everywhere</span>
    </div>
  );
}
