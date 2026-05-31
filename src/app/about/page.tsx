import Image from "next/image";

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

//   = non-breaking space, used on the trailing word pair to prevent a
// one-word widow at the end of each paragraph.
const NOAH_BIO =
  "The world's best creative mind this world has ever seen in the world. Noah, for some reason, is good at creative stuff. But other than that, he's pretty much worthless. A true idiot savant. He started as a graphic designer 15+ years ago but is now a one-man creative army. Don't mess with him.";

const BRIANA_BIO =
  "Best yapper in the bizz. Briana can market anything. She's literally obsessed with Nicolas Cage, and that's what makes her so good at her job. Anything she touches goes viral. She's been in the game for 10+ years, marketing all sorts of crap that you've probably bought at one point or another.";

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
          <SectionEyebrow>About</SectionEyebrow>
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
        <SectionEyebrow>The people</SectionEyebrow>
        <h2 className={styles.sectionTitle}>Two founders.</h2>
        <div className={styles.foundersGrid}>
          <div className={styles.founderCol}>
            <div className={styles.founderHeadshot}>
              <Image
                src="/team/noah.jpg"
                alt="Noah Charnow"
                fill
                sizes="(max-width: 900px) 80vw, 320px"
                className={styles.founderHeadshotImg}
              />
            </div>
            <div className={styles.founderNum}>01</div>
            <h3 className={styles.founderName}>
              Noah&nbsp;(Brand&nbsp;Daddy)&nbsp;Charnow
            </h3>
            <div className={styles.founderRole}>
              Creative Director of &quot;What If We Just Did This?&quot;
            </div>
            <p className={styles.founderBio}>{NOAH_BIO}</p>
          </div>
          <div className={styles.founderCol}>
            <div className={styles.founderHeadshot}>
              <Image
                src="/team/briana.jpg"
                alt="Briana Brugh"
                fill
                sizes="(max-width: 900px) 80vw, 320px"
                className={styles.founderHeadshotImg}
              />
            </div>
            <div className={styles.founderNum}>02</div>
            <h3 className={styles.founderName}>
              Briana&nbsp;(Yapper)&nbsp;Brugh
            </h3>
            <div className={styles.founderRole}>
              Head of Strategies That Actually Work
            </div>
            <p className={styles.founderBio}>{BRIANA_BIO}</p>
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section className={styles.section}>
        <SectionEyebrow>Recent receipts</SectionEyebrow>
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
              coverImage={c.coverImage ?? c.posterImage}
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
