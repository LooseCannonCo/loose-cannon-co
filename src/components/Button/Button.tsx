import { cn } from "@/lib/utils";

import styles from "./Button.module.css";

export interface ButtonProps {
  /** Anchor target. Omit when rendering as a form submit button. */
  href?: string;
  /** When set (and no `href`), renders a <button> with this type. */
  type?: "submit" | "button" | "reset";
  children: React.ReactNode;
  variant?: "primary";
  className?: string;
}

/** LC primary CTA: solid plum, cream text, tight corners, arrow that slides and
 *  a subtle lift on hover. Renders an anchor when `href` is provided (default
 *  navigation CTA), or a real <button> when `type` is provided (form submit). */
export function Button({
  href,
  type,
  children,
  variant = "primary",
  className,
}: ButtonProps) {
  const inner = (
    <>
      <span>{children}</span>
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </>
  );
  const klass = cn(styles.button, styles[variant], className);
  if (href) {
    return (
      <a href={href} className={klass} data-flippy-react="cta">
        {inner}
      </a>
    );
  }
  return (
    <button type={type ?? "button"} className={klass} data-flippy-react="cta">
      {inner}
    </button>
  );
}
