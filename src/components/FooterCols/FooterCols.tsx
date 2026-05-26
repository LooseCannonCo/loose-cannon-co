import styles from "./FooterCols.module.css";

/** 4-column footer: studio tagline + studio links + shop links + contact links.
 *  Placeholder copy for now (ported from the reference case studies). */
export function FooterCols() {
  return (
    <div className={styles.footCols}>
      <div className={styles.col}>
        <div className={styles.lbl}>Studio</div>
        <p className={styles.tagline}>
          Social-first creative for brands tired of looking like everyone else.
          San Diego, working everywhere.
        </p>
      </div>
      <div className={styles.col}>
        <div className={styles.lbl}>Studio</div>
        <ul>
          <li>Work</li>
          <li>Services</li>
          <li>About</li>
          <li>Journal</li>
        </ul>
      </div>
      <div className={styles.col}>
        <div className={styles.lbl}>Shop</div>
        <ul>
          <li>All products</li>
          <li>New</li>
        </ul>
      </div>
      <div className={styles.col}>
        <div className={styles.lbl}>Contact</div>
        <ul>
          <li>Start a project</li>
          <li>Instagram</li>
          <li>TikTok</li>
          <li>LinkedIn</li>
        </ul>
      </div>
    </div>
  );
}
