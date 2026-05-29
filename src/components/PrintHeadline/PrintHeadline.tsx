import { cn } from "@/lib/utils";

import styles from "./PrintHeadline.module.css";

export interface PrintHeadlineProps {
  /** Headline text. May include <br> for forced line breaks. */
  children: React.ReactNode;
  as?: "h1" | "h2" | "span" | "div";
  /** Consumer sets font-size here (the component owns the bleed treatment). */
  className?: string;
}

/**
 * Display headline with the print-registration treatment: a solid violet copy
 * offset behind the solid plum word (translate 1.5px 1px, 0.62 opacity). Solid
 * fills, not a stroke or outline. Same pattern as the /work "Work." header.
 */
export function PrintHeadline({
  children,
  as: Tag = "h2",
  className,
}: PrintHeadlineProps) {
  return (
    <Tag className={cn(styles.headline, "flippy-hide-behind", className)}>
      <span className={styles.bleed} aria-hidden="true">
        {children}
      </span>
      <span className={styles.ink}>{children}</span>
    </Tag>
  );
}
