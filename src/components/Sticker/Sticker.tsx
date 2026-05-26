"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import { prefersReducedMotion } from "@/lib/motion";
import { spawnShrapnel } from "@/lib/shrapnel";
import { cn } from "@/lib/utils";

import styles from "./Sticker.module.css";

export type StickerVariant = "hero" | "mic" | "corner";

export interface StickerHandle {
  /** Fire the three-stage slam + shrapnel imperatively (e.g. from HeroNumber). */
  slam: () => void;
}

export interface StickerProps {
  /** Sticker label, sentence case (e.g. "Banger!", "Mic drop!"). */
  text: string;
  /** Base rotation in degrees. System range: -14 to +10. Default 0. */
  angle?: number;
  /** Size preset. Default "hero". */
  variant?: StickerVariant;
  /** Start at scale(0) so a programmatic slam() pops it in. Default false. */
  initiallyHidden?: boolean;
  /** Extra class on the wrapper (e.g. for absolute positioning by a parent). */
  className?: string;
  /** Extra inline style on the wrapper (e.g. position offsets). */
  style?: React.CSSProperties;
}

const VARIANT_CLASS: Record<StickerVariant, string> = {
  hero: styles.hero,
  mic: styles.mic,
  corner: styles.corner,
};

// Magnetic-pull tuning, from the skill / reference implementation.
const MAGNETIC_RADIUS = 180;
const MAGNETIC_MAX_PULL = 8;

export const Sticker = forwardRef<StickerHandle, StickerProps>(function Sticker(
  { text, angle = 0, variant = "hero", initiallyHidden = false, className, style },
  ref,
) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const animatingRef = useRef(false);
  const inFieldRef = useRef(false);

  // Slam (three-stage wobble) + halftone shrapnel. Pops in from scale(0) when
  // the sticker started hidden.
  const slam = useCallback(() => {
    if (prefersReducedMotion()) return;
    const pill = pillRef.current;
    const wrap = wrapRef.current;
    if (!pill || !wrap) return;

    animatingRef.current = true;
    pill.style.transition = "transform 400ms cubic-bezier(0.18, 1.8, 0.3, 1)";
    pill.style.transform = `rotate(${angle + 3}deg) scale(1.08)`;
    window.setTimeout(() => {
      if (!pillRef.current) return;
      pill.style.transition = "transform 220ms ease-out";
      pill.style.transform = `rotate(${angle - 3}deg) scale(0.97)`;
      window.setTimeout(() => {
        if (!pillRef.current) return;
        pill.style.transition = "transform 240ms cubic-bezier(0.4, 1.2, 0.4, 1)";
        pill.style.transform = `rotate(${angle}deg) scale(1)`;
        window.setTimeout(() => {
          animatingRef.current = false;
        }, 260);
      }, 220);
    }, 400);

    window.setTimeout(() => {
      if (!pillRef.current || !wrapRef.current) return;
      const sr = pill.getBoundingClientRect();
      const cr = wrap.getBoundingClientRect();
      spawnShrapnel(
        sr.left + sr.width / 2 - cr.left,
        sr.top + sr.height / 2 - cr.top,
        wrap,
      );
    }, 280);
  }, [angle]);

  useImperativeHandle(ref, () => ({ slam }), [slam]);

  // Magnetic pull: within MAGNETIC_RADIUS the pill eases toward the cursor.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const pill = pillRef.current;
    if (!pill) return;

    const onMove = (e: MouseEvent) => {
      if (animatingRef.current) return;
      const r = pill.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const d = Math.sqrt(dx * dx + dy * dy);

      if (d < MAGNETIC_RADIUS) {
        inFieldRef.current = true;
        const s = (MAGNETIC_RADIUS - d) / MAGNETIC_RADIUS;
        const px = (dx / Math.max(d, 1)) * MAGNETIC_MAX_PULL * s;
        const py = (dy / Math.max(d, 1)) * MAGNETIC_MAX_PULL * s;
        const rot = angle + (dx / 140) * 5 * s;
        pill.style.transition = "transform 90ms ease-out";
        pill.style.transform = `translate(${px}px, ${py}px) rotate(${rot}deg) scale(${1 + 0.05 * s})`;
      } else if (inFieldRef.current) {
        inFieldRef.current = false;
        pill.style.transition = "transform 320ms cubic-bezier(0.3, 1.4, 0.4, 1)";
        pill.style.transform = `rotate(${angle}deg) scale(1)`;
      }
    };

    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, [angle]);

  // A hidden sticker under reduced motion can't slam in, so just reveal it.
  useEffect(() => {
    if (initiallyHidden && prefersReducedMotion() && pillRef.current) {
      pillRef.current.style.transform = `rotate(${angle}deg) scale(1)`;
    }
  }, [initiallyHidden, angle]);

  return (
    <span ref={wrapRef} className={cn(styles.wrap, className)} style={style}>
      <span
        ref={pillRef}
        className={cn(styles.pill, VARIANT_CLASS[variant])}
        style={{ transform: `rotate(${angle}deg) scale(${initiallyHidden ? 0 : 1})` }}
        onClick={slam}
      >
        {text}
      </span>
    </span>
  );
});
