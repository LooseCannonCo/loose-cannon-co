import Link from "next/link";

import styles from "./FooterCols.module.css";

/**
 * Footer columns: studio tagline + secondary nav + contact link.
 *
 * Shop column intentionally omitted until /shop ships in Phase F. To restore,
 * add a third column with { label: "Shop" } and link entries to /shop, /shop/new.
 *
 * Journal link and the IG / TikTok / LinkedIn social links are also held until
 * the routes and real URLs exist. Don't re-add as dead text.
 */
export function FooterCols() {
  return (
    <div className={`${styles.footCols} flippy-hide-behind`}>
      <div className={styles.col}>
        <div className={styles.lbl}>Studio</div>
        <p className={styles.tagline}>
          Social-first creative for brands tired of looking like everyone else.
          Working everywhere.
        </p>
      </div>
      <div className={styles.col}>
        <div className={styles.lbl}>Studio</div>
        <ul>
          <li>
            <Link href="/work">Work</Link>
          </li>
          <li>
            <Link href="/services">Services</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
        </ul>
      </div>
      <div className={styles.col}>
        <div className={styles.lbl}>Contact</div>
        <ul>
          <li>
            <Link href="/contact">Start a project</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
