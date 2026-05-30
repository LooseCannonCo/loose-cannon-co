import { urlFor } from "@/sanity/image";
import type { GalleryItemData } from "@/sanity/queries/caseStudy";

import styles from "./CaseGallery.module.css";

export interface CaseGalleryProps {
  items: GalleryItemData[];
}

/**
 * Case study gallery. Renders a responsive grid of social posts / asset
 * images. Source images are 1080x1350 (4:5 portrait); cells lock to 4:5 and
 * the <img> renders at intrinsic ratio so nothing gets cropped or stretched.
 * Each frame gets the locked LC.co plum border + offset violet registration
 * bleed, matching CaseImage.
 */
export function CaseGallery({ items }: CaseGalleryProps) {
  if (!items || items.length === 0) return null;
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {items.map((item, i) => {
          const src = urlFor(item.image).width(720).auto("format").url();
          return (
            <figure key={i} className={styles.cell}>
              <div className={styles.frame}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={item.alt ?? ""}
                  className={styles.img}
                  loading="lazy"
                />
              </div>
              {item.caption ? (
                <figcaption className={styles.caption}>
                  {item.caption}
                </figcaption>
              ) : null}
            </figure>
          );
        })}
      </div>
    </section>
  );
}
