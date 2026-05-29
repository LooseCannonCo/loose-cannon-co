/**
 * Per-route one-liner sets for Flippy. Picked at random; consumer dedupes
 * back-to-back repeats per (route, trigger) array.
 */

export type FlippyTrigger = "land" | "idle" | "cta" | "work";

export type FlippyRouteLines = Partial<Record<FlippyTrigger, string[]>>;

export const flippyLines: Record<string, FlippyRouteLines> = {
  "/": {
    land: ["welcome.", "hello.", "oh hey."],
    idle: ["still here?", "you good?", "take your time."],
    cta: ["go on then.", "do it."],
    work: ["this one was good."],
  },
  "/work": {
    land: ["these are the ones that worked.", "the receipts."],
    idle: ["scroll, scroll."],
    work: ["look at this one.", "this one paid off."],
  },
  "/services": {
    land: ["this is what we do.", "three things."],
    idle: ["you know what to do."],
    cta: ["get the ads going."],
  },
  "/about": {
    land: ["the people.", "hi."],
    idle: ["just us."],
  },
  "/contact": {
    land: ["tell us what you got.", "go ahead."],
    idle: ["take your time."],
    cta: ["send it."],
  },
};
