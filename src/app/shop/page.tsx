import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/Footer/Footer";
import { Nav } from "@/components/Nav/Nav";
import { Page } from "@/components/Page/Page";
import { isShopifyConfigured } from "@/shopify/env";
import { formatPriceRange, shopImageUrl } from "@/shopify/format";
import { getProducts } from "@/shopify/products";

import styles from "./page.module.css";

// Must be a literal for Next to read it; keep in step with SHOP_REVALIDATE.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Shop | Loose Cannon Co.",
  description:
    "Loose Cannon Co. merch. Tees, hats, socks and other things that talk back.",
};

export default async function ShopIndex() {
  const products = await getProducts();

  return (
    <Page>
      <Nav />

      {/* MASTHEAD: same compact strip as the blog index so the first row of
          product proofs sits above the fold. */}
      <header className={styles.masthead} data-reveal-section>
        <p className={styles.eyebrow} data-reveal>
          Shop // merch
        </p>
        <div className={styles.mastheadRow}>
          <h1 className={styles.headline} data-reveal>
            Merch.
          </h1>
          <p className={styles.tagline} data-reveal>
            Stuff we would actually wear. Now you can too. Checkout is handled
            by Shopify, so your card details never touch us.
          </p>
        </div>
      </header>

      <main className={styles.sheet} data-reveal-section>
        {products.length === 0 ? (
          <div className={styles.empty} data-reveal>
            <p className={styles.emptyTitle}>
              {isShopifyConfigured ? "Sold clean out." : "Doors open soon."}
            </p>
            <p className={styles.emptyBody}>
              {isShopifyConfigured
                ? "New stuff is on the press. Check back soon."
                : "The shop is being stocked. Check back soon."}
            </p>
          </div>
        ) : (
          <ul className={styles.grid}>
            {products.map((p) => (
              <li key={p.id} className={styles.card} data-reveal>
                <Link href={`/shop/${p.handle}`} className={styles.cardLink}>
                  <span className={styles.frame}>
                    <span className={styles.bleed} aria-hidden="true" />
                    <span className={styles.cover}>
                      {p.featuredImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={shopImageUrl(p.featuredImage.url, 800)}
                          alt={p.featuredImage.altText ?? p.title}
                          loading="lazy"
                        />
                      ) : (
                        <span className={styles.blank} aria-hidden="true" />
                      )}
                      {!p.availableForSale ? (
                        <span className={styles.soldOut}>Sold out</span>
                      ) : null}
                    </span>
                  </span>
                  <div className={styles.row}>
                    <h2 className={styles.title}>{p.title}</h2>
                    <span className={styles.price}>
                      {formatPriceRange(p.priceRange)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <Footer />
    </Page>
  );
}
