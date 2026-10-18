import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackLink } from "@/components/BackLink/BackLink";
import { Footer } from "@/components/Footer/Footer";
import { Nav } from "@/components/Nav/Nav";
import { Page } from "@/components/Page/Page";
import { SectionEyebrow } from "@/components/SectionEyebrow/SectionEyebrow";
import { shopImageUrl } from "@/shopify/format";
import { getProduct, getProductHandles } from "@/shopify/products";

import { ProductForm } from "./ProductForm";
import styles from "./page.module.css";

// Must be a literal for Next to read it; keep in step with SHOP_REVALIDATE.
export const revalidate = 300;

/* Pre-build every product page; a product added later renders on first
 * visit and is cached from then on. */
export async function generateStaticParams() {
  const handles = await getProductHandles();
  return handles.map((handle) => ({ handle }));
}

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getProduct(params.handle);
  if (!product) return { title: "Shop | Loose Cannon Co." };
  return {
    title: `${product.title} | Loose Cannon Co. Shop`,
    description: product.description.slice(0, 160),
    openGraph: product.featuredImage
      ? { images: [shopImageUrl(product.featuredImage.url, 1200)] }
      : undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  const product = await getProduct(params.handle);
  if (!product) notFound();

  const images = product.images.nodes;

  return (
    <Page>
      <Nav />
      <BackLink href="/shop" label="Back to shop" />

      <main className={styles.product} data-reveal-section>
        {/* LEFT: the proofs. Lead image large, the rest in a two-up grid. */}
        <div className={styles.gallery}>
          {images.length === 0 ? (
            <span className={styles.frame} data-reveal>
              <span className={styles.bleed} aria-hidden="true" />
              <span className={styles.shot}>
                <span className={styles.blank} aria-hidden="true" />
              </span>
            </span>
          ) : (
            images.map((img, i) => (
              <span
                key={img.url}
                className={i === 0 ? styles.frameLead : styles.frame}
                data-reveal
              >
                <span className={styles.bleed} aria-hidden="true" />
                <span className={styles.shot}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={shopImageUrl(img.url, i === 0 ? 1400 : 800)}
                    alt={img.altText ?? product.title}
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                </span>
              </span>
            ))
          )}
        </div>

        {/* RIGHT: sticky buy column. */}
        <div className={styles.info}>
          <SectionEyebrow>Merch</SectionEyebrow>
          <h1 className={styles.title} data-reveal>
            {product.title}
          </h1>

          <div data-reveal>
            <ProductForm
              options={product.options}
              variants={product.variants.nodes}
            />
          </div>

          {product.descriptionHtml ? (
            <div
              className={styles.description}
              data-reveal
              // Merchant-authored copy from the Shopify admin.
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          ) : null}
        </div>
      </main>

      <Footer />
    </Page>
  );
}
