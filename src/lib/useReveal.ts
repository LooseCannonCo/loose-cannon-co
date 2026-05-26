"use client";

import { useEffect } from "react";

/** Stagger between revealed elements within a section (skill: 60ms). */
const STAGGER_MS = 60;

/**
 * Section reveal system. Mount once at the page level (inside a client
 * component). Observes every `[data-reveal-section]` with an IntersectionObserver
 * (threshold 0.2, rootMargin "0px 0px -10% 0px"); when a section enters, its
 * `[data-reveal]` descendants flip to revealed staggered by 60ms, then the
 * section is unobserved (one-shot).
 *
 * Degrades safely: under reduced motion or without IntersectionObserver every
 * `[data-reveal]` is revealed immediately. Reveal items that live outside any
 * section are also revealed immediately so nothing can get stuck hidden.
 */
export function useReveal(): void {
  useEffect(() => {
    const reveal = (el: Element) => el.setAttribute("data-revealed", "true");

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduce || !("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal]").forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const items =
            entry.target.querySelectorAll<HTMLElement>("[data-reveal]");
          items.forEach((el, i) =>
            window.setTimeout(() => reveal(el), i * STAGGER_MS),
          );
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    document
      .querySelectorAll("[data-reveal-section]")
      .forEach((section) => observer.observe(section));

    // Anything tagged for reveal but not inside a section reveals immediately.
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      if (!el.closest("[data-reveal-section]")) reveal(el);
    });

    return () => observer.disconnect();
  }, []);
}
