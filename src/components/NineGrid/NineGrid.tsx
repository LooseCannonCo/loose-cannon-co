import { cn } from "@/lib/utils";

import styles from "./NineGrid.module.css";

export type TileKind = "image" | "editorial" | "review" | "placeholder";
export type TileTone = "pink" | "dark" | "cream";

export interface NineTile {
  /** Short description of what the final tile will hold. */
  label: string;
  kind?: TileKind;
  tone?: TileTone;
}

export interface NineGridProps {
  tiles: NineTile[];
  footLeft?: string;
  footRight?: string;
}

const KIND_LABEL: Record<TileKind, string> = {
  image: "Image placeholder",
  editorial: "Editorial",
  review: "Review",
  placeholder: "Placeholder",
};

/**
 * Section 5: the 9-tile editorial gallery. Tiles render as labeled placeholders
 * until production assets land. Staggered reveal is handled by the reveal system.
 */
export function NineGrid({ tiles, footLeft, footRight }: NineGridProps) {
  return (
    <section data-reveal-section className={styles.section}>
      <div className={styles.nine}>
        {tiles.map((tile, i) => (
          <div
            key={i}
            data-reveal
            className={cn(styles.tile, tile.tone && styles[tile.tone])}
          >
            <div className={styles.tileLabel}>{tile.label}</div>
            <div className={styles.tileKind}>{KIND_LABEL[tile.kind ?? "image"]}</div>
          </div>
        ))}
      </div>
      {footLeft || footRight ? (
        <div className={styles.nineFoot} data-reveal>
          <span>{footLeft}</span>
          <span>{footRight}</span>
        </div>
      ) : null}
    </section>
  );
}
