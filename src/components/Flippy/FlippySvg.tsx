"use client";

import { motion, type MotionValue } from "framer-motion";

import {
  BODY_FILL_PINK,
  BODY_OUTLINE,
  EYE_LEFT,
  EYE_RIGHT,
  FACE_ANCHORS,
  FACE_DETAIL,
  FLIPPY_PINK,
  FLIPPY_PLUM,
  FLIPPY_VIEWBOX,
  MOUTH_BASE,
  MOUTH_LIP,
} from "./flippyPaths";
import {
  EXPRESSIONS,
  type FlippyExpression,
} from "./flippyExpressions";

export interface FlippySvgProps {
  expression: FlippyExpression;
  /** Motion values for the pupil overlay translate. Driven by Flippy.tsx. */
  pupilDx: MotionValue<number>;
  pupilDy: MotionValue<number>;
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Inline desktop Flippy. The base SVG paths from public/flippy.svg render as
 * the silhouette + the default face. Overlay shapes (drawn on top) handle the
 * other expressions; opacity-toggles snap so swaps read hand-drawn, not tweened.
 *
 * The pupils sit as overlay <circle>s slightly larger than the source pupils so
 * they cover the underlying art at rest; the pupilDx/pupilDy props translate
 * just the overlay group for darts without moving the eye outline.
 */
export function FlippySvg({
  expression,
  pupilDx,
  pupilDy,
  className,
  width,
  height,
}: FlippySvgProps) {
  const shape = EXPRESSIONS[expression];
  const showBaseMouth = shape.mouth === "base" ? 1 : 0;
  const showBaseEyes = shape.eyes === "base" ? 1 : 0;
  const showOverlayPupils = shape.eyes === "base" ? 1 : 0;

  const right = FACE_ANCHORS.rightEye;
  const left = FACE_ANCHORS.leftEye;
  const mouth = FACE_ANCHORS.mouth;
  const browR = FACE_ANCHORS.rightBrow;
  const browL = FACE_ANCHORS.leftBrow;

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${FLIPPY_VIEWBOX.w} ${FLIPPY_VIEWBOX.h}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* STATIC BODY */}
      <path d={BODY_FILL_PINK} fill={FLIPPY_PINK} />
      <path d={BODY_OUTLINE} fill={FLIPPY_PLUM} />
      <path d={MOUTH_LIP} fill={FLIPPY_PLUM} />
      <path d={FACE_DETAIL} fill={FLIPPY_PLUM} />

      {/* SOURCE FACE: visible only on grin/tongue/gasp (eyes=base) or when
          mouth=base. Opacity snap, no tween. */}
      <path
        d={MOUTH_BASE}
        fill={FLIPPY_PLUM}
        style={{ opacity: showBaseMouth }}
      />
      <path
        d={EYE_RIGHT}
        fill={FLIPPY_PLUM}
        style={{ opacity: showBaseEyes }}
      />
      <path
        d={EYE_LEFT}
        fill={FLIPPY_PLUM}
        style={{ opacity: showBaseEyes }}
      />

      {/* OVERLAY EYES */}
      {/* Wide: big round pink whites + plum stroke. */}
      <g style={{ opacity: shape.eyes === "wide" ? 1 : 0 }}>
        <circle
          cx={right.cx}
          cy={right.cy}
          r={15}
          fill={FLIPPY_PINK}
          stroke={FLIPPY_PLUM}
          strokeWidth={3}
        />
        <circle
          cx={left.cx}
          cy={left.cy}
          r={15}
          fill={FLIPPY_PINK}
          stroke={FLIPPY_PLUM}
          strokeWidth={3}
        />
        <circle cx={right.cx} cy={right.cy} r={5} fill={FLIPPY_PLUM} />
        <circle cx={left.cx} cy={left.cy} r={5} fill={FLIPPY_PLUM} />
      </g>

      {/* Half-lidded: flatter ellipses. */}
      <g style={{ opacity: shape.eyes === "half" ? 1 : 0 }}>
        <ellipse
          cx={right.cx}
          cy={right.cy}
          rx={13}
          ry={5}
          fill={FLIPPY_PINK}
          stroke={FLIPPY_PLUM}
          strokeWidth={3}
        />
        <ellipse
          cx={left.cx}
          cy={left.cy}
          rx={13}
          ry={5}
          fill={FLIPPY_PINK}
          stroke={FLIPPY_PLUM}
          strokeWidth={3}
        />
        <circle cx={right.cx} cy={right.cy} r={3.5} fill={FLIPPY_PLUM} />
        <circle cx={left.cx} cy={left.cy} r={3.5} fill={FLIPPY_PLUM} />
      </g>

      {/* Squint: thin horizontal lines. */}
      <g style={{ opacity: shape.eyes === "squint" ? 1 : 0 }}>
        <path
          d={`M${right.cx - 12} ${right.cy} Q${right.cx} ${right.cy + 3} ${right.cx + 12} ${right.cy}`}
          stroke={FLIPPY_PLUM}
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={`M${left.cx - 12} ${left.cy} Q${left.cx} ${left.cy + 3} ${left.cx + 12} ${left.cy}`}
          stroke={FLIPPY_PLUM}
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* OVERLAY MOUTH */}
      {/* Smirk: one-corner curve. */}
      <g style={{ opacity: shape.mouth === "smirk" ? 1 : 0 }}>
        <path
          d={`M${mouth.cx - 18} ${mouth.cy + 4} Q${mouth.cx} ${mouth.cy + 10} ${mouth.cx + 22} ${mouth.cy - 8}`}
          stroke={FLIPPY_PLUM}
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Open: wide ellipse. */}
      <g style={{ opacity: shape.mouth === "open" ? 1 : 0 }}>
        <ellipse
          cx={mouth.cx}
          cy={mouth.cy + 2}
          rx={18}
          ry={11}
          fill={FLIPPY_PLUM}
        />
      </g>

      {/* Tongue: pink shape poking down. */}
      <g style={{ opacity: shape.mouth === "tongue" ? 1 : 0 }}>
        <path
          d={`M${mouth.cx - 22} ${mouth.cy - 4} Q${mouth.cx} ${mouth.cy + 6} ${mouth.cx + 22} ${mouth.cy - 4} L${mouth.cx + 14} ${mouth.cy + 18} Q${mouth.cx} ${mouth.cy + 28} ${mouth.cx - 14} ${mouth.cy + 18} Z`}
          fill={FLIPPY_PINK}
          stroke={FLIPPY_PLUM}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <path
          d={`M${mouth.cx} ${mouth.cy + 6} L${mouth.cx} ${mouth.cy + 22}`}
          stroke={FLIPPY_PLUM}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </g>

      {/* Gasp: small o. */}
      <g style={{ opacity: shape.mouth === "o" ? 1 : 0 }}>
        <ellipse
          cx={mouth.cx}
          cy={mouth.cy + 2}
          rx={7}
          ry={9}
          fill={FLIPPY_PLUM}
        />
      </g>

      {/* Tight: small flat curve. */}
      <g style={{ opacity: shape.mouth === "tight" ? 1 : 0 }}>
        <path
          d={`M${mouth.cx - 14} ${mouth.cy + 2} Q${mouth.cx} ${mouth.cy + 7} ${mouth.cx + 14} ${mouth.cy + 2}`}
          stroke={FLIPPY_PLUM}
          strokeWidth={3.5}
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Huge: big wide grin block. */}
      <g style={{ opacity: shape.mouth === "huge" ? 1 : 0 }}>
        <path
          d={`M${mouth.cx - 32} ${mouth.cy - 6} Q${mouth.cx} ${mouth.cy + 30} ${mouth.cx + 32} ${mouth.cy - 6} Q${mouth.cx} ${mouth.cy + 6} ${mouth.cx - 32} ${mouth.cy - 6} Z`}
          fill={FLIPPY_PLUM}
        />
      </g>

      {/* OVERLAY BROWS */}
      {/* Up: arched higher than default. */}
      <g style={{ opacity: shape.brows === "up" ? 1 : 0 }}>
        <path
          d={`M${browR.cx - 14} ${browR.cy} Q${browR.cx} ${browR.cy - 8} ${browR.cx + 14} ${browR.cy}`}
          stroke={FLIPPY_PLUM}
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={`M${browL.cx - 14} ${browL.cy} Q${browL.cx} ${browL.cy - 8} ${browL.cx + 14} ${browL.cy}`}
          stroke={FLIPPY_PLUM}
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Scrunched: angled down toward center. */}
      <g style={{ opacity: shape.brows === "scrunched" ? 1 : 0 }}>
        <path
          d={`M${browR.cx + 14} ${browR.cy - 4} L${browR.cx - 14} ${browR.cy + 4}`}
          stroke={FLIPPY_PLUM}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <path
          d={`M${browL.cx - 14} ${browL.cy - 4} L${browL.cx + 14} ${browL.cy + 4}`}
          stroke={FLIPPY_PLUM}
          strokeWidth={4}
          strokeLinecap="round"
        />
      </g>

      {/* Manic-style brow handled via shape.brows="up". */}

      {/* OVERLAY PUPILS: only render when base eyes are showing (grin/tongue/
          gasp). Sit over the source pupils and translate for darts. */}
      <motion.g
        style={{ opacity: showOverlayPupils, x: pupilDx, y: pupilDy }}
      >
        <circle cx={right.cx} cy={right.cy + 2} r={4.5} fill={FLIPPY_PLUM} />
        <circle cx={left.cx} cy={left.cy + 2} r={4.5} fill={FLIPPY_PLUM} />
      </motion.g>
    </svg>
  );
}
