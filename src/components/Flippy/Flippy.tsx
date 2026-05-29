"use client";

import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { FlippyBubble } from "./FlippyBubble";
import {
  pickRandomExpression,
  type FlippyExpression,
} from "./flippyExpressions";
import { flippyLines, type FlippyTrigger } from "./flippyLines";
import { FlippySvg } from "./FlippySvg";
import styles from "./Flippy.module.css";

const SIZE = 110;
const ASPECT = 230.3 / 381.2;
const WIDTH = SIZE * ASPECT;
const STATIC_SIZE = 70;
const STATIC_WIDTH = STATIC_SIZE * ASPECT;
const EDGE = 30;

// Feral pass: damping dropped from 14 → 11 for more overshoot wobble.
const POS_SPRING = { stiffness: 90, damping: 11, mass: 0.6 };
const SCALE_SPRING = { stiffness: 220, damping: 14, mass: 0.7 };
const ROTATE_SPRING = { stiffness: 180, damping: 18, mass: 0.6 };

// Stretch peak 0.25 → 0.45. Limits 1.25/0.8 → 1.45/0.65. Lean ±6 → ±14.
const STRETCH_FACTOR = 0.45;
const SCALE_MIN = 0.65;
const SCALE_MAX = 1.45;
const LEAN_CLAMP = 14;

const IDLE_MS = 1500;
const INACTIVITY_BUBBLE_MS = 25_000;
const ROUTE_LAND_DELAY = 800;
const BUBBLE_HOLD_MS = 3500;

// Expression cycle: pick a non-grin every 1.8–3.5s; hold 700–1300ms; settle.
const EXPRESSION_CYCLE_MIN = 1800;
const EXPRESSION_CYCLE_MAX = 3500;
const EXPRESSION_HOLD_MIN = 700;
const EXPRESSION_HOLD_MAX = 1300;

// Pupil darts: every 0.6–1.4s, jump 4–8px in a random direction, snap back
// after 200–500ms.
const DART_CYCLE_MIN = 600;
const DART_CYCLE_MAX = 1400;
const DART_HOLD_MIN = 200;
const DART_HOLD_MAX = 500;
const DART_RADIUS_MIN = 4;
const DART_RADIUS_MAX = 8;

// Spasm: every 6–12s, wiggle ±4° for ~3 quick oscillations.
const SPASM_CYCLE_MIN = 6000;
const SPASM_CYCLE_MAX = 12_000;

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

const randBetween = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

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

export function Flippy() {
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

  // Expression state. Trigger overrides bypass the random idle cycle.
  const [expression, setExpression] = useState<FlippyExpression>("grin");
  const expressionRef = useRef<FlippyExpression>("grin");
  useEffect(() => {
    expressionRef.current = expression;
  }, [expression]);
  const expressionHoldTimerRef = useRef<number | null>(null);
  // Tracks the last trigger-driven expression so a CTA hover doesn't get
  // overridden by the random cycle for a second.
  const triggerHoldUntilRef = useRef<number>(0);

  // Pupil dart state, applied to overlay <g> in the SVG.
  const pupilDx = useMotionValue(0);
  const pupilDy = useMotionValue(0);

  // Cursor + position springs.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, POS_SPRING);
  const sy = useSpring(y, POS_SPRING);

  // Squash/stretch + lean springs driven by velocity.
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);
  const rotate = useMotionValue(0);
  const sScaleX = useSpring(scaleX, SCALE_SPRING);
  const sScaleY = useSpring(scaleY, SCALE_SPRING);
  const sRotate = useSpring(rotate, ROTATE_SPRING);

  // Spasm rotation (additive to the velocity-driven sRotate, on a separate
  // wrapping layer so it doesn't fight the spring).
  const spasmRotate = useMotionValue(0);

  // Constant sub-pixel idle jitter so he never reads frozen.
  const jitterX = useMotionValue(0);
  const jitterY = useMotionValue(0);

  // High-frequency refs.
  const lastMoveAtRef = useRef<number>(0);
  const idleRef = useRef(false);
  const isStaticRef = useRef(isStatic);
  const reducedMotionRef = useRef(reducedMotion);
  useEffect(() => {
    isStaticRef.current = isStatic;
    reducedMotionRef.current = reducedMotion;
  }, [isStatic, reducedMotion]);

  const [idle, setIdle] = useState(false);

  // Init: center him on first mount.
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

  // Per-frame: velocity → stretch + lean, idle detection, constant micro-jitter.
  useAnimationFrame((t) => {
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
        clamp(
          1 + STRETCH_FACTOR * stretch * cos - STRETCH_FACTOR * 0.85 * stretch * sin,
          SCALE_MIN,
          SCALE_MAX,
        ),
      );
      scaleY.set(
        clamp(
          1 + STRETCH_FACTOR * stretch * sin - STRETCH_FACTOR * 0.85 * stretch * cos,
          SCALE_MIN,
          SCALE_MAX,
        ),
      );
      rotate.set(clamp(vx / 90, -LEAN_CLAMP, LEAN_CLAMP));
    }

    // Constant sub-pixel jitter via Lissajous-like time offsets. Tiny.
    jitterX.set(Math.sin(t / 1100) * 0.5 + Math.sin(t / 730) * 0.3);
    jitterY.set(Math.cos(t / 1300) * 0.5 + Math.sin(t / 990) * 0.3);

    if (
      !idleRef.current &&
      mag < 5 &&
      performance.now() - lastMoveAtRef.current > IDLE_MS
    ) {
      idleRef.current = true;
      setIdle(true);
    }
  });

  // Show a bubble.
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

  // Set expression for a held duration (trigger-driven), then drift back to
  // grin. The hold is also recorded so the random cycle steps aside.
  const setExpressionFor = useCallback(
    (next: FlippyExpression, holdMs: number) => {
      if (reducedMotionRef.current || isStaticRef.current) return;
      if (expressionHoldTimerRef.current) {
        window.clearTimeout(expressionHoldTimerRef.current);
      }
      setExpression(next);
      expressionRef.current = next;
      triggerHoldUntilRef.current = performance.now() + holdMs;
      expressionHoldTimerRef.current = window.setTimeout(() => {
        setExpression("grin");
        expressionRef.current = "grin";
        expressionHoldTimerRef.current = null;
      }, holdMs);
    },
    [],
  );

  // Random expression cycle. Picks a non-grin every 1.8–3.5s and holds it
  // briefly before drifting back. Only runs when no trigger override is active.
  useEffect(() => {
    if (!mounted || isStatic || reducedMotion) return;
    let cancelled = false;
    let timer: number | undefined;
    const scheduleNext = () => {
      if (cancelled) return;
      const wait = randBetween(EXPRESSION_CYCLE_MIN, EXPRESSION_CYCLE_MAX);
      timer = window.setTimeout(() => {
        if (cancelled) return;
        if (performance.now() < triggerHoldUntilRef.current) {
          scheduleNext();
          return;
        }
        const next = pickRandomExpression(expressionRef.current);
        const hold = randBetween(EXPRESSION_HOLD_MIN, EXPRESSION_HOLD_MAX);
        setExpressionFor(next, hold);
        scheduleNext();
      }, wait);
    };
    scheduleNext();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [mounted, isStatic, reducedMotion, setExpressionFor]);

  // Pupil darts on their own jittery timer.
  useEffect(() => {
    if (!mounted || isStatic || reducedMotion) return;
    let cancelled = false;
    let timer: number | undefined;
    const fire = () => {
      const r = randBetween(DART_RADIUS_MIN, DART_RADIUS_MAX);
      const theta = Math.random() * Math.PI * 2;
      const dx = Math.cos(theta) * r;
      const dy = Math.sin(theta) * r;
      pupilDx.set(dx);
      pupilDy.set(dy);
      const hold = randBetween(DART_HOLD_MIN, DART_HOLD_MAX);
      window.setTimeout(() => {
        if (cancelled) return;
        pupilDx.set(0);
        pupilDy.set(0);
      }, hold);
    };
    const scheduleNext = () => {
      if (cancelled) return;
      const wait = randBetween(DART_CYCLE_MIN, DART_CYCLE_MAX);
      timer = window.setTimeout(() => {
        if (cancelled) return;
        fire();
        scheduleNext();
      }, wait);
    };
    scheduleNext();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [mounted, isStatic, reducedMotion, pupilDx, pupilDy]);

  // Spasm timer.
  useEffect(() => {
    if (!mounted || isStatic || reducedMotion) return;
    let cancelled = false;
    let timer: number | undefined;
    const scheduleNext = () => {
      if (cancelled) return;
      const wait = randBetween(SPASM_CYCLE_MIN, SPASM_CYCLE_MAX);
      timer = window.setTimeout(() => {
        if (cancelled) return;
        animate(spasmRotate, [0, 4, -4, 3, -3, 0], {
          duration: 0.42,
          ease: "easeInOut",
        });
        scheduleNext();
      }, wait);
    };
    scheduleNext();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [mounted, isStatic, reducedMotion, spasmRotate]);

  // Route change: gasp expression + 800ms-delayed land bubble.
  useEffect(() => {
    if (!mounted) return;
    setExpressionFor("gasp", 1100);
    const t = window.setTimeout(() => fireTrigger("land"), ROUTE_LAND_DELAY);
    return () => window.clearTimeout(t);
  }, [pathname, mounted, fireTrigger, setExpressionFor]);

  // Inactivity bubble: poll for >25s of no movement; also swap to smirk.
  useEffect(() => {
    if (!mounted || isStatic) return;
    const id = window.setInterval(() => {
      if (performance.now() - lastMoveAtRef.current > INACTIVITY_BUBBLE_MS) {
        if (!reducedMotionRef.current) setExpressionFor("smirk", 1500);
        fireTrigger("idle");
        lastMoveAtRef.current = performance.now();
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [mounted, isStatic, fireTrigger, setExpressionFor]);

  // Hover triggers: cta → manic, work → wide. Also fires bubble.
  useEffect(() => {
    if (!mounted || isStatic) return;
    const handle = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const match = target?.closest("[data-flippy-react]") as HTMLElement | null;
      if (!match) return;
      const kind = match.getAttribute("data-flippy-react");
      if (kind === "cta") {
        setExpressionFor("manic", 1100);
        fireTrigger("cta");
      } else if (kind === "work") {
        setExpressionFor("wide", 1100);
        fireTrigger("work");
      }
    };
    window.addEventListener("mouseover", handle);
    return () => window.removeEventListener("mouseover", handle);
  }, [mounted, isStatic, fireTrigger, setExpressionFor]);

  // Click on Flippy → tongue. He's pointer-events: none, so we hit-test the
  // window mousedown against his current bounds.
  useEffect(() => {
    if (!mounted || isStatic) return;
    const handle = (e: MouseEvent) => {
      const fx = sx.get();
      const fy = sy.get();
      const dx = e.clientX - fx;
      const dy = fy - e.clientY;
      const halfW = WIDTH / 2 + 8;
      const inX = dx > -halfW && dx < halfW;
      const inY = dy > -8 && dy < SIZE + 8;
      if (inX && inY) setExpressionFor("tongue", 900);
    };
    window.addEventListener("mousedown", handle);
    return () => window.removeEventListener("mousedown", handle);
  }, [mounted, isStatic, sx, sy, setExpressionFor]);

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

  // Lock expression to grin if reduced motion is on but we somehow got here.
  const renderedExpression: FlippyExpression = reducedMotion ? "grin" : expression;

  return (
    <motion.div
      className={styles.wrap}
      style={{ x: sx, y: sy }}
      aria-hidden="true"
    >
      <FlippyBubble text={bubble} bubbleKey={bubbleKey} />
      <motion.div className={styles.jitter} style={{ x: jitterX, y: jitterY }}>
        <motion.div
          className={styles.body}
          style={{ scaleX: sScaleX, scaleY: sScaleY, rotate: sRotate }}
        >
          <motion.div className={styles.spasm} style={{ rotate: spasmRotate }}>
            <motion.div
              className={styles.breath}
              animate={idle ? { scale: [1, 1.03, 1] } : { scale: 1 }}
              transition={
                idle
                  ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.2 }
              }
            >
              <FlippySvg
                expression={renderedExpression}
                pupilDx={pupilDx}
                pupilDy={pupilDy}
                className={styles.svg}
                width={WIDTH}
                height={SIZE}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
