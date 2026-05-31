import { cn } from "@/lib/utils";

import styles from "./SectionEyebrow.module.css";

export interface SectionEyebrowProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Canonical section eyebrow: square plum marker + 11px DM Sans 600 uppercase
 * text. Single source of truth for case study section openings so every
 * chapter on /work/[slug] reads as the same pattern, top-left of each
 * section. Tagged data-reveal so it participates in the section's child
 * stagger when the section enters the viewport.
 */
export function SectionEyebrow({ children, className }: SectionEyebrowProps) {
  return (
    <div className={cn(styles.row, className)} data-reveal>
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.text}>{children}</span>
    </div>
  );
}
