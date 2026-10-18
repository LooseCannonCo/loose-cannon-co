# Shop (/shop)

The shop pulls products live from Shopify (store: `loose-cannon-creative.myshopify.com`)
through the Shopify Storefront API. Cart lives in Shopify; checkout is Shopify's own
hosted checkout, so card details never touch this site.

## One-time setup

1. **Shopify: get a Storefront API token**
   - Shopify admin → Sales channels → add **Headless** (free, from the Shopify App Store).
   - In Headless, **Create storefront**, then open **Storefront API** and copy the
     **public access token**.
   - Products only appear on the site if they are **published to the Headless channel**
     (Products → select all → More actions → Include in sales channels → Headless).

2. **Netlify: add environment variables**
   Site configuration → Environment variables:

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | `loose-cannon-creative.myshopify.com` |
   | `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` | the public token from step 1 |
   | `NEXT_PUBLIC_SHOPIFY_API_VERSION` | optional, defaults to `2026-10` |

   Then trigger a redeploy. Add the same keys to `.env.local` for local dev.

Until both values are set, /shop shows a "Doors open soon" state and the rest of the
site builds and runs normally.

## How it behaves

- `/shop` lists every product published to the Headless channel, newest first.
- `/shop/<handle>` has the photos, size/color pickers, price and Add to cart.
- Product pages are cached and refresh from Shopify every 5 minutes
  (`SHOP_REVALIDATE` in `src/shopify/products.ts`), so price changes, new products
  and sell-outs show up without a rebuild. The cart is always live.
- The nav shows a Cart link on every /shop page, and on other pages only once
  something is in the cart. The cart id is remembered in the browser, so a
  returning visitor finds their cart.

## Sanity Studio

Sanity Connect syncs products, variants and collections into the dataset. They show
read-only under **Shop (synced from Shopify)** in the Studio. Edit products in the
Shopify admin, not in Sanity.

## Files

- `src/shopify/` Storefront API client, queries, types, formatting
- `src/components/Cart/` cart state (`CartProvider`), drawer, nav button
- `src/app/shop/` the shop index and product pages
- `src/sanity/schemas/shopify.ts` read-only Studio types for the synced docs
