"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { formatMoney, shopImageUrl } from "@/shopify/format";

import { useCart } from "./CartProvider";
import styles from "./CartDrawer.module.css";

/**
 * Slide-in cart. Plum ink panel on the cream stock, same hard offset block
 * as every other framed artifact. Checkout hands off to Shopify's hosted
 * checkout via the cart's checkoutUrl.
 */
export function CartDrawer() {
  const { enabled, cart, isOpen, close, busy, error, updateLine, removeLine } =
    useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape closes; focus moves into the panel when it opens.
  useEffect(() => {
    if (!isOpen) return;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  if (!enabled) return null;

  const lines = cart?.lines.nodes ?? [];

  return (
    <div
      className={styles.root}
      data-open={isOpen ? "true" : "false"}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        className={styles.scrim}
        onClick={close}
        aria-label="Close cart"
        tabIndex={isOpen ? 0 : -1}
      />
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
        tabIndex={-1}
      >
        <div className={styles.head}>
          <p className={styles.eyebrow}>
            <span className={styles.dot} aria-hidden="true" />
            Your cart
          </p>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={close}
            tabIndex={isOpen ? 0 : -1}
          >
            Close
          </button>
        </div>

        {lines.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Empty. For now.</p>
            <Link
              href="/shop"
              className={styles.textLink}
              onClick={close}
              tabIndex={isOpen ? 0 : -1}
            >
              Go fill it up →
            </Link>
          </div>
        ) : (
          <>
            <ul className={styles.lines} aria-busy={busy}>
              {lines.map((line) => {
                const m = line.merchandise;
                const variantLabel = m.selectedOptions
                  .filter((o) => o.value !== "Default Title")
                  .map((o) => o.value)
                  .join(" / ");
                return (
                  <li key={line.id} className={styles.line}>
                    <span className={styles.thumb}>
                      {m.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={shopImageUrl(m.image.url, 160)}
                          alt={m.image.altText ?? m.product.title}
                        />
                      ) : null}
                    </span>
                    <div className={styles.lineBody}>
                      <Link
                        href={`/shop/${m.product.handle}`}
                        className={styles.lineTitle}
                        onClick={close}
                        tabIndex={isOpen ? 0 : -1}
                      >
                        {m.product.title}
                      </Link>
                      {variantLabel ? (
                        <p className={styles.variant}>{variantLabel}</p>
                      ) : null}
                      <div className={styles.qtyRow}>
                        <div className={styles.qty}>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              line.quantity > 1
                                ? updateLine(line.id, line.quantity - 1)
                                : removeLine(line.id)
                            }
                            aria-label={`One less ${m.product.title}`}
                            tabIndex={isOpen ? 0 : -1}
                          >
                            −
                          </button>
                          <span className={styles.qtyNum}>{line.quantity}</span>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              updateLine(line.id, line.quantity + 1)
                            }
                            aria-label={`One more ${m.product.title}`}
                            tabIndex={isOpen ? 0 : -1}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className={styles.remove}
                          disabled={busy}
                          onClick={() => removeLine(line.id)}
                          tabIndex={isOpen ? 0 : -1}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className={styles.linePrice}>
                      {formatMoney(line.cost.totalAmount)}
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className={styles.foot}>
              {error ? <p className={styles.error}>{error}</p> : null}
              <div className={styles.subtotal}>
                <span>Subtotal</span>
                <span className={styles.subtotalNum}>
                  {cart ? formatMoney(cart.cost.subtotalAmount) : ""}
                </span>
              </div>
              <p className={styles.note}>
                Shipping and taxes get worked out at checkout.
              </p>
              <a
                href={cart?.checkoutUrl}
                className={styles.checkout}
                aria-disabled={busy}
                tabIndex={isOpen ? 0 : -1}
                data-flippy-react="cta"
              >
                <span>Check out</span>
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
