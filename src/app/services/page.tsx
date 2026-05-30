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
  getAllCaseStudies,
  type CaseStudyListItem,
} from "@/sanity/queries/caseStudy";

import styles from "./page.module.css";

const PAID_DELIVERABLES =
  "Ad creative (static + video) · Creative testing · Campaign management · Scaling + reporting";

const EXPANSION = [
  {
    num: "02",
    title: "Social-first creative.",
    desc: "The always-on stuff. Organic content, social, the work that keeps you alive between campaigns. Made to be watched, not skipped.",
    deliverables:
      "Organic social · Content production · Community · Always-on creative",
  },
  {
    num: "03",
    title: "Brand systems.",
    desc: "The foundation. Identity, voice, the visual language that makes all of it cohere. Built when you're ready to scale what's working.",
    deliverables: "Identity · Visual systems · Voice + messaging · Guidelines",
  },
];

const HOW_IT_WORKS = [
  {
    num: "01",
    title: "We learn your offer.",
    desc: "What you sell, who buys it, why they should.",
  },
  {
    num: "02",
    title: "We make the creative.",
    desc: "Ads good enough that people forget they're ads.",
  },
  {
    num: "03",
    title: "We run it until it prints.",
    desc: "Test, scale, repeat. You watch the number go up.",
  },
];

export default async function ServicesPage() {
  const cases = await client.fetch<CaseStudyListItem[]>(getAllCaseStudies);
  const smolotov = cases.find((c) => c.slug === "smolotov");

  return (
    <Page>
      <Nav />

      {/* HERO */}
      <section className={styles.hero}>
        <Splatter count={4} excludeCenter />
        <div className={styles.heroContent}>
          <div className={styles.eyebrowRow}>
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.eyebrow}>Services</span>
          </div>
          <div className={styles.heroHeadlineWrap}>
            <PrintHeadline as="h1" className={styles.heroHeadline}>
              Ads that don&apos;t look like ads.
            </PrintHeadline>
            <span className={styles.heroLastLine}>
              <PrintHeadline as="span" className={styles.heroHeadline}>
                And convert anyway.
              </PrintHeadline>
              <Sticker
                text="Next level!"
                angle={6}
                variant="hero"
                className={styles.heroSticker}
              />
            </span>
          </div>
          <p className={styles.subhead}>
            We&apos;re a creative agency that runs paid social. The ads are
            good, so they work. Funny how that happens.
          </p>
          <div className={styles.ctaRow}>
            <Button href="/contact">Start a project</Button>
          </div>
        </div>
      </section>

      {/* 01: Paid social (the lead offer, gets the most vertical room) */}
      <section className={styles.section}>
        <div className={styles.eyebrowRow}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.eyebrow}>What we lead with</span>
        </div>
        <div className={styles.leadBlock}>
          <div className={styles.leadNum}>01</div>
          <h2 className={styles.leadTitle}>Paid social.</h2>
          <p className={styles.leadDesc}>
            Meta ads, mostly. We concept them, make them, run them, and test
            them until they print. Static, video, whatever stops the scroll.
            The kind of ads people don&apos;t realize are ads until
            they&apos;ve already clicked.
          </p>
          <div className={styles.deliverables}>{PAID_DELIVERABLES}</div>
        </div>
      </section>

      {/* Proof anchor: Smolotov */}
      <section className={styles.section}>
        <div className={styles.eyebrowRow}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.eyebrow}>The receipt</span>
        </div>
        {smolotov ? (
          <WorkRow
            index={0}
            showSticker={false}
            slug={smolotov.slug}
            client={smolotov.client}
            discipline={smolotov.discipline}
            year={smolotov.year}
            caseNumber={smolotov.caseNumber}
            prefix={smolotov.prefix}
            digits={smolotov.digits}
            suffix={smolotov.suffix}
            headline={smolotov.headline}
            coverImage={smolotov.coverImage ?? smolotov.posterImage}
          />
        ) : null}
      </section>

      {/* And once it's working: 02 + 03 */}
      <section className={styles.section}>
        <div className={styles.eyebrowRow}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.eyebrow}>And once it&apos;s working</span>
        </div>
        <div className={styles.expansionGrid}>
          {EXPANSION.map((s) => (
            <div key={s.num} className={styles.expCol}>
              <div className={styles.expNum}>{s.num}</div>
              <h3 className={styles.expTitle}>{s.title}</h3>
              <p className={styles.expDesc}>{s.desc}</p>
              <div className={styles.deliverables}>{s.deliverables}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.section}>
        <div className={styles.eyebrowRow}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.eyebrow}>How it works</span>
        </div>
        <h2 className={styles.sectionTitle}>Three steps.</h2>
        <div className={styles.howGrid}>
          {HOW_IT_WORKS.map((step) => (
            <div key={step.num} className={styles.howCol}>
              <div className={styles.howNum}>{step.num}</div>
              <h3 className={styles.howTitle}>{step.title}</h3>
              <p className={styles.howDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CLOSING */}
      <ClosingCTA
        headlineTop="Got something to sell?"
        headlineLast="Let's go."
        sticker={{ text: "Mic drop!", angle: -8 }}
        splatterSeed={5}
      />

      <Footer />
    </Page>
  );
}
