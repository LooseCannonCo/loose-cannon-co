import { cn } from "@/lib/utils";

import styles from "./Button.module.css";

export interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary";
  className?: string;
}

/** LC primary CTA: solid plum, cream text, tight corners, arrow that slides and
 *  a subtle lift on hover. Renders an anchor (used for navigation CTAs). */
export function Button({
  href,
  children,
  variant = "primary",
  className,
}: ButtonProps) {
  return (
    <a href={href} className={cn(styles.button, styles[variant], className)}>
      <span>{children}</span>
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </a>
  );
}
