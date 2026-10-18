"use client";

import { usePathname } from "next/navigation";

import { useCart } from "./CartProvider";
import styles from "./CartButton.module.css";

/**
 * Nav cart link. Always shown inside /shop; elsewhere it only appears once
 * something is in the cart, so the studio pages stay a studio first.
 */
export function CartButton() {
  const { enabled, count, open } = useCart();
  const pathname = usePathname();
  const inShop = pathname?.startsWith("/shop") ?? false;

  if (!enabled || (!inShop && count === 0)) return null;

  return (
    <button
      type="button"
      className={styles.button}
      onClick={open}
      aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
    >
      Cart
      <span className={styles.count}>{count}</span>
    </button>
  );
}
