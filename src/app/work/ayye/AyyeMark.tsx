"use client";

import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/lib/motion";

import { ayyeContent as c } from "./content";
import styles from "./page.module.css";

// Exact Ayye wordmark outline from v15 (svg.wm, viewBox 0 0 2119 1286). The
// same path is used for the draw-on stroke and the resolved fill.
const WM_PATH =
  "M262.385 332.515H434.291L654.817 942H497.67L461.205 834.342H233.734L197.269 942H41.8589L262.385 332.515ZM272.803 719.738H423.004L347.47 496.607L272.803 719.738ZM858.243 760.544L969.374 457.538H1129.99L826.119 1172.08H666.368L777.499 925.504L580.415 457.538H746.243L858.243 760.544ZM1337.35 760.544L1448.48 457.538H1609.1L1305.23 1172.08H1145.48L1256.61 925.504L1059.53 457.538H1225.35L1337.35 760.544ZM2082.14 781.381C2058.69 876.016 1972.74 948.946 1852.06 948.946C1709.67 948.946 1607.22 853.442 1607.22 699.769C1607.22 546.095 1707.94 450.592 1852.06 450.592C1993.58 450.592 2093.42 544.359 2093.42 691.955C2093.42 705.846 2092.55 720.606 2090.82 735.366H1754.82C1760.03 798.745 1799.1 828.264 1846.85 828.264C1888.53 828.264 1911.97 807.427 1924.12 781.381H2082.14ZM1850.32 569.537C1801.7 569.537 1764.37 599.056 1755.69 652.885H1941.49C1941.49 599.925 1899.81 569.537 1850.32 569.537Z";

const GUIDE_LINES = [
  { x1: -70, y1: 332.5, x2: 2189, y2: 332.5 },
  { x1: -70, y1: 457.5, x2: 2189, y2: 457.5 },
  { x1: -70, y1: 942, x2: 2189, y2: 942 },
  { x1: -70, y1: 1172, x2: 2189, y2: 1172 },
  { x1: 262, y1: 250, x2: 262, y2: 1255 },
  { x1: 654, y1: 250, x2: 654, y2: 1255 },
  { x1: 1129, y1: 250, x2: 1129, y2: 1255 },
  { x1: 1305, y1: 250, x2: 1305, y2: 1255 },
  { x1: 1609, y1: 250, x2: 1609, y2: 1255 },
  { x1: 2093, y1: 250, x2: 2093, y2: 1255 },
];

const GUIDE_CIRCLES = [
  { cx: 1850, cy: 700, r: 150 },
  { cx: 347, cy: 640, r: 118 },
];

/**
 * Section 02 the mark: the animated Ayye wordmark, ported from v15 #markbox.
 * Amber construction guides scale in (staggered), the wordmark strokes on via
 * stroke-dashoffset, the cream fill resolves while the stroke fades, a golden
 * .markwash glow settles behind it, and it rests on the filled cream wordmark
 * (no fade, no loop). Triggered once on scroll into view
 * (IntersectionObserver, threshold 0.3). Under
 * prefers-reduced-motion the finished state shows immediately (filled cream
 * wordmark + glow, no guides, no draw, no loop). CSS states live in
 * page.module.css; this only orchestrates the timing, exactly as v15 does.
 */
export function AyyeMark() {
  const boxRef = useRef<HTMLDivElement>(null);
  const strokeRef = useRef<SVGPathElement>(null);
  const gridRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const stroke = strokeRef.current;
    const gridGroup = gridRef.current;
    if (!box || !stroke || !gridGroup) return;

    const grid = Array.from(
      gridGroup.querySelectorAll<SVGElement>("line, circle"),
    );
    const reduce = prefersReducedMotion();

    let len = 9000;
    try {
      len = stroke.getTotalLength();
    } catch {
      /* getTotalLength can throw before layout; the 9000 fallback covers it. */
    }
    stroke.style.strokeDasharray = String(len);

    grid.forEach((el, i) => {
      el.style.setProperty("transform-box", "fill-box");
      if (el.tagName.toLowerCase() === "circle") {
        el.dataset.hide = "scale(0)";
        el.dataset.show = "scale(1)";
        el.style.transformOrigin = "center";
        el.style.transition = "transform .55s cubic-bezier(.3,.7,.25,1)";
      } else {
        const horiz = el.getAttribute("y1") === el.getAttribute("y2");
        if (horiz) {
          el.dataset.hide = "scaleX(0)";
          el.dataset.show = "scaleX(1)";
          el.style.transformOrigin = i % 2 === 0 ? "left center" : "right center";
        } else {
          el.dataset.hide = "scaleY(0)";
          el.dataset.show = "scaleY(1)";
          el.style.transformOrigin = i % 3 === 0 ? "center top" : "center bottom";
        }
        el.style.transition = "transform .5s cubic-bezier(.4,.05,.2,1)";
      }
      el.style.transform = el.dataset.hide ?? "";
    });

    let timers: number[] = [];
    const clearTimers = () => {
      timers.forEach((t) => window.clearTimeout(t));
      timers = [];
    };

    const hardReset = () => {
      box.classList.remove(styles.showGrid, styles.fill, styles.fade, styles.burst);
      grid.forEach((el) => {
        el.style.transform = el.dataset.hide ?? "";
      });
      stroke.style.transition = "none";
      stroke.style.strokeOpacity = "0";
      stroke.style.strokeDashoffset = String(len);
      void box.offsetWidth; // force reflow so the reset takes before the draw
      stroke.style.transition = "";
    };

    // Plays ONCE and settles on the filled cream wordmark + glow. (Deviation
    // from v15, which loops: per the brief the resting state is the solid
    // fill, never the outline, and there is no fade-out / re-loop, which also
    // avoids repeated forced reflows churning adjacent sections.)
    const play = () => {
      clearTimers();
      hardReset();
      box.classList.add(styles.showGrid);
      grid.forEach((el, i) => {
        timers.push(
          window.setTimeout(() => {
            el.style.transform = el.dataset.show ?? "";
          }, 120 + i * 60),
        );
      });
      const t0 = 120 + grid.length * 60 + 150;
      timers.push(
        window.setTimeout(() => {
          stroke.style.strokeOpacity = "0.95";
          stroke.style.strokeDashoffset = "0";
        }, t0),
      );
      // Fill resolves (and the stroke fades to 0), so the rest state is the
      // solid cream fill, not the outline.
      timers.push(window.setTimeout(() => box.classList.add(styles.fill), t0 + 1500));
      // Guides fade out, golden glow settles in behind the filled mark.
      timers.push(
        window.setTimeout(() => {
          box.classList.remove(styles.showGrid);
          box.classList.add(styles.burst);
        }, t0 + 1900),
      );
    };

    const showStatic = () => {
      box.classList.add(styles.fill, styles.burst);
      stroke.style.strokeOpacity = "0";
    };

    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            if (reduce) showStatic();
            else play();
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(box);

    return () => {
      io.disconnect();
      clearTimers();
    };
  }, []);

  return (
    <div className={styles.markStage}>
      <div ref={boxRef} className={styles.markbox}>
        <div className={styles.markwash} aria-hidden="true" />
        <svg
          className={styles.wm}
          viewBox="0 0 2119 1286"
          role="img"
          aria-label="Ayye"
        >
          <g ref={gridRef} className={styles.cgrid}>
            {GUIDE_LINES.map((l, i) => (
              <line key={`l${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
            ))}
            {GUIDE_CIRCLES.map((c2, i) => (
              <circle key={`c${i}`} cx={c2.cx} cy={c2.cy} r={c2.r} />
            ))}
          </g>
          <path className={styles.wmFill} d={WM_PATH} />
          <path ref={strokeRef} className={styles.wmStroke} d={WM_PATH} />
        </svg>
      </div>
      <p className={styles.markCaption}>{c.mark.caption}</p>
    </div>
  );
}
