import Link from "next/link";

import styles from "./FooterCols.module.css";

/**
 * Footer columns: studio tagline + secondary nav + contact + socials.
 *
 * Shop column intentionally omitted until /shop ships in Phase F. To restore,
 * add a column with { label: "Shop" } and link entries to /shop, /shop/new.
 *
 * Journal link held until the route exists. No TikTok (no account); only the
 * three live socials below.
 */

const SOCIALS: { label: string; href: string }[] = [
  { label: "Instagram", href: "https://www.instagram.com/loose_cannon_co/" },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61589750844482",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/loose-cannon-co",
  },
];

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
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
