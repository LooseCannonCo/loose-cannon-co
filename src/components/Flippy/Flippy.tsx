"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { FlippyBubble } from "./FlippyBubble";
import { flippyLines, type FlippyTrigger } from "./flippyLines";
import styles from "./Flippy.module.css";

const SIZE = 110;
const ASPECT = 230.3 / 381.2;
const WIDTH = SIZE * ASPECT;
const STATIC_SIZE = 70;
const STATIC_WIDTH = STATIC_SIZE * ASPECT;
const EDGE = 30;

const POS_SPRING = { stiffness: 90, damping: 14, mass: 0.6 };
const SCALE_SPRING = { stiffness: 220, damping: 14, mass: 0.7 };
const ROTATE_SPRING = { stiffness: 180, damping: 18, mass: 0.6 };

const IDLE_MS = 1500;
const INACTIVITY_BUBBLE_MS = 25_000;
const ROUTE_LAND_DELAY = 800;
const BUBBLE_HOLD_MS = 3500;

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

type MQs = { mobile: boolean; reducedMotion: boolean };

function pickLine(
  arr: string[] | undefined,
  lastIndexByKey: { current: Record<string, number> },
  key: string,
): string | null {
  if (!arr || arr.length === 0) return null;
  if (arr.length === 1) {
    lastIndexByKey.current[key] = 0;
    return arr[0];
  }
  const last = lastIndexByKey.current[key] ?? -1;
  let i = Math.floor(Math.random() * arr.length);
  if (i === last) i = (i + 1) % arr.length;
  lastIndexByKey.current[key] = i;
  return arr[i];
}

/**
 * Guard wrapper: Flippy is mounted once in the root layout, which includes
 * the embedded Studio at /studio. The Studio is a working backend, so the
 * cursor-follower is suppressed there and renders only on the public site.
 * Kept as a separate component so the inner hooks are never conditional.
 */
export function Flippy() {
  const pathname = usePathname();
  if (pathname === "/studio" || pathname.startsWith("/studio/")) return null;
  return <FlippyInner />;
}

function FlippyInner() {
  const pathname = usePathname();

  // SSR-safe defaults. Hydrate from matchMedia after mount.
  const [mounted, setMounted] = useState(false);
  const [mqs, setMqs] = useState<MQs>({ mobile: false, reducedMotion: false });
  const { mobile, reducedMotion } = mqs;
  const isStatic = mobile || reducedMotion;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const mobileMQ = window.matchMedia(
      "(max-width: 768px), (pointer: coarse)",
    );
    const reducedMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setMqs({ mobile: mobileMQ.matches, reducedMotion: reducedMQ.matches });
    update();
    mobileMQ.addEventListener("change", update);
    reducedMQ.addEventListener("change", update);
    return () => {
      mobileMQ.removeEventListener("change", update);
      reducedMQ.removeEventListener("change", update);
    };
  }, []);

  // Bubble state.
  const [bubble, setBubble] = useState<string | null>(null);
  const [bubbleKey, setBubbleKey] = useState(0);
  const bubbleTimerRef = useRef<number | null>(null);
  const lastIndexByKey = useRef<Record<string, number>>({});

  // Cursor + spring values (animated only).
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, POS_SPRING);
  const sy = useSpring(y, POS_SPRING);
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);
  const rotate = useMotionValue(0);
  const sScaleX = useSpring(scaleX, SCALE_SPRING);
  const sScaleY = useSpring(scaleY, SCALE_SPRING);
  const sRotate = useSpring(rotate, ROTATE_SPRING);

  // High-frequency refs (avoid re-attaching listeners on every state change).
  const lastMoveAtRef = useRef<number>(0);
  const idleRef = useRef(false);
  const isStaticRef = useRef(isStatic);
  useEffect(() => {
    isStaticRef.current = isStatic;
  }, [isStatic]);

  const [idle, setIdle] = useState(false);

  // Initialize position at viewport center on first mount.
  useEffect(() => {
    if (!mounted) return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    x.set(cx);
    y.set(cy);
    sx.jump(cx);
    sy.jump(cy);
    lastMoveAtRef.current = performance.now();
  }, [mounted, x, y, sx, sy]);

  // Cursor listener.
  useEffect(() => {
    if (!mounted || isStatic) return;
    const handle = (e: MouseEvent) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const minX = EDGE + WIDTH / 2;
      const maxX = vw - EDGE - WIDTH / 2;
      const minY = EDGE + SIZE;
      const maxY = vh - EDGE;
      x.set(clamp(e.clientX, minX, maxX));
      y.set(clamp(e.clientY, minY, maxY));
      lastMoveAtRef.current = performance.now();
      if (idleRef.current) {
        idleRef.current = false;
        setIdle(false);
      }
    };
    window.addEventListener("mousemove", handle, { passive: true });
    return () => window.removeEventListener("mousemove", handle);
  }, [mounted, isStatic, x, y]);

  // Per-frame: velocity to squash/stretch + lean + idle detection.
  useAnimationFrame(() => {
    if (isStaticRef.current) return;
    const vx = sx.getVelocity();
    const vy = sy.getVelocity();
    const mag = Math.hypot(vx, vy);

    if (mag < 40) {
      scaleX.set(1);
      scaleY.set(1);
      rotate.set(0);
    } else {
      const angle = Math.atan2(vy, vx);
      const cos = Math.abs(Math.cos(angle));
      const sin = Math.abs(Math.sin(angle));
      const stretch = Math.min(mag / 1400, 1);
      scaleX.set(
        clamp(1 + 0.25 * stretch * cos - 0.2 * stretch * sin, 0.8, 1.25),
      );
      scaleY.set(
        clamp(1 + 0.25 * stretch * sin - 0.2 * stretch * cos, 0.8, 1.25),
      );
      rotate.set(clamp(vx / 90, -6, 6));
    }

    if (
      !idleRef.current &&
      mag < 5 &&
      performance.now() - lastMoveAtRef.current > IDLE_MS
    ) {
      idleRef.current = true;
      setIdle(true);
    }
  });

  // Show a bubble (replaces any current bubble).
  const showBubble = useCallback((line: string | null) => {
    if (!line) return;
    if (bubbleTimerRef.current) {
      window.clearTimeout(bubbleTimerRef.current);
      bubbleTimerRef.current = null;
    }
    setBubble(line);
    setBubbleKey((k) => k + 1);
    bubbleTimerRef.current = window.setTimeout(() => {
      setBubble(null);
      bubbleTimerRef.current = null;
    }, BUBBLE_HOLD_MS);
  }, []);

  const fireTrigger = useCallback(
    (trigger: FlippyTrigger) => {
      const routeLines = flippyLines[pathname];
      const arr = routeLines?.[trigger];
      const line = pickLine(arr, lastIndexByKey, `${pathname}:${trigger}`);
      showBubble(line);
    },
    [pathname, showBubble],
  );

  // Route change: fire "land" line 800ms after pathname settles.
  useEffect(() => {
    if (!mounted) return;
    const t = window.setTimeout(() => fireTrigger("land"), ROUTE_LAND_DELAY);
    return () => window.clearTimeout(t);
  }, [pathname, mounted, fireTrigger]);

  // Inactivity bubble: poll every second for >25s of no movement.
  useEffect(() => {
    if (!mounted || isStatic) return;
    const id = window.setInterval(() => {
      if (
        performance.now() - lastMoveAtRef.current >
        INACTIVITY_BUBBLE_MS
      ) {
        fireTrigger("idle");
        lastMoveAtRef.current = performance.now();
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [mounted, isStatic, fireTrigger]);

  // Hover-based triggers via global mouseover delegation.
  useEffect(() => {
    if (!mounted || isStatic) return;
    const handle = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const match = target?.closest("[data-flippy-react]") as HTMLElement | null;
      if (!match) return;
      const kind = match.getAttribute("data-flippy-react");
      if (kind === "cta" || kind === "work") fireTrigger(kind);
    };
    window.addEventListener("mouseover", handle);
    return () => window.removeEventListener("mouseover", handle);
  }, [mounted, isStatic, fireTrigger]);

  const handleStaticTap = useCallback(() => {
    if (isStatic) fireTrigger("land");
  }, [isStatic, fireTrigger]);

  if (!mounted) return null;

  if (isStatic) {
    return (
      <div className={styles.staticWrap} aria-hidden="true">
        <FlippyBubble
          text={bubble}
          bubbleKey={bubbleKey}
          instant={reducedMotion}
        />
        <button
          type="button"
          className={styles.staticTap}
          onClick={handleStaticTap}
          aria-label="Flippy"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/flippy.svg"
            alt=""
            width={STATIC_WIDTH}
            height={STATIC_SIZE}
            draggable={false}
          />
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.wrap}
      style={{ x: sx, y: sy }}
      aria-hidden="true"
    >
      {/* Bubble lives outside the squash/stretch transform so it doesn't deform. */}
      <FlippyBubble text={bubble} bubbleKey={bubbleKey} />
      <motion.div
        className={styles.body}
        style={{ scaleX: sScaleX, scaleY: sScaleY, rotate: sRotate }}
      >
        <motion.div
          className={styles.breath}
          animate={idle ? { scale: [1, 1.03, 1] } : { scale: 1 }}
          transition={
            idle
              ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.2 }
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/flippy.svg"
            alt=""
            className={styles.img}
            width={WIDTH}
            height={SIZE}
            draggable={false}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
