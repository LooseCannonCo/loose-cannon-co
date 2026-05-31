"use client";

import { useEffect, useRef, useState } from "react";

import { SectionEyebrow } from "@/components/SectionEyebrow/SectionEyebrow";
import { urlFor } from "@/sanity/image";
import type { GalleryItemData } from "@/sanity/queries/caseStudy";

import styles from "./CaseGalleryDrag.module.css";

export interface CaseGalleryDragProps {
  items: GalleryItemData[];
  /** Section eyebrow text. Defaults to "The work" for case study content. */
  eyebrow?: string;
}

const pad2 = (n: number) => n.toString().padStart(2, "0");

/**
 * Horizontal drag gallery for large image collections (FITAID pattern, 6+
 * items). 4:5 portrait tiles in a scroll-snap row, sized so roughly 2.5 are
 * visible across the 1320px container with a peek at the right edge as the
 * drag affordance. Live "NN / NN" counter updates as the active tile changes.
 *
 * Interaction: native horizontal scroll handles trackpad + touch swipe + most
 * mouse wheels. Pointer events on top of that handle mouse drag explicitly so
 * users on a non-touch / non-trackpad pointer still get the drag affordance.
 *
 * Accessibility: scroller is a focusable region with an aria-label, each tile
 * is tabbable with an aria-label, arrow keys jump to the next/previous tile,
 * focus ring uses pink-3. prefers-reduced-motion drops smooth scroll behavior
 * and the scroll-into-view animation.
 */
export function CaseGalleryDrag({
  items,
  eyebrow = "The work",
}: CaseGalleryDragProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragRef = useRef<{
    x: number;
    scrollLeft: number;
    pointerId: number;
    moved: boolean;
  } | null>(null);
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Track reduced-motion preference.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Track active tile based on which tile center is closest to the scroller's
  // viewport center. Runs on every scroll event (passive listener).
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const sRect = scroller.getBoundingClientRect();
      const center = sRect.left + sRect.width / 2;
      let closest = 0;
      let minDist = Infinity;
      tileRefs.current.forEach((tile, i) => {
        if (!tile) return;
        const tRect = tile.getBoundingClientRect();
        const tCenter = tRect.left + tRect.width / 2;
        const dist = Math.abs(tCenter - center);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      setActive(closest);
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [items.length]);

  // Mouse drag via pointer events. Touch falls through to native momentum
  // scroll because that feels better than synthesized pointer drag on touch.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    dragRef.current = {
      x: e.clientX,
      scrollLeft: scroller.scrollLeft,
      pointerId: e.pointerId,
      moved: false,
    };
    scroller.setPointerCapture(e.pointerId);
    scroller.classList.add(styles.grabbing);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 3) d.moved = true;
    if (scrollerRef.current) scrollerRef.current.scrollLeft = d.scrollLeft - dx;
  };

  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    scrollerRef.current?.releasePointerCapture(e.pointerId);
    scrollerRef.current?.classList.remove(styles.grabbing);
    dragRef.current = null;
  };

  // Keyboard navigation. Arrow keys jump the focused tile to the next or
  // previous one. Home and End jump to the first / last.
  const scrollToTile = (i: number) => {
    const idx = Math.max(0, Math.min(items.length - 1, i));
    const tile = tileRefs.current[idx];
    if (!tile) return;
    tile.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      inline: "start",
      block: "nearest",
    });
    tile.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        scrollToTile(active + 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        scrollToTile(active - 1);
        break;
      case "Home":
        e.preventDefault();
        scrollToTile(0);
        break;
      case "End":
        e.preventDefault();
        scrollToTile(items.length - 1);
        break;
    }
  };

  return (
    <section data-reveal-section className={styles.section}>
      <SectionEyebrow>{eyebrow}</SectionEyebrow>
      <div className={styles.head}>
        <span className={styles.cue}>
          <span aria-hidden="true">{"←→"}</span> Drag
        </span>
        <span
          className={styles.counter}
          aria-live="polite"
          aria-atomic="true"
        >
          {pad2(active + 1)} <span aria-hidden="true">/</span> {pad2(items.length)}
        </span>
      </div>
      <div
        ref={scrollerRef}
        className={styles.scroller}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="region"
        aria-label={`Image gallery, ${items.length} items`}
      >
        {items.map((item, i) => {
          const src = urlFor(item.image).width(960).auto("format").url();
          return (
            <div
              key={i}
              ref={(el) => {
                tileRefs.current[i] = el;
              }}
              className={styles.tile}
              tabIndex={0}
              role="group"
              aria-roledescription="slide"
              aria-label={item.alt ?? `Image ${i + 1} of ${items.length}`}
            >
              <div className={styles.frame}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={item.alt ?? ""}
                  className={styles.img}
                  loading="lazy"
                  draggable={false}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
