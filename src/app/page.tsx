import { Button } from "@/components/Button/Button";
import { ClosingCTA } from "@/components/ClosingCTA/ClosingCTA";
import { Footer } from "@/components/Footer/Footer";
import { Nav } from "@/components/Nav/Nav";
import { Page } from "@/components/Page/Page";
import { SectionEyebrow } from "@/components/SectionEyebrow/SectionEyebrow";
import { WorkRow } from "@/components/WorkRow/WorkRow";
import { client } from "@/sanity/client";
import {
  getFeaturedCaseStudies,
  type CaseStudyListItem,
} from "@/sanity/queries/caseStudy";

import styles from "./page.module.css";

const SERVICES = [
  {
    num: "01",
    title: "Social-first creative.",
    desc: "Posts, content, campaigns that actually move.",
  },
  {
    num: "02",
    title: "Brand systems.",
    desc: "Identity, voice, visual languages built to ship.",
  },
  {
    num: "03",
    title: "Campaigns.",
    desc: "Integrated work across paid, organic, and earned.",
  },
];

export default async function Home() {
  const featured =
    await client.fetch<CaseStudyListItem[]>(getFeaturedCaseStudies);

  return (
    <Page>
      <Nav />

      {/* HERO — static launch layout. Asymmetric grid: headline + support +
          CTA on the left, transparent PNG of work on the right, sized larger
          than the text block and bled past the page padding so it reads
          unframed on the pink canvas. No reel, no video, no autoplay. */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroLeft}>
            <h1 className={`${styles.heroHeadline} flippy-hide-behind`}>
              Social that doesn&apos;t&nbsp;suck.
            </h1>
            <p className={styles.heroSupport}>
              Social-first creative for brands tired of looking like
              everyone&nbsp;else.
            </p>
            <div className={styles.heroCta}>
              <Button href="/work">See the work</Button>
            </div>
          </div>
          <div className={styles.heroImageWrap}>
            {/* Transparent PNG, composites onto the pink canvas with no frame
                or card behind it. eager + high fetch priority because this is
                the above-the-fold LCP candidate. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/lc-home-hero-work.png"
              alt=""
              className={styles.heroImage}
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      {/* FEATURED WORK — uses .firstSection on top of .section so the gap
          from the hero is a sub-section break (72/40px), not a full chapter
          break (200/88px). Lets the visitor see hero + start of work on
          the first screen. */}
      <section className={`${styles.section} ${styles.firstSection}`}>
        <SectionEyebrow>Recent receipts</SectionEyebrow>
        <h2 className={styles.sectionTitle}>The work.</h2>
        <div className={styles.workList}>
          {featured.map((c) => (
            <WorkRow
              key={c.slug}
              slug={c.slug}
              client={c.client}
              discipline={c.discipline}
              year={c.year}
              headline={c.headline}
              coverImage={c.coverImage ?? c.posterImage}
            />
          ))}
        </div>
        <div className={styles.linkRow}>
          <a className={styles.inlineLink} href="/work">
            See all work{" "}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      {/* SERVICES */}
      <section className={styles.section}>
        <SectionEyebrow>What we do</SectionEyebrow>
        <h2 className={styles.sectionTitle}>Three things.</h2>
        <div className={styles.servicesGrid}>
          {SERVICES.map((s) => (
            <div key={s.num} className={styles.serviceCol}>
              <div className={styles.serviceNum}>{s.num}</div>
              <h3 className={styles.serviceTitle}>{s.title}</h3>
              <p className={styles.serviceDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
        <div className={styles.linkRow}>
          <a className={styles.inlineLink} href="/services">
            See services{" "}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <ClosingCTA
        headlineTop={
          <>
            Got a brand that needs
            <br />
            to do something?
          </>
        }
        headlineLast="Let's go."
      />

      <Footer />
    </Page>
  );
}
