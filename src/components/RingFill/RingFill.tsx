"use client";

import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/lib/motion";
import { printRegister } from "@/lib/printRegister";

import styles from "./RingFill.module.css";

export interface RingFillProps {
  /** Fill percentage, 0-100. Ring fill is only ever a true percentage. */
  percent: number;
}

const R = 44; // base / violet / plum radius
const TRACK_R = 50;
const C = 2 * Math.PI * R;
const CT = 2 * Math.PI * TRACK_R;

/**
 * Ring fill: a faint track draws in, then the base + violet bleed settle
 * together with the plum halftone chasing 220ms behind (print registration),
 * then the violet layer breathes. Own IntersectionObserver (threshold 0.4).
 */
export function RingFill({ percent }: RingFillProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const trackRef = useRef<SVGCircleElement>(null);
  const baseRef = useRef<SVGCircleElement>(null);
  const violetRef = useRef<SVGCircleElement>(null);
  const plumRef = useRef<SVGCircleElement>(null);
  const vWrapRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const fraction = Math.max(0, Math.min(100, percent)) / 100;
    const target = C * (1 - fraction);

    const settleRing = (el: SVGElement) => {
      el.style.transition =
        "stroke-dashoffset 1000ms cubic-bezier(0.25, 0.7, 0.3, 1)";
      el.style.strokeDashoffset = String(target);
    };

    if (prefersReducedMotion()) {
      if (trackRef.current) trackRef.current.style.strokeDashoffset = "0";
      [baseRef.current, violetRef.current, plumRef.current].forEach((el) => {
        if (el) el.style.strokeDashoffset = String(target);
      });
      return;
    }

    const timers: number[] = [];
    const after = (ms: number, fn: () => void) =>
      timers.push(window.setTimeout(fn, ms));

    const run = () => {
      if (trackRef.current) {
        trackRef.current.style.transition =
          "stroke-dashoffset 300ms cubic-bezier(0.25, 0.7, 0.3, 1)";
        trackRef.current.style.strokeDashoffset = "0";
      }
      after(280, () => {
        printRegister(
          {
            base: baseRef.current,
            violet: violetRef.current,
            plum: plumRef.current,
          },
          settleRing,
        ).forEach((id) => timers.push(id));
      });
      after(2600, () => vWrapRef.current?.classList.add(styles.idle));
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
    io.observe(svg);

    return () => {
      io.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [percent]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 130 130"
      className={styles.ring}
      aria-hidden="true"
    >
      <circle
        ref={trackRef}
        cx="65"
        cy="65"
        r={TRACK_R}
        fill="none"
        stroke="#270c1d"
        strokeWidth="0.75"
        strokeOpacity="0.3"
        strokeDasharray={CT}
        strokeDashoffset={CT}
        transform="rotate(-90 65 65)"
      />
      <circle
        ref={baseRef}
        cx="65"
        cy="65"
        r={R}
        fill="none"
        stroke="#fbafdf"
        strokeWidth="18"
        strokeDasharray={C}
        strokeDashoffset={C}
        transform="rotate(-90 65 65)"
      />
      <g ref={vWrapRef} className={styles.vWrap}>
        <g transform="translate(1.5 1)">
          <circle
            ref={violetRef}
            cx="65"
            cy="65"
            r={R}
            fill="none"
            stroke="url(#ht-v-sm)"
            strokeWidth="18"
            strokeDasharray={C}
            strokeDashoffset={C}
            transform="rotate(-90 65 65)"
          />
        </g>
      </g>
      <circle
        ref={plumRef}
        cx="65"
        cy="65"
        r={R}
        fill="none"
        stroke="url(#ht-p-sm)"
        strokeWidth="18"
        strokeDasharray={C}
        strokeDashoffset={C}
        transform="rotate(-90 65 65)"
      />
    </svg>
  );
}
