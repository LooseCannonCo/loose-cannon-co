import { SectionEyebrow } from "@/components/SectionEyebrow/SectionEyebrow";
import { urlFor } from "@/sanity/image";
import type { GalleryItemData } from "@/sanity/queries/caseStudy";

import styles from "./CaseGallery.module.css";

export interface CaseGalleryProps {
  items: GalleryItemData[];
  /** Section eyebrow text. Defaults to "The work". */
  eyebrow?: string;
  /** Optional title block above the grid. Renders only when `title` is set;
   *  when blank, the section keeps the original eyebrow-only chrome so
   *  image-only galleries (FITAID) look identical to before. */
  title?: string;
  /** Optional intro paragraph rendered in the right column of the title
   *  block, mirroring the StatsTrio title-block lockup. */
  intro?: string;
}

/**
 * Case study gallery. Renders a responsive grid of social posts / asset
 * images. Source images are 1080x1350 (4:5 portrait); cells lock to 4:5 and
 * the <img> renders at intrinsic ratio so nothing gets cropped or stretched.
 * Each frame gets the locked LC.co plum border + offset violet registration
 * bleed, matching CaseImage. When `title` is supplied, a StatsTrio-style
 * title block sits above the grid. Items with no image render a cream
 * placeholder tile with the caption inside, so deliverables-style galleries
 * can publish before assets land.
 */
export function CaseGallery({
  items,
  eyebrow = "The work",
  title,
  intro,
}: CaseGalleryProps) {
  if (!items || items.length === 0) return null;
  const hasTitleBlock = Boolean(title);
  return (
    <section data-reveal-section className={styles.section}>
      {hasTitleBlock ? (
        <div className={styles.titleBlock}>
          <div>
            <SectionEyebrow>{eyebrow}</SectionEyebrow>
            <h3 className={styles.ttl} data-reveal>
              {title}
            </h3>
          </div>
          {intro ? (
            <p className={styles.body} data-reveal>
              {intro}
            </p>
          ) : null}
        </div>
      ) : (
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
      )}
      <div className={styles.grid}>
        {items.map((item, i) => {
          const hasImage = Boolean(
            (item.image as { asset?: unknown } | undefined)?.asset,
          );
          return (
            <figure key={i} className={styles.cell}>
              <div className={styles.frame}>
                {hasImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={urlFor(item.image)
                      .width(720)
                      .height(900)
                      .fit("crop")
                      .quality(70)
                      .auto("format")
                      .url()}
                    alt={item.alt ?? ""}
                    className={styles.img}
                    loading="lazy"
                  />
                ) : (
                  <div
                    className={styles.placeholder}
                    aria-label={item.alt ?? item.caption ?? ""}
                  >
                    <span className={styles.placeholderText}>
                      {item.caption ?? item.alt ?? ""}
                    </span>
                  </div>
                )}
              </div>
              {hasImage && item.caption ? (
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
