import { cn } from "@/lib/utils";

import styles from "./Section.module.css";

export interface SectionProps {
  /** Optional title block (eyebrow + heading + intro), rendered in the
   *  1.1fr / 1.4fr grid above the section body and revealed on scroll. */
  titleBlock?: React.ReactNode;
  /** Adds bottom padding — use on the final section before the footer. */
  last?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Standard section wrapper. Marks itself as a reveal section so useReveal()
 * staggers any `[data-reveal]` descendants when it scrolls into view.
 */
export function Section({
  titleBlock,
  last = false,
  className,
  children,
}: SectionProps) {
  return (
    <section
      data-reveal-section
      className={cn(styles.section, last && styles.last, className)}
    >
      {titleBlock ? (
        <div className={styles.titleBlock} data-reveal>
          {titleBlock}
        </div>
      ) : null}
      {children}
    </section>
  );
}
