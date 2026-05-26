"use client";

import { useEffect, useMemo, useRef } from "react";

import { prefersReducedMotion } from "@/lib/motion";
import { slotRoll } from "@/lib/slotRoll";

import styles from "./StatsTrio.module.css";

export interface TrioNumberProps {
  prefix?: string;
  /** e.g. "218" or "3.4". Commas/dots stay static; digits roll. */
  digits: string;
  /** Superscript unit, e.g. "%" or "×". */
  unit?: string;
}

/** The big number in a stats-trio cell. Slot-rolls on entering the viewport. */
export function TrioNumber({ prefix, digits, unit }: TrioNumberProps) {
  const chars = useMemo(
    () => digits.split("").map((ch) => ({ ch, isDigit: /[0-9]/.test(ch) })),
    [digits],
  );

  const wrapRef = useRef<HTMLSpanElement>(null);
  const digitRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const targets: { el: HTMLElement; value: string }[] = [];
    chars.forEach((c, i) => {
      const el = digitRefs.current[i];
      if (c.isDigit && el) targets.push({ el, value: c.ch });
    });

    if (prefersReducedMotion()) {
      targets.forEach((t) => {
        t.el.textContent = t.value;
      });
      return;
    }

    const timers: number[] = [];
    const run = () => {
      targets.forEach((t) => {
        t.el.textContent = "0";
      });
      slotRoll(targets, { startTime: 400, perDigitDelay: 150 }).forEach((id) =>
        timers.push(id),
      );
    };

    if (!("IntersectionObserver" in window)) {
      run();
      return () => timers.forEach((id) => window.clearTimeout(id));
    }

    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            run();
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(wrap);

    return () => {
      io.disconnect();
      timers.forEach((id) => {
        window.clearTimeout(id);
        window.clearInterval(id);
      });
    };
  }, [chars]);

  return (
    <div className={styles.num}>
      <span ref={wrapRef} className={styles.numInner}>
        {prefix ? <span>{prefix}</span> : null}
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
      {unit ? <sup>{unit}</sup> : null}
    </div>
  );
}
