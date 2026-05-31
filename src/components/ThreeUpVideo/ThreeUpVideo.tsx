import { SectionEyebrow } from "@/components/SectionEyebrow/SectionEyebrow";

import styles from "./ThreeUpVideo.module.css";

export interface VideoTile {
  label?: string;
  platform?: string;
  /** Aspect like "4x5", "1x1", "9x16". */
  aspect?: string;
}

export interface ThreeUpVideoProps {
  videos: VideoTile[];
  footLeft?: string;
  footRight?: string;
  /** Section eyebrow text. Defaults to "The work". */
  eyebrow?: string;
}

/** Content section variant: a 3-up gallery of Meta ad videos. Renders labeled
 *  placeholders until video files are uploaded in Studio. */
export function ThreeUpVideo({
  videos,
  footLeft,
  footRight,
  eyebrow = "The work",
}: ThreeUpVideoProps) {
  return (
    <section data-reveal-section className={styles.section}>
      <SectionEyebrow>{eyebrow}</SectionEyebrow>
      <div className={styles.gallery}>
        {videos.map((v, i) => (
          <div
            key={i}
            data-reveal
            className={styles.ad}
            style={{ aspectRatio: (v.aspect ?? "4x5").replace("x", " / ") }}
          >
            <div className={styles.overlay}>
              {v.platform ? <span className={styles.platform}>{v.platform}</span> : null}
              {v.label ? <span className={styles.name}>{v.label}</span> : null}
            </div>
            <span className={styles.placeholder}>Video placeholder</span>
          </div>
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
