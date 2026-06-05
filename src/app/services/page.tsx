import { Button } from "@/components/Button/Button";
import { Footer } from "@/components/Footer/Footer";
import { Nav } from "@/components/Nav/Nav";
import { Page } from "@/components/Page/Page";
import { SectionEyebrow } from "@/components/SectionEyebrow/SectionEyebrow";
import { cn } from "@/lib/utils";

import { ServicesMotion } from "./ServicesMotion";
import styles from "./page.module.css";

/**
 * /services — the zine spread, ported faithfully from the locked design
 * reference (loose-cannon-services-zine-v14.html) and rebuilt native to this
 * codebase: shared Nav / Footer / Button / SectionEyebrow primitives, locked
 * color + font tokens, no mockup inline hex or font strings.
 *
 * The reference's three interactions (hero register on load, proof count-up,
 * step stamp-in) and its generic .rv / .rvf reveals run in ServicesMotion, the
 * page's client IntersectionObserver mount.
 *
 * The proof block is hardcoded marketing copy (the reference dropped the
 * Sanity-driven Smolotov WorkRow in favor of the count-up receipt), so this
 * page no longer fetches case studies. All presentational copy is verbatim
 * from the reference.
 */

// All copy verbatim from the reference. Held as constants where it carries
// apostrophes so it renders through {} (no JSX unescaped-entity churn).
const SUB =
  "We're a creative agency that runs paid social. The ads are good, so they work. Funny how that happens.";

const PAID_P1 =
  "Meta ads, mostly. We concept them, make them, run them, and test them until they print. Static, video, whatever stops the scroll.";
const PAID_P2 =
  "The kind of ads people don't realize are ads until they have already clicked. No house style stamped on top. It looks like the feed, it just works harder.";
const PAID_TAGS =
  "Ad creative (static + video) · Creative testing · Campaign management · Scaling + reporting";
const PAID_FOOTNOTE = "P. 01 // The thing you are actually hiring us for";

const PROOF_PRE = "Smolotov started at 27 likes.";
const PROOF_POST = "views. In five months.";

const EXPANSION = [
  {
    num: "02",
    numRot: "rotate(2.5deg)",
    eyebrow: "The always-on",
    title: "Social-first creative.",
    titleRot: "rotate(1.2deg)",
    desc: "The always-on stuff. Organic content, social, the work that keeps you alive between campaigns. Made to be watched, not skipped.",
    tags: "Organic social · Content production · Community · Always-on creative",
  },
  {
    num: "03",
    numRot: "rotate(-2deg)",
    eyebrow: "The foundation",
    title: "Brand systems.",
    titleRot: "rotate(-1deg)",
    desc: "The foundation. Identity, voice, the visual language that makes all of it cohere. Built when you are ready to scale what's working.",
    tags: "Identity · Visual systems · Voice + messaging · Guidelines",
  },
];

const STEPS = [
  {
    cls: "l1",
    line: "We learn your offer.",
    cap: "What you sell, who buys it, why they should.",
  },
  {
    cls: "l2",
    line: "We make the creative.",
    cap: "Ads good enough that people forget they're ads.",
  },
  {
    cls: "l3",
    line: "We run it until it prints.",
    cap: "Test, scale, repeat. You watch the number go up.",
  },
] as const;

export default function ServicesPage() {
  return (
    <Page>
      <Nav />
      <ServicesMotion />

      {/* MASTHEAD — same pattern as About's "About // No. 001" line. */}
      <div className={styles.masthead}>
        <span className={styles.fur}>Services // No. 002</span>
        <span className={cn(styles.fur, styles.furR)}>
          Loose Cannon Co. // What we do all day
        </span>
      </div>

      {/* HERO */}
      <section className={styles.hero}>
        <SectionEyebrow className={styles.heroEyebrow}>Services</SectionEyebrow>
        <h1 className={styles.heroH1}>
          <span className={styles.hl1}>Know what sucks?</span>
          <span className={styles.hl2}>Not us!</span>
        </h1>
        <p className={cn(styles.sub, styles.rv)}>{SUB}</p>
        <div className={cn(styles.heroCta, styles.rv)}>
          <Button href="/contact">Start a project</Button>
        </div>
      </section>

      {/* 01 — PAID SOCIAL (the lead offer + the receipt) */}
      <section className={styles.sec}>
        <span className={styles.sidelabel}>What we lead with</span>
        <div className={styles.top}>
          <div>
            <div
              className={cn(styles.num, styles.rvf)}
              style={{ transform: "rotate(-3deg)" }}
            >
              01
            </div>
            <SectionEyebrow className={styles.blkEyebrow}>
              The main event
            </SectionEyebrow>
            <h2
              className={cn(styles.secH2, styles.rvf)}
              style={{ transform: "rotate(-1.5deg)" }}
            >
              Paid social.
            </h2>
            <div className={styles.lede2}>
              <p className={cn(styles.dropcap, styles.rv)}>{PAID_P1}</p>
              <p className={styles.rv}>{PAID_P2}</p>
            </div>
            <div className={cn(styles.tags, styles.rv)}>{PAID_TAGS}</div>
            <div className={cn(styles.footnote, styles.rv)}>
              {PAID_FOOTNOTE}
            </div>
          </div>
          <div className={cn(styles.proof, styles.rvf)}>
            <span className={styles.rk}>The receipt</span>
            <div className={styles.pre}>{PROOF_PRE}</div>
            <div className={styles.big} data-final="6350000">
              27
            </div>
            <div className={styles.post}>{PROOF_POST}</div>
          </div>
        </div>
      </section>

      {/* 02 + 03 */}
      <section className={styles.sec}>
        <span className={styles.sidelabel}>And once it&apos;s working</span>
        <div className={styles.two}>
          {EXPANSION.map((s) => (
            <div key={s.num} className={styles.rv}>
              <div className={styles.num} style={{ transform: s.numRot }}>
                {s.num}
              </div>
              <SectionEyebrow className={styles.blkEyebrow}>
                {s.eyebrow}
              </SectionEyebrow>
              <h3
                className={styles.svcH3}
                style={{ transform: s.titleRot }}
              >
                {s.title}
              </h3>
              <p className={styles.svcP}>{s.desc}</p>
              <div className={styles.tags}>{s.tags}</div>
            </div>
          ))}
        </div>
      </section>

      {/* THREE STEPS — full-width crooked escalating stack */}
      <section className={cn(styles.sec, styles.proc)}>
        <span className={styles.sidelabel}>How it works</span>
        <SectionEyebrow>The process, briefly</SectionEyebrow>
        <h2 className={cn(styles.procH2, styles.rvf)}>Three steps.</h2>
        <div className={styles.stack}>
          {STEPS.map((step) => (
            <div
              key={step.cls}
              className={cn(styles.line, styles[step.cls])}
            >
              {step.line}
              <span className={styles.cap}>{step.cap}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CLOSING CTA — dark torn band, tilted content, Flippy + bubble */}
      <section className={styles.ctaSection} id="start">
        <div className={styles.cta}>
          <div className={styles.ctaInner}>
            <h2 className={cn(styles.ctaH2, styles.rvf)}>
              {"Got something to"}
              <br />
              {"sell? Let's go."}
            </h2>
            <div className={cn(styles.ctaBtn, styles.rv)}>
              <Button href="/contact" variant="onDark">
                Start a project
              </Button>
            </div>
            <p className={cn(styles.yell, styles.rv)}>
              Or just yell at us.{" "}
              <a href="mailto:seymourbuttz@loosecannon.co">
                seymourbuttz@loosecannon.co
              </a>
            </p>
          </div>
          {/* Real Flippy artwork (public/flippy.svg, already pink-on-near-black).
              Bubble is the only new piece. Hidden on mobile via the module. */}
          <div className={styles.flippyWrap} aria-hidden="true">
            <div className={styles.flippyBubble}>do it.</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.flippyImg}
              src="/flippy.svg"
              alt=""
              width={230}
              height={381}
              draggable={false}
            />
          </div>
        </div>
      </section>

      <Footer />
    </Page>
  );
}
