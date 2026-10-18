import { storefrontFetch } from "./client";
import { isShopifyConfigured } from "./env";
import {
  PRODUCT_HANDLES_QUERY,
  PRODUCT_QUERY,
  PRODUCTS_QUERY,
} from "./queries";
import type { Product, ProductCard } from "./types";

/* Product pages are static, then refresh from Shopify every 5 minutes, so a
 * price change, new product or sell-out shows up without a Netlify rebuild.
 * The cart itself is always live. (The route files repeat 300 as a literal
 * because Next only reads literal segment config.) */
export const SHOP_REVALIDATE = 300;

/* A Shopify outage or a bad token must never take down a Netlify build of
 * the whole site. Failures log and fall back to an empty shop; the next
 * revalidation picks the products back up. */
async function safely<T>(label: string, fallback: T, fn: () => Promise<T>) {
  if (!isShopifyConfigured) return fallback;
  try {
    return await fn();
  } catch (err) {
    console.error(`[shop] ${label} failed:`, err);
    return fallback;
  }
}

export function getProducts(): Promise<ProductCard[]> {
  return safely("product list", [], async () => {
    const data = await storefrontFetch<{ products: { nodes: ProductCard[] } }>(
      PRODUCTS_QUERY,
      {},
      { revalidate: SHOP_REVALIDATE },
    );
    return data.products.nodes;
  });
}

export function getProductHandles(): Promise<string[]> {
  return safely("product handles", [], async () => {
    const data = await storefrontFetch<{
      products: { nodes: { handle: string }[] };
    }>(PRODUCT_HANDLES_QUERY, {}, { revalidate: SHOP_REVALIDATE });
    return data.products.nodes.map((p) => p.handle);
  });
}

export function getProduct(handle: string): Promise<Product | null> {
  return safely(`product ${handle}`, null, async () => {
    const data = await storefrontFetch<{ product: Product | null }>(
      PRODUCT_QUERY,
      { handle },
      { revalidate: SHOP_REVALIDATE },
    );
    return data.product;
  });
}
