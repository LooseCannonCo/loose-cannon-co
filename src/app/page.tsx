import { ClosingCTA } from "@/components/ClosingCTA/ClosingCTA";
import { Footer } from "@/components/Footer/Footer";
import HeroDeck from "@/components/HeroDeck/HeroDeck";
import { Nav } from "@/components/Nav/Nav";
import { Page } from "@/components/Page/Page";
import { SectionEyebrow } from "@/components/SectionEyebrow/SectionEyebrow";
import { WorkRow } from "@/components/WorkRow/WorkRow";
import { getHeroDeck } from "@/lib/heroDeck";
import { client } from "@/sanity/client";
import {
  getFeaturedCaseStudies,
  type CaseStudyListItem,
} from "@/sanity/queries/caseStudy";

import { HomeMotion } from "./HomeMotion";
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
  const [featured, deck] = await Promise.all([
    client.fetch<CaseStudyListItem[]>(getFeaturedCaseStudies),
    getHeroDeck(),
  ]);

  return (
    <Page>
      <Nav />
      <HomeMotion />

      {/* HERO — living press sheet: a randomly dealt card deck (Sanity-curated)
          with the headline + CTA on the left. Replaces the prior static
          headline-and-PNG hero. Its own Flippy was dropped on integration since
          the global cursor Flippy is already mounted in layout.tsx. */}
      <HeroDeck cards={deck} />

      {/* FEATURED WORK — uses .firstSection on top of .section so the gap
          from the hero is a sub-section break (72/40px), not a full chapter
          break (200/88px). Lets the visitor see hero + start of work on
          the first screen. */}
      <section className={`${styles.section} ${styles.firstSection}`}>
        <span className={styles.sidelabel} aria-hidden="true">
          Recent work
        </span>
        <SectionEyebrow>Recent receipts</SectionEyebrow>
        <h2 className={`${styles.sectionTitle} ${styles.rvf}`}>The work.</h2>
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
        <span className={styles.sidelabel} aria-hidden="true">
          The offer
        </span>
        <SectionEyebrow>What we do</SectionEyebrow>
        <h2 className={`${styles.sectionTitle} ${styles.rvf}`}>Three things.</h2>
        <div className={styles.servicesGrid}>
          {SERVICES.map((s) => (
            <div key={s.num} className={`${styles.serviceCol} ${styles.rv}`}>
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
