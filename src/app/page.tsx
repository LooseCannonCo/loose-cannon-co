import { Button } from "@/components/Button/Button";
import { ClosingCTA } from "@/components/ClosingCTA/ClosingCTA";
import { Footer } from "@/components/Footer/Footer";
import { Nav } from "@/components/Nav/Nav";
import { Page } from "@/components/Page/Page";
import { PrintHeadline } from "@/components/PrintHeadline/PrintHeadline";
import { SectionEyebrow } from "@/components/SectionEyebrow/SectionEyebrow";
import { Splatter } from "@/components/Splatter/Splatter";
import { Sticker } from "@/components/Sticker/Sticker";
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

      {/* HERO */}
      <section className={styles.hero}>
        <Splatter count={4} excludeCenter />
        <div className={styles.heroContent}>
          <SectionEyebrow>Studio</SectionEyebrow>
          <div className={styles.heroHeadlineWrap}>
            <PrintHeadline as="h1" className={styles.heroHeadline}>
              Social-first creative.
            </PrintHeadline>
            <span className={styles.heroLastLine}>
              <PrintHeadline as="span" className={styles.heroHeadline}>
                Built to actually perform.
              </PrintHeadline>
              <Sticker
                text="Banger!"
                angle={6}
                variant="hero"
                className={styles.heroSticker}
              />
            </span>
          </div>
          <p className={styles.subhead}>
            We make social campaigns and brand systems for companies that want
            their content to do something.
          </p>
          <div className={styles.ctaRow}>
            <Button href="/contact">Start a project</Button>
          </div>
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className={styles.section}>
        <SectionEyebrow>Recent receipts</SectionEyebrow>
        <h2 className={styles.sectionTitle}>The work.</h2>
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
        sticker={{ text: "Off the charts!", angle: -8 }}
      />

      <Footer />
    </Page>
  );
}
