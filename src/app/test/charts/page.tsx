import { BarComparison } from "@/components/BarComparison/BarComparison";
import { Page } from "@/components/Page/Page";
import { RingFill } from "@/components/RingFill/RingFill";

import styles from "./page.module.css";

/** QA harness for the chart primitives. Each animates on entering the viewport
 *  (print registration: base + violet together, plum chases 220ms behind). */
export default function ChartsTestPage() {
  return (
    <Page>
      <h1 className={styles.title}>Chart primitives QA</h1>
      <div className={styles.grid}>
        <div className={styles.cell}>
          <div className={styles.vis}>
            <RingFill percent={92} />
          </div>
          <p className={styles.cap}>Ring fill, 92% (engagement)</p>
        </div>
        <div className={styles.cell}>
          <div className={styles.vis}>
            <BarComparison prior={1} current={3.4} />
          </div>
          <p className={styles.cap}>Bar comparison, prior vs current (3.4x)</p>
        </div>
        <div className={styles.cell}>
          <div className={styles.vis}>
            <RingFill percent={47} />
          </div>
          <p className={styles.cap}>Ring fill, 47% (conversion lift)</p>
        </div>
      </div>
    </Page>
  );
}
