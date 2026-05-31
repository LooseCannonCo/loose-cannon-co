import { HeroNumber, type HeroNumberProps } from "@/components/HeroNumber/HeroNumber";
import { SectionEyebrow } from "@/components/SectionEyebrow/SectionEyebrow";
import { Splatter } from "@/components/Splatter/Splatter";
import { Sticker } from "@/components/Sticker/Sticker";
import { cn } from "@/lib/utils";

import styles from "./Hero.module.css";

type ArtifactStickerPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left";

export interface HeroProps {
  eyebrow: string;
  number: HeroNumberProps;
  /** Supports "\n" for forced line breaks. */
  headline: string;
  subhead: string;
  meta: string | string[];
  artifact: React.ReactNode;
  artifactSticker?: {
    text: string;
    angle: number;
    position: ArtifactStickerPosition;
  };
}

/** Render text with "\n" turned into <br> line breaks. */
function withBreaks(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <span key={i}>
      {line}
      {i < lines.length - 1 ? <br /> : null}
    </span>
  ));
}

export function Hero({
  eyebrow,
  number,
  headline,
  subhead,
  meta,
  artifact,
  artifactSticker,
}: HeroProps) {
  const metaText = Array.isArray(meta) ? meta.join("\n") : meta;

  return (
    <section data-reveal-section className={styles.hero}>
      <Splatter count={4} excludeCenter />

      <div className={styles.left}>
        <SectionEyebrow className={styles.eyebrowRow}>{eyebrow}</SectionEyebrow>

        <HeroNumber {...number} />

        <h1 className={styles.headline} data-reveal>
          {withBreaks(headline)}
        </h1>
        <p className={styles.sub} data-reveal>
          {subhead}
        </p>
        <p className={styles.meta} data-reveal>
          {withBreaks(metaText)}
        </p>
      </div>

      <div className={styles.right} data-reveal>
        <div className={styles.artifactWrap}>
          {artifact}
          {artifactSticker ? (
            <Sticker
              text={artifactSticker.text}
              angle={artifactSticker.angle}
              variant="corner"
              className={cn(
                styles.artifactSticker,
                styles[artifactSticker.position],
              )}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
