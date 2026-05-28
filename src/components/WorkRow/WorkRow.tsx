"use client";

import { useEffect, useMemo, useRef } from "react";

import { Sticker, type StickerHandle } from "@/components/Sticker/Sticker";
import { prefersReducedMotion } from "@/lib/motion";
import { slotRoll } from "@/lib/slotRoll";

import styles from "./WorkRow.module.css";

/** Deterministic sticker variety, indexed by case position. */
const STICKERS = [
  { text: "Banger!", angle: -8 },
  { text: "Off the charts!", angle: 5 },
  { text: "Next level!", angle: -5 },
  { text: "Lost it!", angle: 7 },
];

export interface WorkRowProps {
  slug: string;
  client: string;
  discipline: string;
  year: string;
  caseNumber: string;
  prefix?: string;
  digits?: string;
  suffix?: string;
  headline?: string;
  index: number;
  /** Render the per-row sticker. Default true; the home page hides it to keep
   *  the page sticker budget at two (hero + closing CTA). */
  showSticker?: boolean;
}

export function WorkRow({
  slug,
  client,
  discipline,
  year,
  caseNumber,
  prefix,
  digits = "",
  suffix,
  headline,
  index,
  showSticker = true,
}: WorkRowProps) {
  const chars = useMemo(
    () => digits.split("").map((ch) => ({ ch, isDigit: /[0-9]/.test(ch) })),
    [digits],
  );

  const rowRef = useRef<HTMLAnchorElement>(null);
  const digitRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const stickerRef = useRef<StickerHandle>(null);
  const visibleRef = useRef(false);
  const rollRef = useRef<(() => void) | null>(null);

  const sticker = STICKERS[index % STICKERS.length];
  const preview = (headline ?? "").replace(/\s*\n\s*/g, " ").trim();
  // Display layer only: normalize meta to "Discipline · Year", stripping any
  // month from a full date like "May 2026" (Sanity doc is untouched).
  const displayYear = (year ?? "").match(/\d{4}/)?.[0] ?? year;

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

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

    let rollTimers: number[] = [];
    const loopTimers: number[] = [];
    const clearRoll = () => {
      rollTimers.forEach((id) => {
        window.clearTimeout(id);
        window.clearInterval(id);
      });
      rollTimers = [];
    };
    const roll = (startTime: number, per: number) => {
      clearRoll();
      targets.forEach((t) => {
        t.el.textContent = "0";
      });
      rollTimers = slotRoll(targets, { startTime, perDigitDelay: per });
    };
    rollRef.current = () => roll(250, 80);

    const scheduleReRoll = () => {
      const id = window.setTimeout(
        () => {
          if (visibleRef.current) roll(250, 80);
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
            roll(300, 110);
            loopTimers.push(
              window.setTimeout(() => stickerRef.current?.slam(), 360),
            );
            scheduleReRoll();
          }
        });
      },
      { threshold: 0.35 },
    );
    io.observe(row);

    return () => {
      io.disconnect();
      clearRoll();
      loopTimers.forEach((id) => {
        window.clearTimeout(id);
        window.clearInterval(id);
      });
      rollRef.current = null;
    };
  }, [chars]);

  const handleEnter = () => rollRef.current?.();

  return (
    <a
      ref={rowRef}
      href={`/work/${slug}`}
      className={styles.row}
      onMouseEnter={handleEnter}
    >
      <div className={styles.left}>
        <div className={styles.eyebrow}>Case {caseNumber}</div>
        <div className={styles.clientWrap}>
          <h2 className={styles.client}>{client}.</h2>
          {showSticker ? (
            <Sticker
              ref={stickerRef}
              text={sticker.text}
              angle={sticker.angle}
              variant="corner"
              initiallyHidden
              className={styles.sticker}
            />
          ) : null}
        </div>
        <div className={styles.meta}>
          {discipline} · {displayYear}
        </div>
        {preview ? <p className={styles.preview}>{preview}</p> : null}
      </div>

      <div className={styles.right}>
        <span className={styles.number}>
          {prefix ? <span className={styles.affix}>{prefix}</span> : null}
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
          {suffix ? <span className={styles.affix}>{suffix}</span> : null}
        </span>
      </div>
    </a>
  );
}
