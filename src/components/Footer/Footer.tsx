import { BigFooterMark } from "@/components/BigFooterMark/BigFooterMark";
import { FooterCols } from "@/components/FooterCols/FooterCols";
import { FootMeta } from "@/components/FootMeta/FootMeta";

/** The full footer block: big mark + 4-col links + meta line. */
export function Footer() {
  return (
    <footer>
      <BigFooterMark />
      <FooterCols />
      <FootMeta />
    </footer>
  );
}
