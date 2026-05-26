/**
 * True when the user has asked the OS to reduce motion. Guards every animated
 * behavior in the LC system (slam, magnetic pull, shrapnel, slot-roll, reveal).
 * Safe to call during SSR — returns false when there is no window.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
