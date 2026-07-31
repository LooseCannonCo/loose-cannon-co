import Link from "next/link";

import styles from "./Nav.module.css";

/**
 * Public site nav. Wordmark left (also home link), nav links right.
 *
 * The nav no longer carries a "Back to work" link. Case study pages render
 * a standalone contextual back link via the BackLink component, mounted in
 * a slim row directly below the nav.
 *
 * Shop is intentionally commented out until /shop ships in Phase F. Restore
 * the { label: "Shop", href: "/shop" } entry below when the route exists.
 */
const LINKS: { label: string; href: string }[] = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  // { label: "Shop", href: "/shop" }, // re-enable when /shop ships
  { label: "Contact", href: "/contact" },
];

export function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>
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
