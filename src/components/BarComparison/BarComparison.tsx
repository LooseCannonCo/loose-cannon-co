"use client";

import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/lib/motion";
import { printRegister } from "@/lib/printRegister";

import styles from "./BarComparison.module.css";

export interface BarComparisonProps {
  /** Baseline / prior value (rendered as the short solid-plum bar). */
  prior: number;
  /** Current / breakout value (rendered with the print-registration treatment). */
  current: number;
  priorLabel?: string;
  currentLabel?: string;
}

const BASELINE = 103;
const TOP = 22;
const MAX_H = BASELINE - TOP; // 81

/**
 * Bar comparison: a short solid-plum prior bar grows in, then the current bar
 * (the breakout) gets the full print registration: base + violet together,
 * plum chasing 220ms behind. Heights are proportional to the values. Own
 * IntersectionObserver (threshold 0.4).
 */
export function BarComparison({
  prior,
  current,
  priorLabel = "PRIOR",
  currentLabel = "CURRENT",
}: BarComparisonProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const priorRef = useRef<SVGGElement>(null);
  const baseRef = useRef<SVGGElement>(null);
  const violetRef = useRef<SVGGElement>(null);
  const plumRef = useRef<SVGGElement>(null);

  const maxVal = Math.max(prior, current, 1);
  const priorH = (Math.max(prior, 0) / maxVal) * MAX_H;
  const currentH = (Math.max(current, 0) / maxVal) * MAX_H;
  const priorY = BASELINE - priorH;
  const currentY = BASELINE - currentH;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const settleBar = (el: SVGElement) => {
      el.style.transition = "transform 950ms cubic-bezier(0.22, 0.7, 0.3, 1)";
      el.style.transform = "scaleY(1)";
    };

    if (prefersReducedMotion()) {
      [priorRef.current, baseRef.current, violetRef.current, plumRef.current].forEach(
        (el) => {
          if (el) el.style.transform = "scaleY(1)";
        },
      );
      return;
    }

    const timers: number[] = [];
    const after = (ms: number, fn: () => void) =>
      timers.push(window.setTimeout(fn, ms));

    const run = () => {
      after(420, () => {
        if (priorRef.current) {
          priorRef.current.style.transition =
            "transform 480ms cubic-bezier(0.2, 1.5, 0.3, 1)";
          priorRef.current.style.transform = "scaleY(1)";
        }
      });
      after(820, () => {
        printRegister(
          {
            base: baseRef.current,
            violet: violetRef.current,
            plum: plumRef.current,
          },
          settleBar,
        ).forEach((id) => timers.push(id));
      });
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
  }, [prior, current]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 130 130"
      className={styles.bar}
      aria-hidden="true"
    >
      <line x1="12" y1={BASELINE} x2="118" y2={BASELINE} stroke="#270c1d" strokeWidth="1" />

      <g
        ref={priorRef}
        style={{ transformOrigin: `38px ${BASELINE}px`, transform: "scaleY(0)" }}
      >
        <rect x="22" y={priorY} width="32" height={priorH} fill="#270c1d" rx="3" />
      </g>

      <g
        ref={baseRef}
        style={{ transformOrigin: `90px ${BASELINE}px`, transform: "scaleY(0)" }}
      >
        <rect x="74" y={currentY} width="32" height={currentH} fill="#fbafdf" rx="3" />
      </g>
      <g
        ref={violetRef}
        style={{ transformOrigin: `90px ${BASELINE}px`, transform: "scaleY(0)" }}
      >
        <g transform="translate(1.5 1)">
          <rect x="74" y={currentY} width="32" height={currentH} fill="url(#ht-v-sm)" rx="3" />
        </g>
      </g>
      <g
        ref={plumRef}
        style={{ transformOrigin: `90px ${BASELINE}px`, transform: "scaleY(0)" }}
      >
        <rect x="74" y={currentY} width="32" height={currentH} fill="url(#ht-p-sm)" rx="3" />
        <rect
          x="74"
          y={currentY}
          width="32"
          height={currentH}
          fill="none"
          stroke="#270c1d"
          strokeWidth="1"
          rx="3"
        />
      </g>

      <g className={styles.labels}>
        <text x="38" y="118" textAnchor="middle" opacity="0.7">
          {priorLabel}
        </text>
        <text x="90" y="118" textAnchor="middle">
          {currentLabel}
        </text>
      </g>
    </svg>
  );
}
