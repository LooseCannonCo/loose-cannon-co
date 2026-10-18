import {
  isShopifyConfigured,
  shopifyApiVersion,
  shopifyDomain,
  shopifyToken,
} from "./env";

export class ShopifyError extends Error {}

/**
 * Minimal Storefront API GraphQL client. Works on the server (product pages,
 * cached via Next's fetch revalidate) and in the browser (cart mutations,
 * never cached).
 *
 * `revalidate` only matters on the server: product pages refresh prices,
 * stock and new products on that interval without a full Netlify rebuild.
 */
export async function storefrontFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: { revalidate?: number | false } = {},
): Promise<T> {
  if (!isShopifyConfigured) {
    throw new ShopifyError("Shopify Storefront API is not configured.");
  }

  const res = await fetch(
    `https://${shopifyDomain}/api/${shopifyApiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": shopifyToken,
      },
      body: JSON.stringify({ query, variables }),
      ...(options.revalidate === undefined
        ? { cache: "no-store" as const }
        : { next: { revalidate: options.revalidate } }),
    },
  );

  if (!res.ok) {
    throw new ShopifyError(`Shopify responded ${res.status}`);
  }

  const json = (await res.json()) as {
    data?: T;
    errors?: { message: string }[];
  };
  if (json.errors?.length) {
    throw new ShopifyError(json.errors.map((e) => e.message).join("; "));
  }
  if (!json.data) {
    throw new ShopifyError("Shopify returned no data.");
  }
  return json.data;
}
