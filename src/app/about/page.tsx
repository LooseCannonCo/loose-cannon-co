import { Button } from "@/components/Button/Button";
import { ClosingCTA } from "@/components/ClosingCTA/ClosingCTA";
import { Footer } from "@/components/Footer/Footer";
import { Nav } from "@/components/Nav/Nav";
import { Page } from "@/components/Page/Page";
import { PrintHeadline } from "@/components/PrintHeadline/PrintHeadline";
import { Splatter } from "@/components/Splatter/Splatter";
import { Sticker } from "@/components/Sticker/Sticker";
import { WorkRow } from "@/components/WorkRow/WorkRow";
import { client } from "@/sanity/client";
import {
  getFeaturedCaseStudies,
  type CaseStudyListItem,
} from "@/sanity/queries/caseStudy";

import styles from "./page.module.css";

const NOAH_BIO =
  "Fifteen years of brand and creative direction at Fitbit, Google, Huckberry, Heath Ceramics, Chrome Industries, and Sol Republic. Runs the creative side of Loose Cannon. The parts that have to look good are his.";

// Placeholder. Noah finalizes.
const BRIANA_BIO =
  "[Bio placeholder. One paragraph in the same voice as Noah's bio. Cover where she's worked, what she runs at Loose Cannon, and why the paid social side is hers. Noah to finalize.]";

export default async function AboutPage() {
  const featured =
    await client.fetch<CaseStudyListItem[]>(getFeaturedCaseStudies);

  return (
    <Page>
      <Nav />

      {/* HERO */}
      <section className={styles.hero}>
        <Splatter count={4} excludeCenter />
        <div className={styles.heroContent}>
          <div className={styles.eyebrowRow}>
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.eyebrow}>About</span>
          </div>
          <div className={styles.heroHeadlineWrap}>
            <PrintHeadline as="h1" className={styles.heroHeadline}>
              Small on purpose.
            </PrintHeadline>
            <span className={styles.heroLastLine}>
              <PrintHeadline as="span" className={styles.heroHeadline}>
                Senior by default.
              </PrintHeadline>
              <Sticker
                text="Are you kidding?!"
                angle={6}
                variant="hero"
                className={styles.heroSticker}
              />
            </span>
          </div>
          <p className={styles.subhead}>
            Loose Cannon Co. is Noah and Briana. Two senior creatives, one small
            agency, no middle layer.
          </p>
          <div className={styles.ctaRow}>
            <Button href="/contact">Start a project</Button>
          </div>
        </div>
      </section>

      {/* FOUNDERS */}
      <section className={styles.section}>
        <div className={styles.eyebrowRow}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.eyebrow}>The people</span>
        </div>
        <h2 className={styles.sectionTitle}>Two founders.</h2>
        <div className={styles.foundersGrid}>
          <div className={styles.founderCol}>
            <div className={styles.founderNum}>01</div>
            <h3 className={styles.founderName}>Noah Charnow.</h3>
            <div className={styles.founderRole}>
              Creative direction · Brand systems
            </div>
            <p className={styles.founderBio}>{NOAH_BIO}</p>
          </div>
          <div className={styles.founderCol}>
            <div className={styles.founderNum}>02</div>
            <h3 className={styles.founderName}>Briana Brugh.</h3>
            <div className={styles.founderRole}>
              Performance creative · Paid social
            </div>
            <p className={styles.founderBio}>{BRIANA_BIO}</p>
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section className={styles.section}>
        <div className={styles.eyebrowRow}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.eyebrow}>Recent receipts</span>
        </div>
        <h2 className={styles.sectionTitle}>The work that ran.</h2>
        <div className={styles.workList}>
          {featured.map((c, i) => (
            <WorkRow
              key={c.slug}
              index={i}
              showSticker={false}
              slug={c.slug}
              client={c.client}
              discipline={c.discipline}
              year={c.year}
              caseNumber={c.caseNumber}
              prefix={c.prefix}
              digits={c.digits}
              suffix={c.suffix}
              headline={c.headline}
            />
          ))}
        </div>
        <div className={styles.linkRow}>
          <a className={styles.inlineLink} href="/work">
            See all work <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      {/* CLOSING */}
      <ClosingCTA
        headlineTop="Ready to skip the middle layer?"
        headlineLast="Let's go."
        sticker={{ text: "Lost it!", angle: -8 }}
        splatterSeed={9}
      />

      <Footer />
    </Page>
  );
}
