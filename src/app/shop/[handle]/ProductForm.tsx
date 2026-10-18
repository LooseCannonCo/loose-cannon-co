"use client";

import { useMemo, useState } from "react";

import { useCart } from "@/components/Cart/CartProvider";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/shopify/format";
import type { ProductOption, ProductVariant } from "@/shopify/types";

import styles from "./ProductForm.module.css";

export interface ProductFormProps {
  options: ProductOption[];
  variants: ProductVariant[];
}

/**
 * Option pickers (size, color...), live price, add to cart. Starts on the
 * first variant that is in stock. Option values with no buyable variant for
 * the current selection are shown struck through but stay clickable, so the
 * visitor can still see the full range.
 */
export function ProductForm({ options, variants }: ProductFormProps) {
  const { enabled, addItem, busy, error } = useCart();

  const initial = variants.find((v) => v.availableForSale) ?? variants[0];
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      (initial?.selectedOptions ?? []).map((o) => [o.name, o.value]),
    ),
  );

  const variant = useMemo(
    () =>
      variants.find((v) =>
        v.selectedOptions.every((o) => selected[o.name] === o.value),
      ) ?? null,
    [variants, selected],
  );

  // Shopify gives single-variant products one "Title: Default Title" option.
  const pickers = options.filter(
    (o) => !(o.optionValues.length === 1 && o.optionValues[0].name === "Default Title"),
  );

  const isBuyable = (name: string, value: string) => {
    const next = { ...selected, [name]: value };
    return variants.some(
      (v) =>
        v.availableForSale &&
        v.selectedOptions.every((o) => next[o.name] === o.value),
    );
  };

  const canAdd = enabled && !!variant && variant.availableForSale && !busy;

  return (
    <div className={styles.form}>
      <p className={styles.price}>
        {variant ? formatMoney(variant.price) : "Pick an option"}
        {variant?.compareAtPrice &&
        Number(variant.compareAtPrice.amount) > Number(variant.price.amount) ? (
          <s className={styles.compare}>{formatMoney(variant.compareAtPrice)}</s>
        ) : null}
      </p>

      {pickers.map((option) => (
        <fieldset key={option.name} className={styles.option}>
          <legend className={styles.legend}>
            {option.name}
            <span className={styles.legendValue}>{selected[option.name]}</span>
          </legend>
          <div className={styles.values}>
            {option.optionValues.map(({ name: value }) => {
              const active = selected[option.name] === value;
              return (
                <button
                  key={value}
                  type="button"
                  className={cn(
                    styles.value,
                    active && styles.active,
                    !isBuyable(option.name, value) && styles.unavailable,
                  )}
                  aria-pressed={active}
                  onClick={() =>
                    setSelected((s) => ({ ...s, [option.name]: value }))
                  }
                >
                  {value}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <button
        type="button"
        className={styles.add}
        disabled={!canAdd}
        onClick={() => variant && addItem(variant.id)}
        data-flippy-react="cta"
      >
        <span>
          {!enabled
            ? "Shop opening soon"
            : !variant || !variant.availableForSale
              ? "Sold out"
              : busy
                ? "Adding..."
                : "Add to cart"}
        </span>
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      </button>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
