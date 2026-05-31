import Link from "next/link";

import styles from "./BackLink.module.css";

export interface BackLinkProps {
  href: string;
  label?: string;
}

/**
 * Standalone contextual back link for case study pages. Renders in a slim
 * row directly below the global nav and above the metadata strip. Styled
 * lighter and smaller than nav links so it reads as a return action, not a
 * nav destination.
 */
export function BackLink({ href, label = "Back to work" }: BackLinkProps) {
  return (
    <div className={styles.row}>
      <Link href={href} className={styles.back}>
        <span className={styles.arrow} aria-hidden="true">
          ←
        </span>
        {label}
      </Link>
    </div>
  );
}
