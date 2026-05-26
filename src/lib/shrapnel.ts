import { prefersReducedMotion } from "./motion";

const SVG_NS = "http://www.w3.org/2000/svg";

/** Plum ink and violet registration bleed — the only two shrapnel colors. */
const PLUM = "#270c1d";
const VIOLET = "#b14aff";

/**
 * Halftone shrapnel — the slam aftermath. Spawns 10-13 SVG dot particles from
 * (originX, originY) inside `container`, each flung upward in a fan with gravity
 * physics, fading out over 620-860ms. Every 3rd particle is violet, the rest
 * plum. Ported verbatim from the reference case studies (gravity = 420).
 *
 * `container` must be a positioned element (the particles are absolutely
 * positioned relative to it). No-op under prefers-reduced-motion.
 */
export function spawnShrapnel(
  originX: number,
  originY: number,
  container: HTMLElement,
  gravity = 420,
): void {
  if (prefersReducedMotion()) return;

  const count = 10 + Math.floor(Math.random() * 4); // 10-13

  for (let i = 0; i < count; i++) {
    const angle = -Math.PI * 0.5 + (Math.random() - 0.5) * Math.PI * 1.1;
    const velocity = 90 + Math.random() * 140;
    const size = 6 + Math.random() * 7;
    const isViolet = i % 3 === 0;

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));
    svg.setAttribute("viewBox", "0 0 20 20");
    svg.style.cssText =
      `position:absolute;left:${originX - size / 2}px;top:${originY - size / 2}px;` +
      `pointer-events:none;z-index:20;will-change:transform,opacity`;

    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("cx", "10");
    circle.setAttribute("cy", "10");
    circle.setAttribute("r", "9");
    circle.setAttribute("fill", isViolet ? VIOLET : PLUM);
    circle.setAttribute("fill-opacity", isViolet ? "0.6" : "0.9");
    svg.appendChild(circle);
    container.appendChild(svg);

    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    const t0 = performance.now();
    const dur = 620 + Math.random() * 240; // 620-860ms

    const step = (now: number) => {
      const e = (now - t0) / 1000;
      if (e * 1000 > dur) {
        svg.remove();
        return;
      }
      const x = vx * e;
      const y = vy * e + 0.5 * gravity * e * e;
      svg.style.transform = `translate(${x}px, ${y}px) scale(${1 - e * 0.45})`;
      svg.style.opacity = String(1 - (e * 1000) / dur);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}
