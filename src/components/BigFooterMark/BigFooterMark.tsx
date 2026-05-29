import styles from "./BigFooterMark.module.css";

/** The full-width "Loose Cannon." footer statement. Display-xl, opsz 96, upright. */
export function BigFooterMark() {
  return (
    <section data-reveal-section className={styles.bigFoot}>
      <h2 data-reveal className={`${styles.mark} flippy-hide-behind`}>
        Loose Cannon.
      </h2>
    </section>
  );
}
