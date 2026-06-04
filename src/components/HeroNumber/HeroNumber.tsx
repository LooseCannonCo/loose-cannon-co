"use client";

import { useEffect, useMemo, useRef } from "react";

import { Sticker, type StickerHandle } from "@/components/Sticker/Sticker";
import { prefersReducedMotion } from "@/lib/motion";
import { slotRoll, splitStatChars } from "@/lib/slotRoll";

import styles from "./HeroNumber.module.css";

export interface HeroNumberProps {
  /** Rendered small (60px) before the value, e.g. "+" or "$". */
  prefix?: string;
  /**
   * The value. Any string of letters, digits, spaces, and punctuation:
   * "2,400", "100,000", or a phrase like "a shit ton". Digits and letters
   * roll; commas/dots/punctuation stay static; spaces are preserved gaps.
   */
  digits: string;
  /** Rendered small (60px) after the value, e.g. "%" or "K". */
  suffix?: string;
  /** Sticker tucked into the bottom-right of the last slot; slams in last. */
  sticker?: { text: string; angle: number };
}

export function HeroNumber({ prefix, digits, suffix, sticker }: HeroNumberProps) {
  const chars = useMemo(() => splitStatChars(digits), [digits]);

  const wrapRef = useRef<HTMLSpanElement>(null);
  const digitRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const prefixRef = useRef<HTMLSpanElement>(null);
  const suffixRef = useRef<HTMLSpanElement>(null);
  const stickerRef = useRef<StickerHandle>(null);
  const visibleRef = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // Digits AND letters roll, in source order, so the stagger sweeps the whole
    // value left to right. Spaces and punctuation are not targets.
    const targets: { el: HTMLSpanElement; value: string; rollChars: string }[] =
      [];
    chars.forEach((c, i) => {
      const el = digitRefs.current[i];
      if ((c.kind === "digit" || c.kind === "letter") && el && c.rollChars) {
        targets.push({ el, value: c.ch, rollChars: c.rollChars });
      }
    });

    // Reduced motion: show the final number immediately, no roll, no pops.
    if (prefersReducedMotion()) {
      targets.forEach((t) => {
        t.el.textContent = t.value;
      });
      [prefixRef.current, suffixRef.current].forEach((el) => {
        if (el) {
          el.style.opacity = "1";
          el.style.transform = "scale(1)";
        }
      });
      return;
    }

    // Timing scales with digit count: 3 or fewer digits compress the sequence;
    // 4-6 digits use the full FITAID timing.
    const n = targets.length;
    const compress = n <= 3;
    const startTime = compress ? 300 : 440;
    const perDigitDelay = compress ? 120 : 180;
    const lastStop = startTime + Math.max(0, n - 1) * perDigitDelay;
    const prefixAt = Math.max(0, startTime - 140);
    const suffixAt = lastStop + 340;
    const stickerAt = suffixAt + 180;

    const timers: number[] = [];
    const after = (ms: number, fn: () => void) =>
      timers.push(window.setTimeout(fn, ms));

    const popIn = (el: HTMLElement) => {
      el.style.transition =
        "opacity 280ms ease-out, transform 320ms cubic-bezier(0.2, 1.6, 0.3, 1)";
      el.style.opacity = "1";
      el.style.transform = "scale(1)";
    };

    const roll = (start: number, per: number) => {
      slotRoll(targets, { startTime: start, perDigitDelay: per }).forEach((id) =>
        timers.push(id),
      );
    };

    const runIntro = () => {
      targets.forEach((t) => {
        t.el.textContent = t.rollChars[0];
      });
      if (prefixRef.current) after(prefixAt, () => popIn(prefixRef.current!));
      roll(startTime, perDigitDelay);
      if (suffixRef.current) after(suffixAt, () => popIn(suffixRef.current!));
      after(stickerAt, () => stickerRef.current?.slam());
    };

    // Periodic re-roll keeps the number "alive". Skips while offscreen.
    const scheduleReRoll = () => {
      const delay = 8000 + Math.random() * 4000; // 8-12s
      after(delay, () => {
        if (visibleRef.current && !prefersReducedMotion()) roll(0, 70);
        scheduleReRoll();
      });
    };

    const clearAll = () =>
      timers.forEach((id) => {
        window.clearTimeout(id);
        window.clearInterval(id);
      });

    if (!("IntersectionObserver" in window)) {
      runIntro();
      scheduleReRoll();
      return clearAll;
    }

    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          visibleRef.current = e.isIntersecting;
          if (e.isIntersecting && !started) {
            started = true;
            runIntro();
            scheduleReRoll();
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(wrap);

    return () => {
      io.disconnect();
      clearAll();
    };
  }, [chars]);

  return (
    <span ref={wrapRef} className={styles.number}>
      {prefix ? (
        <span ref={prefixRef} className={styles.affix}>
          {prefix}
        </span>
      ) : null}
      <span className={styles.digits}>
        {chars.map((c, i) => {
          // Letter: a width-reserving ghost (the final glyph) with an absolutely
          // positioned roller on top, so the rolling glyphs never shift their
          // neighbors and the slot lands exactly on the final letter.
          if (c.kind === "letter") {
            return (
              <span key={i} className={styles.slot}>
                <span className={styles.ghost} aria-hidden="true">
                  {c.ch}
                </span>
                <span
                  className={styles.roller}
                  ref={(el) => {
                    digitRefs.current[i] = el;
                  }}
                >
                  {c.ch}
                </span>
              </span>
            );
          }
          // Space: a preserved gap (white-space: pre), never rolls.
          if (c.kind === "space") {
            return (
              <span key={i} className={styles.space}>
                {" "}
              </span>
            );
          }
          // Digit: unchanged — placeholder "0" that rolls through 0-9.
          if (c.kind === "digit") {
            return (
              <span
                key={i}
                ref={(el) => {
                  digitRefs.current[i] = el;
                }}
              >
                0
              </span>
            );
          }
          // Punctuation (commas, dots, etc.): static.
          return <span key={i}>{c.ch}</span>;
        })}
      </span>
      {suffix ? (
        <span ref={suffixRef} className={styles.affix}>
          {suffix}
        </span>
      ) : null}
      {sticker ? (
        <Sticker
          ref={stickerRef}
          text={sticker.text}
          angle={sticker.angle}
          variant="hero"
          initiallyHidden
          className={styles.heroSticker}
        />
      ) : null}
    </span>
  );
}
