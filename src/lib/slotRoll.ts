export interface SlotRollTarget {
  el: HTMLElement;
  /** Final character this slot settles on. */
  value: string;
  /**
   * Glyphs to flip through while rolling. Defaults to the digits 0-9 so
   * existing numeric callers behave exactly as before. Letter slots pass a
   * case-matched alphabet, so letters roll through letters and digits through
   * digits.
   */
  rollChars?: string;
}

export interface SlotRollOptions {
  /** Delay before the first digit settles (ms). Default 0. */
  startTime?: number;
  /** Stagger between each digit settling (ms). Default 0. */
  perDigitDelay?: number;
  /** Interval between random flips while rolling (ms). Default 45. */
  interval?: number;
  /** Scale-pop applied on settle. Default 1.22. */
  popScale?: number;
  /** How long the pop holds before easing back to 1 (ms). Default 120. */
  popMs?: number;
}

const DIGITS = "0123456789";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export type StatCharKind = "digit" | "letter" | "space" | "other";

export interface StatChar {
  ch: string;
  kind: StatCharKind;
  /** Pool to roll through; present for digit + letter only. */
  rollChars?: string;
}

/**
 * Classify a stat value into per-character descriptors for the slot-roll.
 * Digits and ASCII letters roll (letters case-matched); spaces are gaps that
 * never roll; everything else (commas, dots, punctuation) is static. Shared by
 * HeroNumber and the stats-trio number so both treat words identically.
 */
export function splitStatChars(value: string): StatChar[] {
  return value.split("").map((ch) => {
    if (DIGITS.includes(ch)) return { ch, kind: "digit", rollChars: DIGITS };
    if (LOWER.includes(ch)) return { ch, kind: "letter", rollChars: LOWER };
    if (UPPER.includes(ch)) return { ch, kind: "letter", rollChars: UPPER };
    if (ch === " ") return { ch, kind: "space" };
    return { ch, kind: "other" };
  });
}

/**
 * Slot-roll a set of slot elements: each flips through random glyphs from its
 * pool (digits by default) at `interval` ms, then settles to its final value
 * (sequentially, staggered by perDigitDelay) with a scale-pop. Shared by
 * HeroNumber and the stats-trio numbers.
 *
 * Caller is responsible for reduced-motion (set finals directly instead of
 * calling this) and for clearing the returned timer ids on cleanup.
 */
export function slotRoll(
  targets: SlotRollTarget[],
  opts: SlotRollOptions = {},
): number[] {
  const {
    startTime = 0,
    perDigitDelay = 0,
    interval = 45,
    popScale = 1.22,
    popMs = 120,
  } = opts;

  const timers: number[] = [];

  targets.forEach((t, i) => {
    const pool = t.rollChars && t.rollChars.length > 0 ? t.rollChars : DIGITS;
    const stopAt = startTime + i * perDigitDelay;
    const iv = window.setInterval(() => {
      t.el.textContent = pool[Math.floor(Math.random() * pool.length)];
    }, interval);
    timers.push(iv);

    const stop = window.setTimeout(() => {
      window.clearInterval(iv);
      t.el.textContent = t.value;
      t.el.style.transform = `scale(${popScale})`;
      const reset = window.setTimeout(() => {
        t.el.style.transform = "scale(1)";
      }, popMs);
      timers.push(reset);
    }, stopAt);
    timers.push(stop);
  });

  return timers;
}
