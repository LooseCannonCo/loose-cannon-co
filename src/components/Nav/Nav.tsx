import Link from "next/link";

import styles from "./Nav.module.css";

export interface NavProps {
  /**
   * Destination for the "← Back to work" link. Omit on the homepage. The link
   * renders as a small eyebrow-scale label to the left of the wordmark.
   */
  backHref?: string;
}

/**
 * Public site nav. Wordmark left (also home link), nav links right.
 *
 * Shop is intentionally commented out until /shop ships in Phase F.
 * Restore the { label: "Shop", href: "/shop" } entry below when the route
 * exists, and add a matching column treatment in any footer audit.
 */
const LINKS: { label: string; href: string }[] = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  // { label: "Shop", href: "/shop" }, // re-enable when /shop ships
  { label: "Contact", href: "/contact" },
];

export function Nav({ backHref }: NavProps) {
  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>
        {backHref ? (
          <Link href={backHref} className={styles.back}>
            ← Back to work
          </Link>
        ) : null}
        <Link href="/" className={styles.wordmark}>
          Loose Cannon Co.
        </Link>
      </div>
      <div className={styles.right}>
        {LINKS.map((link) => (
          <Link key={link.label} href={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
