import { defineField, defineType } from "sanity";

/* Shopify documents written by the Sanity Connect app (direct sync).
 *
 * Shopify is the source of truth: Sanity Connect overwrites everything under
 * `store` on every sync, so those fields are read-only here. The Studio only
 * shows what is synced, so editors can see the catalogue next to the rest of
 * the site content. Product titles, prices, sizes and photos are edited in
 * the Shopify admin. Field names follow the Sanity Connect data model. */

const readOnlyString = (name: string, title: string) =>
  defineField({ name, title, type: "string", readOnly: true });

const priceRange = defineField({
  name: "priceRange",
  title: "Price range",
  type: "object",
  readOnly: true,
  fields: [
    defineField({ name: "minVariantPrice", title: "From", type: "number" }),
    defineField({ name: "maxVariantPrice", title: "To", type: "number" }),
  ],
});

export const shopifyProduct = defineType({
  name: "product",
  title: "Product",
  type: "document",
  readOnly: true,
  fields: [
    defineField({
      name: "store",
      title: "Shopify data",
      description: "Synced from Shopify. Edit these in the Shopify admin.",
      type: "object",
      readOnly: true,
      fields: [
        readOnlyString("title", "Title"),
        defineField({
          name: "slug",
          title: "Handle",
          type: "slug",
          readOnly: true,
        }),
        readOnlyString("status", "Status"),
        readOnlyString("vendor", "Vendor"),
        readOnlyString("productType", "Product type"),
        priceRange,
        readOnlyString("previewImageUrl", "Image URL"),
        defineField({
          name: "descriptionHtml",
          title: "Description (HTML)",
          type: "text",
          readOnly: true,
        }),
        defineField({
          name: "isDeleted",
          title: "Deleted in Shopify",
          type: "boolean",
          readOnly: true,
        }),
        readOnlyString("gid", "Shopify ID"),
      ],
    }),
  ],
  preview: {
    select: {
      title: "store.title",
      status: "store.status",
      price: "store.priceRange.minVariantPrice",
      isDeleted: "store.isDeleted",
    },
    prepare({ title, status, price, isDeleted }) {
      const bits = [
        isDeleted ? "Deleted in Shopify" : status,
        typeof price === "number" ? `from $${price.toFixed(2)}` : null,
      ].filter(Boolean);
      return { title: title ?? "Untitled product", subtitle: bits.join(" · ") };
    },
  },
});

export const shopifyProductVariant = defineType({
  name: "productVariant",
  title: "Product variant",
  type: "document",
  readOnly: true,
  fields: [
    defineField({
      name: "store",
      title: "Shopify data",
      description: "Synced from Shopify. Edit these in the Shopify admin.",
      type: "object",
      readOnly: true,
      fields: [
        readOnlyString("title", "Title"),
        readOnlyString("sku", "SKU"),
        defineField({ name: "price", title: "Price", type: "number" }),
        defineField({
          name: "compareAtPrice",
          title: "Compare at price",
          type: "number",
        }),
        readOnlyString("option1", "Option 1"),
        readOnlyString("option2", "Option 2"),
        readOnlyString("option3", "Option 3"),
        readOnlyString("previewImageUrl", "Image URL"),
        readOnlyString("status", "Status"),
        defineField({
          name: "isDeleted",
          title: "Deleted in Shopify",
          type: "boolean",
        }),
        readOnlyString("gid", "Shopify ID"),
        readOnlyString("productGid", "Product Shopify ID"),
      ],
    }),
  ],
  preview: {
    select: { title: "store.title", sku: "store.sku", price: "store.price" },
    prepare({ title, sku, price }) {
      return {
        title: title ?? "Untitled variant",
        subtitle: [sku, typeof price === "number" ? `$${price.toFixed(2)}` : null]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
});

export const shopifyCollection = defineType({
  name: "collection",
  title: "Collection",
  type: "document",
  readOnly: true,
  fields: [
    defineField({
      name: "store",
      title: "Shopify data",
      description: "Synced from Shopify. Edit these in the Shopify admin.",
      type: "object",
      readOnly: true,
      fields: [
        readOnlyString("title", "Title"),
        defineField({
          name: "slug",
          title: "Handle",
          type: "slug",
          readOnly: true,
        }),
        defineField({
          name: "descriptionHtml",
          title: "Description (HTML)",
          type: "text",
          readOnly: true,
        }),
        readOnlyString("imageUrl", "Image URL"),
        defineField({
          name: "isDeleted",
          title: "Deleted in Shopify",
          type: "boolean",
        }),
        readOnlyString("gid", "Shopify ID"),
      ],
    }),
  ],
  preview: {
    select: { title: "store.title", handle: "store.slug.current" },
    prepare({ title, handle }) {
      return { title: title ?? "Untitled collection", subtitle: handle };
    },
  },
});

/** Synced types. Never created, duplicated or deleted from the Studio. */
export const SHOPIFY_TYPES = new Set(["product", "productVariant", "collection"]);
