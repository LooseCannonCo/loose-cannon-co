import { cn } from "@/lib/utils";

import styles from "./PrintHeadline.module.css";

export interface PrintHeadlineProps {
  /** Headline text. May include <br> for forced line breaks. */
  children: React.ReactNode;
  as?: "h1" | "h2" | "span" | "div";
  /** Consumer sets font-size here. */
  className?: string;
  /**
   * Opt in to the violet print-registration bleed. Off by default because at
   * display scale (statement tier and above) the offset duplicate reads as a
   * drop-shadow regardless of color. Only enable on smaller instances where
   * the offset stays subtle, e.g. the ClosingCTA section-title-tier headline.
   */
  bleed?: boolean;
}

/**
 * Display headline shared by page heroes and the ClosingCTA. Default render
 * is flat plum, matching the case study chapter headlines. Pass `bleed` to
 * layer the canonical violet registration offset behind the type (only safe
 * at smaller display sizes).
 */
export function PrintHeadline({
  children,
  as: Tag = "h2",
  className,
  bleed = false,
}: PrintHeadlineProps) {
  return (
    <Tag className={cn(styles.headline, "flippy-hide-behind", className)}>
      {bleed ? (
        <span className={styles.bleed} aria-hidden="true">
          {children}
        </span>
      ) : null}
      <span className={styles.ink}>{children}</span>
    </Tag>
  );
}
