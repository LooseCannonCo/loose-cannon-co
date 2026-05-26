"use client";

import { useEffect, useRef } from "react";

import { Sticker, type StickerHandle } from "@/components/Sticker/Sticker";

import styles from "./QuoteBlock.module.css";

export interface QuoteBlockProps {
  quote: string;
  attribution: string;
  role: string;
  stickerText?: string;
  stickerAngle?: number;
}

/** Section 8: the pull quote with the "Mic drop!" sticker slamming in on view. */
export function QuoteBlock({
  quote,
  attribution,
  role,
  stickerText = "Mic drop!",
  stickerAngle = 8,
}: QuoteBlockProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickerRef = useRef<StickerHandle>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      stickerRef.current?.slam();
      return;
    }

    let fired = false;
    let timer = 0;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !fired) {
            fired = true;
            timer = window.setTimeout(() => stickerRef.current?.slam(), 300);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <section ref={sectionRef} data-reveal-section className={styles.quoteBlock}>
      <div className={styles.row}>
        <span className={styles.markBig} data-reveal aria-hidden="true">
          {"“"}
        </span>
        <div>
          <p className={styles.text} data-reveal>
            {quote}
          </p>
          <p className={styles.attr} data-reveal>
            {attribution}
            <br />
            <span className={styles.role}>{role}</span>
          </p>
        </div>
      </div>
      <Sticker
        ref={stickerRef}
        text={stickerText}
        angle={stickerAngle}
        variant="mic"
        initiallyHidden
        className={styles.micDrop}
      />
    </section>
  );
}
