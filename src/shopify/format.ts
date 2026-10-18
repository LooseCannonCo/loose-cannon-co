import type { Money } from "./types";

/** "$28.95". Whole-dollar prices drop the cents: "$18". */
export function formatMoney({ amount, currencyCode }: Money): string {
  const value = Number(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Ask Shopify's CDN for a resized image (keeps the original aspect). */
export function shopImageUrl(url: string, width: number): string {
  const u = new URL(url);
  u.searchParams.set("width", String(width));
  return u.toString();
}

/** Grid price: "$25.50" or "From $25.50" when variants differ. */
export function formatPriceRange(range: {
  minVariantPrice: Money;
  maxVariantPrice: Money;
}): string {
  const min = formatMoney(range.minVariantPrice);
  return range.minVariantPrice.amount === range.maxVariantPrice.amount
    ? min
    : `From ${min}`;
}
