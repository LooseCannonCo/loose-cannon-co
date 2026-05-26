import styles from "./BigFooterMark.module.css";

/** The full-width "Loose Cannon." footer statement — display-xl, opsz 96, upright. */
export function BigFooterMark() {
  return (
    <section data-reveal-section className={styles.bigFoot}>
      <h2 data-reveal className={styles.mark}>
        Loose Cannon.
      </h2>
    </section>
  );
}
