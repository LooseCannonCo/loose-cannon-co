import Image from "next/image";

import { Button } from "@/components/Button/Button";
import { Footer } from "@/components/Footer/Footer";
import { Nav } from "@/components/Nav/Nav";
import { Page } from "@/components/Page/Page";
import { PrintHeadline } from "@/components/PrintHeadline/PrintHeadline";
import { SectionEyebrow } from "@/components/SectionEyebrow/SectionEyebrow";
import { Sticker } from "@/components/Sticker/Sticker";

import styles from "./page.module.css";

// Marquee phrases. Rendered TWICE back-to-back in the track so the
// translateX(-50%) loop lands exactly on the seam and reads as continuous.
const MARQUEE_PHRASES = [
  "Loud, committed, a little unhinged on purpose",
  "We want Nicolas Cage as a client",
  "Social that doesn’t suck",
  "Strategy under the hood, attitude on the surface",
];

/**
 * /about — the zine spread, ported faithfully from the locked design
 * reference (loose-cannon-about-zine-v7.html) but rebuilt native to this
 * codebase: shared Nav / Footer / Button / Sticker / PrintHeadline /
 * SectionEyebrow primitives, locked color + font tokens, no mockup inline
 * hex or font strings.
 *
 * STEP 1 of 2: static structure, styling, real images only. The zine's load
 * + scroll choreography (hero bleed settle, marquee scroll, .par parallax,
 * per-section reveal staggers) is deferred to step 2, so the marquee renders
 * static and the violet misregistration sits at its canonical static offset.
 */
export default function AboutPage() {
  return (
    <Page>
      <Nav />

      {/* HERO — right-anchored headline that bleeds off the left, one weight,
          sentence case, the reversed g, two-line byline, faint ampersand. */}
      <header className={styles.hero}>
        <div className={styles.topfur}>
          <span className={styles.fur}>About // No. 001</span>
          <span className={styles.fur}>
            Loose Cannon Co. // est. on a Cage obsession
          </span>
        </div>
        <div className={styles.heroStage}>
          <span className={styles.bigAmp} aria-hidden="true">
            &amp;
          </span>
          {/* Two SEPARATE lines, not one string the browser wraps. Each line
              is its own PrintHeadline, content-sized and right-anchored by the
              flex wrapper so the fronts bleed off the LEFT. nowrap lives on
              .heroLineText (the span that truly holds the text) so it wins the
              cascade, and "agency" is wrapped in its own nowrap span so the
              reversed g can never split off. */}
          <div className={styles.heroHeadlineWrap}>
            <PrintHeadline as="h1" bleed className={styles.heroHeadline}>
              <span className={styles.heroLineText}>
                We started an{" "}
                <span className={styles.heroWord}>
                  a<span className={styles.flip}>g</span>ency
                </span>
              </span>
            </PrintHeadline>
            <PrintHeadline as="div" bleed className={styles.heroHeadline}>
              <span className={styles.heroLineText}>
                because of Nicolas Cage.
              </span>
            </PrintHeadline>
          </div>
          <p className={styles.byline}>
            By Briana Brugh and Noah Charnow.
            <br />
            We are only half&nbsp;joking.
          </p>
        </div>
      </header>

      {/* MARQUEE — slightly crooked ribbon, continuous left scroll. The track
          holds two copies of the phrase set so the -50% loop is seamless. */}
      <div className={styles.ribbonWrap} aria-hidden="true">
        <div className={styles.ribbon}>
          <div className={styles.ribbonTrack}>
            {[...MARQUEE_PHRASES, ...MARQUEE_PHRASES].map((phrase, i) => (
              <span key={i} className={styles.ribbonItem}>
                {phrase}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 01 — HOW WE MET */}
      <section className={styles.section}>
        <div className={styles.closingRow}>
          <span className={styles.side}>How we met</span>
          <div className={styles.closingContent}>
            <div className={styles.secline}>
              <span className={styles.secnum}>01</span>
              <SectionEyebrow className={styles.secEyebrow}>
                How we met
              </SectionEyebrow>
            </div>
            <div className={styles.origin}>
              <div>
                <h2 className={styles.originHead}>
                  It started with a drawing of Nic.
                </h2>
                <div className={styles.zinecols}>
              <p>
                Briana would not stop posting about Nicolas Cage. So Noah drew
                him a portrait and sent it to her, no charge, the way you do
                when you actually mean it.
              </p>
              <p>
                She said it was glorious. That was the entire interview. No
                deck, no five year plan, no positioning workshop. Just a drawing
                of Nic and two people who meant the thing other agencies put on
                a values slide.
              </p>
              <p>
                Loose Cannon Co. did not start as a business. It started as a
                bit that refused to stop being funny. Then it started making
                real work. Then it was a company. We kept the bit.
              </p>
            </div>
            <span className={styles.docLabel}>p. 01 // the founding document</span>
          </div>
              <div className={styles.artifact}>
                {/* Full artwork, natural 1:1 aspect, no crop, full color (no
                    halftone). width/height keep next/image's intrinsic ratio;
                    CSS sizes it to the column with height auto. */}
                <figure className={styles.artifactFigure}>
                  <Image
                    src="/Cage_art.jpeg"
                    alt="Noah's portrait of Nicolas Cage, the drawing that started Loose Cannon Co."
                    width={1024}
                    height={1024}
                    sizes="(max-width: 900px) 90vw, 580px"
                    className={styles.artifactImg}
                  />
                </figure>
                <div className={styles.pull}>
                  <p className={styles.pullQuote}>
                    The second I knew Noah was a national&nbsp;treasure.
                  </p>
                  <p className={styles.pullAttr}>Briana Brugh, co-founder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — OUR QUALIFICATIONS */}
      <section className={styles.section}>
        <div className={styles.closingRow}>
          <span className={styles.side}>Our qualifications</span>
          <div className={styles.closingContent}>
            <div className={styles.secline}>
              <span className={styles.secnum}>02</span>
              <SectionEyebrow className={styles.secEyebrow}>
                Credentials, such as they are
              </SectionEyebrow>
            </div>
            <div className={styles.headrow}>
              <h2 className={styles.qualsHead}>Our qualifications.</h2>
              <Sticker text="Certified feral." variant="corner" angle={-5} />
            </div>
            <div className={styles.founders}>
              <article className={styles.founder}>
                {/* B&W by default, animates to full color on hover. No
                    halftone screen on the headshots. */}
                <div className={styles.frame}>
                  <figure className={styles.headshot}>
                    <Image
                      src="/team/briana.jpg"
                      alt="Briana Brugh"
                      fill
                      sizes="(max-width: 900px) 90vw, 600px"
                      className={styles.headshotImg}
                    />
                  </figure>
                  <div className={styles.film}>Gone in 60 Seconds.</div>
                </div>
                <div className={styles.founderMeta}>
                  <div className={styles.role}>
                    Co-founder, head of strategies
                  </div>
                  <div className={styles.name}>Briana Brugh</div>
                  <p className={styles.why}>
                    Can talk about the Eleanor handoff for longer than the movie
                    actually runs.
                  </p>
                </div>
              </article>
              <article className={styles.founder}>
                <div className={styles.frame}>
                  <figure className={styles.headshot}>
                    <Image
                      src="/team/noah.jpg"
                      alt="Noah Charnow"
                      fill
                      sizes="(max-width: 900px) 90vw, 600px"
                      className={styles.headshotImg}
                    />
                  </figure>
                  <div className={styles.film}>Wild at Heart.</div>
                </div>
                <div className={styles.founderMeta}>
                  <div className={styles.role}>
                    Co-founder, creative director
                  </div>
                  <div className={styles.name}>Noah Charnow</div>
                  <p className={styles.why}>
                    Owns the snakeskin jacket argument and has no plans to lose
                    it.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO — asymmetric zine spread on the dark surface. */}
      <section className={styles.manifesto}>
        <span className={styles.manGlyph} aria-hidden="true">
          ?
        </span>
        <div className={styles.manInner}>
          <div className={styles.closingRow}>
            <span className={styles.side}>What this actually means</span>
            <div className={styles.closingContent}>
              <h2 className={styles.manHead}>
                We started an agency to one day run Nicolas Cage&apos;s social.
              </h2>
              <div className={styles.manLower}>
                <div className={styles.manDecided}>
                  He will be a client. We have decided this. He has not been
                  consulted.
                </div>
                <div className={styles.manAside}>
                  <span className={styles.manKicker}>
                    Also, we had nothing else to do.
                  </span>
                  <p className={styles.manBody}>
                    We named the agency Loose Cannon Co. because the other
                    options on the table were Ben Dover Studio and Seymour Buttz
                    Media. So we went with Loose Cannon Co. instead.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BRIDGE — small right-set pivot line on the light surface. */}
      <section className={styles.bridge}>
        <div className={styles.closingRow}>
          <span className={styles.side}>Meanwhile, for you</span>
          <div className={styles.bridgeContent}>
            <p className={styles.bridgeLine}>
              Until then we aim the same energy at brands tired of looking like
              everyone&nbsp;else.
            </p>
          </div>
        </div>
      </section>

      {/* CTA — big bleeding headline, button, email. No decorative arrow,
          no account-managers block. */}
      <section className={styles.cta}>
        <div className={styles.manInner}>
          <div className={styles.closingRow}>
            <span className={styles.side}>Last thing</span>
            <div className={styles.closingContent}>
              <PrintHeadline as="h2" bleed className={styles.ctaHead}>
                Got a brand that needs to do&nbsp;something?
              </PrintHeadline>
              <div className={styles.ctaCluster}>
                <Button href="/contact" variant="onDark">
                  Start a project
                </Button>
                <p className={styles.ctaEmail}>
                  Or just yell at us. seymourbuttz@loosecannon.co
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </Page>
  );
}
