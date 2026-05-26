import styles from "./Splatter.module.css";

export interface SplatterProps {
  /** Number of escaped-ink dots. Default 4 (skill: 3-4 per hero). */
  count?: number;
  /** Deterministic PRNG seed — keeps SSR and client output identical. */
  seed?: number;
  /** Keep dots out of the central 40% of the container (off the big number). */
  excludeCenter?: boolean;
}

/** mulberry32 — small, fast, deterministic PRNG. */
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n: number) => Math.round(n * 1000) / 1000;
const inCenter = (v: number) => v > 30 && v < 70;

/**
 * Permanent halftone splatter (escaped ink). Renders an absolutely-positioned
 * inline SVG of scattered plum/violet dots inside its (position: relative)
 * parent. Sizes 6-18px, opacity 0.42-0.62, colors ~50/50 plum/violet — all from
 * a seeded PRNG so server and client render byte-identical markup.
 */
export function Splatter({ count = 4, seed = 1, excludeCenter = false }: SplatterProps) {
  const rng = makeRng(seed);

  const dots = Array.from({ length: count }, () => {
    let x = rng() * 100;
    let y = rng() * 100;

    // Push dots off the center 40% by relocating one axis to a margin band.
    if (excludeCenter && inCenter(x) && inCenter(y)) {
      if (rng() < 0.5) {
        x = rng() < 0.5 ? rng() * 30 : 70 + rng() * 30;
      } else {
        y = rng() < 0.5 ? rng() * 30 : 70 + rng() * 30;
      }
    }

    const size = 6 + rng() * 12; // diameter 6-18px
    const isViolet = rng() < 0.5; // ~50/50 plum/violet
    const opacity = 0.42 + rng() * 0.2; // 0.42-0.62

    return {
      x: round(x),
      y: round(y),
      r: round(size / 2),
      color: isViolet ? "var(--lc-violet)" : "var(--lc-plum)",
      opacity: round(opacity),
    };
  });

  return (
    <svg
      className={styles.splatter}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={`${d.x}%`}
          cy={`${d.y}%`}
          r={d.r}
          fill={d.color}
          fillOpacity={d.opacity}
        />
      ))}
    </svg>
  );
}
