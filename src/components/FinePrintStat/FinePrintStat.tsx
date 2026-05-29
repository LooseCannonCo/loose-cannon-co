"use client";

import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/lib/motion";
import { slotRoll } from "@/lib/slotRoll";

import styles from "./FinePrintStat.module.css";

/**
 * Closing-section dry-stat lockup: eyebrow, a single hero-scale "0" that
 * slot-rolls and settles on 0 (the quiet punchline), and a caption. The
 * registration bleed lives in a ::before pseudo on the digit, so it stays "0"
 * (the final state) while the ink flips random during the roll, and it pops
 * together with the ink on settle.
 */
export function FinePrintStat() {
  const rootRef = useRef<HTMLDivElement>(null);
  const digitRef = useRef<HTMLSpanElement>(null);
  const visibleRef = useRef(false);
  const rollRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const el = digitRef.current;
    if (!root || !el) return;

    if (prefersReducedMotion()) {
      el.textContent = "0";
      return;
    }

    const targets = [{ el: el as HTMLElement, value: "0" }];
    let rollTimers: number[] = [];
    const loopTimers: number[] = [];
    const clearRoll = () => {
      rollTimers.forEach((id) => {
        window.clearTimeout(id);
        window.clearInterval(id);
      });
      rollTimers = [];
    };
    const roll = (startTime: number) => {
      clearRoll();
      el.textContent = "0";
      rollTimers = slotRoll(targets, { startTime, perDigitDelay: 0 });
    };
    rollRef.current = () => roll(260);

    const scheduleReRoll = () => {
      const id = window.setTimeout(
        () => {
          if (visibleRef.current) roll(260);
          scheduleReRoll();
        },
        8000 + Math.random() * 4000,
      );
      loopTimers.push(id);
    };

    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          visibleRef.current = e.isIntersecting;
          if (e.isIntersecting && !started) {
            started = true;
            roll(400);
            scheduleReRoll();
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(root);

    return () => {
      io.disconnect();
      clearRoll();
      loopTimers.forEach((id) => {
        window.clearTimeout(id);
        window.clearInterval(id);
      });
      rollRef.current = null;
    };
  }, []);

  const handleEnter = () => rollRef.current?.();

  return (
    <div ref={rootRef} className={styles.wrap} onMouseEnter={handleEnter}>
      <div className={styles.eyebrowRow}>
        <span className={styles.dot} aria-hidden="true" />
        <span className={styles.eyebrow}>The fine print</span>
      </div>
      <div className={`${styles.numberBox} flippy-hide-behind`}>
        <span ref={digitRef} className={styles.digit}>
          0
        </span>
      </div>
      <p className={styles.caption}>
        account managers between
        <br />
        you and the work.
      </p>
    </div>
  );
}
