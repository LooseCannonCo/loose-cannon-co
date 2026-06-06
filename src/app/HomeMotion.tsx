"use client";

import { useEffect } from "react";

import styles from "./page.module.css";

/**
 * Homepage scroll reveals, mounted once inside the (server) page. Renders
 * nothing. Mirrors the WorkMotion / ServicesMotion reveal pass: every `.rv`
 * (rise + fade) and `.rvf` (fade only, keeps any static crook) flips to
 * [data-in] when it enters the viewport. Selection is by the CSS-module's
 * hashed class names so markup and observer agree without a string contract.
 *
 * Reduced motion (or no IntersectionObserver): every reveal lands at its final
 * state immediately, no observers, no animation.
 */
export function HomeMotion(): null {
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const reveals = Array.from(
      document.querySelectorAll<HTMLElement>(`.${styles.rv}, .${styles.rvf}`),
    );

    if (reduce || !("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.setAttribute("data-in", ""));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.setAttribute("data-in", "");
          io.unobserve(en.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -10% 0px" },
    );
    reveals.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
}
