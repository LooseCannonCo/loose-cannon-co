import "@/styles/reveal.css";

import { cn } from "@/lib/utils";

import { RevealMount } from "./RevealMount";
import styles from "./Page.module.css";

export interface PageProps {
  children: React.ReactNode;
  className?: string;
}

/** Top-level page wrapper: centered 1320px column, page padding, pink canvas. */
export function Page({ children, className }: PageProps) {
  return (
    <div className={cn(styles.page, className)}>
      <RevealMount />
      {children}
    </div>
  );
}
