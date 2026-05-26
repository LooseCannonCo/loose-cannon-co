export interface SlotRollTarget {
  el: HTMLElement;
  /** Final character this digit settles on. */
  value: string;
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

/**
 * Slot-roll a set of digit elements: each flips through random 0-9 at `interval`
 * ms, then settles to its final value (sequentially, staggered by perDigitDelay)
 * with a scale-pop. Shared by HeroNumber and the stats-trio numbers.
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
    const stopAt = startTime + i * perDigitDelay;
    const iv = window.setInterval(() => {
      t.el.textContent = String(Math.floor(Math.random() * 10));
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
