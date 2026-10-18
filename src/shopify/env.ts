/**
 * Shopify Storefront API settings.
 *
 * Set these in Netlify (Site configuration > Environment variables) and in
 * .env.local for local dev:
 *
 *   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN       loose-cannon-creative.myshopify.com
 *   NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN   public token from the Headless channel
 *   NEXT_PUBLIC_SHOPIFY_API_VERSION        optional, defaults below
 *
 * The storefront token is a PUBLIC token by design (Shopify issues it for
 * browser use), which is why it carries the NEXT_PUBLIC_ prefix: the cart
 * talks to Shopify straight from the visitor's browser.
 *
 * Unlike the Sanity env, missing values do NOT throw. The shop renders a
 * "doors open soon" state instead, so the rest of the site keeps building
 * before the token exists.
 */
export const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "";

export const shopifyToken =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ?? "";

/* Shopify ships a new API version every quarter and supports each for about
 * a year. Bump this (or set the env var) roughly once a year. */
export const shopifyApiVersion =
  process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || "2026-10";

export const isShopifyConfigured = Boolean(shopifyDomain && shopifyToken);
