"use client";

import { useEffect, useMemo, useRef } from "react";

import { prefersReducedMotion } from "@/lib/motion";
import { slotRoll, splitStatChars } from "@/lib/slotRoll";

import styles from "./StatsTrio.module.css";

export interface TrioNumberProps {
  prefix?: string;
  /**
   * The value. Any string of letters, digits, spaces, and punctuation:
   * "218", "3.4", or a phrase. Digits and letters roll; commas/dots/punctuation
   * stay static; spaces are preserved gaps.
   */
  digits: string;
  /** Superscript unit, e.g. "%" or "×". */
  unit?: string;
}

/** The big number in a stats-trio cell. Slot-rolls on entering the viewport. */
export function TrioNumber({ prefix, digits, unit }: TrioNumberProps) {
  const chars = useMemo(() => splitStatChars(digits), [digits]);

  const wrapRef = useRef<HTMLSpanElement>(null);
  const digitRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const targets: { el: HTMLElement; value: string; rollChars: string }[] = [];
    chars.forEach((c, i) => {
      const el = digitRefs.current[i];
      if ((c.kind === "digit" || c.kind === "letter") && el && c.rollChars) {
        targets.push({ el, value: c.ch, rollChars: c.rollChars });
      }
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
        t.el.textContent = t.rollChars[0];
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
        {chars.map((c, i) => {
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
          if (c.kind === "space") {
            return (
              <span key={i} className={styles.space}>
                {" "}
              </span>
            );
          }
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
          return <span key={i}>{c.ch}</span>;
        })}
      </span>
      {unit ? <sup>{unit}</sup> : null}
    </div>
  );
}
