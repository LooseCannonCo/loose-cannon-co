"use client";

import { AnimatePresence, motion } from "framer-motion";

import styles from "./FlippyBubble.module.css";

export interface FlippyBubbleProps {
  text: string | null;
  /** Increments each time a new line should be shown; drives AnimatePresence. */
  bubbleKey: number;
  /** Skip fade transitions (reduced-motion mode). */
  instant?: boolean;
}

export function FlippyBubble({
  text,
  bubbleKey,
  instant = false,
}: FlippyBubbleProps) {
  const duration = instant ? 0 : 0.2;
  return (
    <AnimatePresence>
      {text ? (
        <motion.div
          key={bubbleKey}
          className={styles.bubble}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
        >
          <span className={styles.text}>{text}</span>
          <span className={styles.tail} aria-hidden="true" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
