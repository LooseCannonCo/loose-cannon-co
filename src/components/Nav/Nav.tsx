import styles from "./Nav.module.css";

export interface NavProps {
  /**
   * Destination for the "← Back to work" link. Omit on the homepage — the link
   * is then hidden and the centered brand stays centered (grid keeps its cell).
   */
  backHref?: string;
}

const LINKS = ["Work", "Services", "About", "Shop", "Contact"];

export function Nav({ backHref }: NavProps) {
  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        {backHref ? (
          <a href={backHref}>{"←  Back to work"}</a>
        ) : null}
      </div>
      <div className={styles.center}>Loose Cannon Co.</div>
      <div className={styles.right}>
        {LINKS.map((label) => (
          <a key={label} href="#">
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
