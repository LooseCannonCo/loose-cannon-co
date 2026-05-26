/** Plum halftone chases the base + violet layers by this delay (skill: 220ms). */
export const PLUM_CHASE_MS = 220;

export interface PrintLayers {
  /** Solid pink-1 fill underneath. */
  base?: SVGElement | null;
  /** Violet registration bleed (offset, ~60% opacity). */
  violet?: SVGElement | null;
  /** Plum halftone on top. */
  plum?: SVGElement | null;
}

/**
 * Drive the core print-registration choreography on a breakout element: the
 * base and violet layers settle together, the plum halftone chases them by
 * `chase` ms (recreating the two-pass press effect). `settle` applies the final
 * transition + value to a layer (a dashoffset for rings, a scaleY for bars, etc),
 * so this stays geometry-agnostic.
 *
 * Returns timer ids for the caller to clear on cleanup.
 */
export function printRegister(
  layers: PrintLayers,
  settle: (el: SVGElement) => void,
  chase: number = PLUM_CHASE_MS,
): number[] {
  const { base, violet, plum } = layers;
  if (base) settle(base);
  if (violet) settle(violet);

  const timers: number[] = [];
  if (plum) {
    const el = plum;
    timers.push(window.setTimeout(() => settle(el), chase));
  }
  return timers;
}
