import Link from "next/link";

import { CartButton } from "@/components/Cart/CartButton";

import styles from "./Nav.module.css";

/**
 * Public site nav. Wordmark left (also home link), nav links right.
 *
 * The nav no longer carries a "Back to work" link. Case study pages render
 * a standalone contextual back link via the BackLink component, mounted in
 * a slim row directly below the nav.
 *
 * The cart link sits last. It shows on every /shop page, and elsewhere only
 * once the visitor has something in the cart.
 */
const LINKS: { label: string; href: string }[] = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Shop", href: "/shop" },
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
        <CartButton />
      </div>
    </nav>
  );
}
