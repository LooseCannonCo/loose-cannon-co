"use client";

import { useEffect } from "react";

import styles from "./page.module.css";

/**
 * The /services zine choreography, ported from the reference's single <script>.
 * Mount once inside the page. Renders nothing.
 *
 * Three scroll/load interactions, all gated by prefers-reduced-motion:
 *   1. Hero register on load — pure CSS (@keyframes register on .heroH1), so
 *      it is not handled here; the reduced-motion guard lives in the module.
 *   2. Proof count-up — .big starts as "27" with data-final; animates to
 *      6,350,000 over ~1600ms easeOutCubic when ~60% visible, landing on
 *      "6.35M".
 *   3. Step stamp-in — .stack flips to [data-go] when ~25% visible; the module
 *      stamps each .line in one at a time via animation-delay.
 * Plus the generic reveals: .rv (rise + fade) and .rvf (fade only, keeps
 * rotation) flip to [data-in] when they enter the viewport.
 *
 * Selection is by the CSS-module's hashed class names (imported here so the
 * markup and the observer agree without a brittle string contract); state is
 * a [data-in] / [data-go] attribute the module keys its revealed rules off.
 */
export function ServicesMotion(): null {
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const reveals = Array.from(
      document.querySelectorAll<HTMLElement>(
        `.${styles.rv}, .${styles.rvf}`,
      ),
    );
    const stacks = Array.from(
      document.querySelectorAll<HTMLElement>(`.${styles.stack}`),
    );
    const bigs = Array.from(
      document.querySelectorAll<HTMLElement>(`.${styles.big}[data-final]`),
    );

    const fmt = (v: number) =>
      v >= 1e6 ? (v / 1e6).toFixed(2) + "M" : Math.round(v).toLocaleString();

    const countUp = (el: HTMLElement) => {
      const end = parseFloat(el.getAttribute("data-final") ?? "0");
      const start = 27;
      const dur = 1600;
      let t0: number | null = null;
      const step = (ts: number) => {
        if (t0 === null) t0 = ts;
        const p = Math.min((ts - t0) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(start + (end - start) * e);
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = "6.35M";
        }
      };
      requestAnimationFrame(step);
    };

    // Reduced motion: land every element at its final, static state. No
    // observers, no animation.
    if (reduce) {
      reveals.forEach((el) => el.setAttribute("data-in", ""));
      stacks.forEach((s) => s.setAttribute("data-go", ""));
      bigs.forEach((b) => {
        b.textContent = "6.35M";
      });
      return;
    }

    const revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.setAttribute("data-in", "");
          revealIO.unobserve(en.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -10% 0px" },
    );
    reveals.forEach((el) => revealIO.observe(el));

    const stackIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.setAttribute("data-go", "");
          stackIO.unobserve(en.target);
        });
      },
      { threshold: 0.25 },
    );
    stacks.forEach((s) => stackIO.observe(s));

    const countIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          countUp(en.target as HTMLElement);
          countIO.unobserve(en.target);
        });
      },
      { threshold: 0.6 },
    );
    bigs.forEach((b) => countIO.observe(b));

    return () => {
      revealIO.disconnect();
      stackIO.disconnect();
      countIO.disconnect();
    };
  }, []);

  return null;
}
