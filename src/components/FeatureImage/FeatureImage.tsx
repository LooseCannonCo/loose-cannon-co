import { urlFor } from "@/sanity/image";
import type { FeatureImageData } from "@/sanity/queries/caseStudy";

import styles from "./FeatureImage.module.css";

export interface FeatureImageProps {
  data?: FeatureImageData;
}

/**
 * Full-bleed cinematic feature beat. Breaks out of the centered 1320px Page
 * container to span the full viewport, ~70vh tall. object-fit: cover honors
 * the Sanity hotspot via object-position so a portrait source can crop to a
 * wide band without losing the subject. Flat treatment (no offset, no shadow)
 * to match the case study chapter headline language. Optional caption sits
 * bottom-left eyebrow-style. Returns null when no image is set.
 */
export function FeatureImage({ data }: FeatureImageProps) {
  const image = data?.image;
  if (!image) return null;

  const hotspot = (image as { hotspot?: { x?: number; y?: number } }).hotspot;
  const objectPosition = `${((hotspot?.x ?? 0.5) * 100).toFixed(2)}% ${(
    (hotspot?.y ?? 0.5) * 100
  ).toFixed(2)}%`;

  const src = urlFor(image).width(1920).quality(70).auto("format").url();

  return (
    <section data-reveal-section className={styles.section}>
      <figure className={styles.frame} data-reveal>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={data?.alt ?? ""}
          className={styles.img}
          style={{ objectPosition }}
          loading="lazy"
        />
        {data?.caption ? (
          <figcaption className={styles.caption}>{data.caption}</figcaption>
        ) : null}
      </figure>
    </section>
  );
}
