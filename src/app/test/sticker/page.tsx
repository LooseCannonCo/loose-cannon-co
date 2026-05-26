import { Sticker } from "@/components/Sticker/Sticker";

import styles from "./page.module.css";

/**
 * Interactive QA harness for <Sticker>. Hover within 180px of a sticker to feel
 * the magnetic pull; click one to fire the slam + halftone shrapnel.
 */
export default function StickerTestPage() {
  return (
    <main className={styles.wrap}>
      <h1 className={styles.title}>Sticker QA</h1>
      <p className={styles.hint}>
        Hover near a sticker to pull it. Click one to slam + spawn shrapnel.
      </p>
      <div className={styles.grid}>
        <Sticker text="Banger!" angle={-11} variant="hero" />
        <Sticker text="Mic drop!" angle={8} variant="mic" />
        <Sticker text="Off the charts!" angle={-4} variant="hero" />
        <Sticker text="Next level!" angle={6} variant="corner" />
      </div>
    </main>
  );
}
