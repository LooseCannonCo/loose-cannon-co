"use client";

import { useEffect, useMemo, useRef } from "react";

import { Sticker, type StickerHandle } from "@/components/Sticker/Sticker";
import { prefersReducedMotion } from "@/lib/motion";
import { slotRoll } from "@/lib/slotRoll";

import styles from "./HeroNumber.module.css";

export interface HeroNumberProps {
  /** Rendered small (60px) before the digits, e.g. "+" or "$". */
  prefix?: string;
  /** The number, e.g. "2,400" or "100,000". Commas stay static; digits roll. */
  digits: string;
  /** Rendered small (60px) after the digits, e.g. "%" or "K". */
  suffix?: string;
  /** Sticker tucked into the bottom-right of the last digit; slams in last. */
  sticker?: { text: string; angle: number };
}

export function HeroNumber({ prefix, digits, suffix, sticker }: HeroNumberProps) {
  const chars = useMemo(
    () => digits.split("").map((ch) => ({ ch, isDigit: /[0-9]/.test(ch) })),
    [digits],
  );

  const wrapRef = useRef<HTMLSpanElement>(null);
  const digitRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const prefixRef = useRef<HTMLSpanElement>(null);
  const suffixRef = useRef<HTMLSpanElement>(null);
  const stickerRef = useRef<StickerHandle>(null);
  const visibleRef = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const targets: { el: HTMLSpanElement; value: string }[] = [];
    chars.forEach((c, i) => {
      const el = digitRefs.current[i];
      if (c.isDigit && el) targets.push({ el, value: c.ch });
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
        t.el.textContent = "0";
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
        {chars.map((c, i) => (
          <span
            key={i}
            ref={(el) => {
              digitRefs.current[i] = el;
            }}
          >
            {c.isDigit ? "0" : c.ch}
          </span>
        ))}
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
