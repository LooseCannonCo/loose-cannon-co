import { FrameVideo } from "@/components/CaseImage/FrameVideo";
import { SectionEyebrow } from "@/components/SectionEyebrow/SectionEyebrow";

import styles from "./ThreeUpVideo.module.css";

export interface VideoTile {
  label?: string;
  platform?: string;
  /** Aspect like "4x5", "1x1", "9x16". */
  aspect?: string;
  /** Resolved Sanity file URL. When absent, the placeholder is shown. */
  fileUrl?: string;
  mimeType?: string;
}

export interface ThreeUpVideoProps {
  videos: VideoTile[];
  footLeft?: string;
  footRight?: string;
  /** Section eyebrow text. Defaults to "The work". */
  eyebrow?: string;
}

/** Content section variant: a gallery of Meta ad videos. Renders each item's
 *  uploaded Sanity video (autoplay/muted/loop/playsinline via FrameVideo, with
 *  a reduced-motion paused state). The "Video placeholder" tag shows only as a
 *  true fallback when an item has no file. The row adapts to the count: one or
 *  two videos render centered, three render as the full three-up. */
export function ThreeUpVideo({
  videos,
  footLeft,
  footRight,
  // Default is "The ads" because the only current consumer (Smolotov) pairs
  // this video block with a product-stills gallery beneath it; both used to
  // default to "The work" and stacked identical eyebrows. Cases that want a
  // different label can override via the `eyebrow` prop.
  eyebrow = "The ads",
}: ThreeUpVideoProps) {
  return (
    <section data-reveal-section className={styles.section}>
      <SectionEyebrow>{eyebrow}</SectionEyebrow>
      <div
        className={styles.gallery}
        data-count={Math.min(Math.max(videos.length, 1), 3)}
      >
        {videos.map((v, i) => (
          <figure key={i} data-reveal className={styles.item}>
            <div
              className={styles.ad}
              style={{ aspectRatio: (v.aspect ?? "4x5").replace("x", " / ") }}
            >
              {v.fileUrl ? (
                <FrameVideo
                  src={v.fileUrl}
                  type={v.mimeType}
                  className={styles.video}
                />
              ) : (
                <span className={styles.placeholder}>Video placeholder</span>
              )}
            </div>
            {v.platform || v.label ? (
              <figcaption className={styles.caption}>
                {v.platform ? (
                  <span className={styles.platform}>{v.platform}</span>
                ) : null}
                {v.label ? <span className={styles.name}>{v.label}</span> : null}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
      {footLeft || footRight ? (
        <div className={styles.foot} data-reveal>
          <span>{footLeft}</span>
          <span>{footRight}</span>
        </div>
      ) : null}
    </section>
  );
}
