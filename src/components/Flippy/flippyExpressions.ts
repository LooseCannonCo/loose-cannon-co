/**
 * Flippy's expression system.
 *
 * Each expression names a (mouth, eyes, brows) variant. The inline SVG owns
 * shape data per variant; this file just maps semantic expressions onto those
 * variants, plus the random-cycle pool.
 */

export type FlippyExpression =
  | "grin"
  | "smirk"
  | "wide"
  | "tongue"
  | "gasp"
  | "squint"
  | "manic";

export type MouthVariant =
  | "base"
  | "smirk"
  | "open"
  | "tongue"
  | "o"
  | "tight"
  | "huge";

export type EyeVariant = "base" | "wide" | "half" | "squint";

export type BrowVariant = "base" | "up" | "scrunched" | "manic";

interface ExpressionShape {
  mouth: MouthVariant;
  eyes: EyeVariant;
  brows: BrowVariant;
}

export const EXPRESSIONS: Record<FlippyExpression, ExpressionShape> = {
  grin: { mouth: "base", eyes: "base", brows: "base" },
  smirk: { mouth: "smirk", eyes: "half", brows: "base" },
  wide: { mouth: "open", eyes: "wide", brows: "up" },
  tongue: { mouth: "tongue", eyes: "base", brows: "base" },
  gasp: { mouth: "o", eyes: "base", brows: "up" },
  squint: { mouth: "tight", eyes: "squint", brows: "scrunched" },
  manic: { mouth: "huge", eyes: "wide", brows: "up" },
};

/** Idle-cycle pool. Grin is the resting state and is NOT picked here. */
export const IDLE_EXPRESSION_POOL: FlippyExpression[] = [
  "smirk",
  "wide",
  "tongue",
  "gasp",
  "squint",
  "manic",
];

/**
 * Pick a random expression different from the current one, drawn from the idle
 * pool. Falls back to "smirk" if pool is empty (it isn't, but TS).
 */
export function pickRandomExpression(
  current: FlippyExpression,
): FlippyExpression {
  const choices = IDLE_EXPRESSION_POOL.filter((e) => e !== current);
  if (choices.length === 0) return "smirk";
  return choices[Math.floor(Math.random() * choices.length)];
}
