"use client";

import { AnimatePresence, motion } from "framer-motion";

import styles from "./FlippyBubble.module.css";

export interface FlippyBubbleProps {
  text: string | null;
  /** Increments each time a new line should be shown; drives AnimatePresence. */
  bubbleKey: number;
  /** Skip animations (reduced-motion). */
  instant?: boolean;
}

export function FlippyBubble({
  text,
  bubbleKey,
  instant = false,
}: FlippyBubbleProps) {
  return (
    <AnimatePresence>
      {text ? (
        <motion.div
          key={bubbleKey}
          className={styles.bubble}
          initial={
            instant
              ? { opacity: 1, scale: 1, rotate: 0 }
              : { opacity: 0, scale: 0.6, rotate: -3 }
          }
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={
            instant
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.85, transition: { duration: 0.2 } }
          }
          transition={
            instant
              ? { duration: 0 }
              : {
                  // Underdamped spring so scale overshoots ~1.08 before settling.
                  // Damping ratio ≈ 0.33 (damping 11, stiffness 460, mass 0.6).
                  type: "spring",
                  stiffness: 460,
                  damping: 11,
                  mass: 0.6,
                }
          }
        >
          <motion.span
            className={styles.text}
            animate={instant ? undefined : { rotate: [0, 1, 0, -1, 0] }}
            transition={
              instant
                ? undefined
                : { duration: 3.6, repeat: Infinity, ease: "easeInOut" }
            }
          >
            {text}
          </motion.span>
          <span className={styles.tailOutline} aria-hidden="true" />
          <span className={styles.tailFill} aria-hidden="true" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
