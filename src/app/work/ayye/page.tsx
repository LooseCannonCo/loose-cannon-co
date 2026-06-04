import type { Metadata } from "next";
import localFont from "next/font/local";

import { BackLink } from "@/components/BackLink/BackLink";
import { Carousel } from "@/components/Carousel/Carousel";
import { Footer } from "@/components/Footer/Footer";
import { MetaStrip } from "@/components/MetaStrip/MetaStrip";
import { Nav } from "@/components/Nav/Nav";
import { Page } from "@/components/Page/Page";
import { SectionEyebrow } from "@/components/SectionEyebrow/SectionEyebrow";
import { cn } from "@/lib/utils";

import { AyyeMark } from "./AyyeMark";
import { AyyeVideo } from "./AyyeVideo";
import { ayyeContent as c } from "./content";
import styles from "./page.module.css";

// General Sans (Fontshare), self-hosted via next/font/local to match the
// repo's no-render-block font strategy. Exposed as --font-general and consumed
// by the scoped --font-ayye token. Only the four weights the type ladder uses.
const generalSans = localFont({
  src: [
    { path: "../../../fonts/general-sans/GeneralSans-400.woff2", weight: "400", style: "normal" },
    { path: "../../../fonts/general-sans/GeneralSans-500.woff2", weight: "500", style: "normal" },
    { path: "../../../fonts/general-sans/GeneralSans-600.woff2", weight: "600", style: "normal" },
    { path: "../../../fonts/general-sans/GeneralSans-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-general",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ayye, brand system // Loose Cannon Co.",
  description:
    "Case 003. We gave Ayye a brand that proves itself: five colors, forty tones, one sans.",
};

/**
 * Ayye case study, Case 003. A bespoke template (the case study becomes the
 * brand guide it describes), served at /work/ayye by this static route, which
 * takes precedence over the dynamic [slug] campaign template.
 *
 * Step 3a: foundation + shell. The LC intro and close are real; the six
 * bespoke section cards render their headers with placeholder bodies, filled
 * in section by section in the following steps.
 */
export default function AyyeCasePage() {
  return (
    <Page className={cn(generalSans.variable, styles.ayye)}>
      <Nav />
      <BackLink href="/work" label={c.intro.backLabel} />

      <MetaStrip
        client={c.meta.client}
        discipline={c.meta.discipline}
        year={c.meta.year}
        tag={c.meta.featured ? "Featured" : undefined}
      />

      {/* Section 1: LC case intro (pink, LC voice) */}
      <section data-reveal-section className={styles.intro}>
        <SectionEyebrow>{c.intro.eyebrow}</SectionEyebrow>
        <h1 className={styles.introHeadline} data-reveal>
          {c.intro.headline}
        </h1>
        <p className={styles.introLede} data-reveal>
          {c.intro.lede}
        </p>
        <p className={styles.sysStat} data-reveal>
          {c.intro.sysStat}
        </p>
      </section>

      {/* Section 2: The mark (black card) */}
      <section data-reveal-section className={cn(styles.card, styles.cardBlack)}>
        <div className={styles.cardHead} data-reveal>
          <span className={styles.cardLabel}>{c.mark.label}</span>
        </div>
        <AyyeMark />
      </section>

      {/* Section 3: 01 The palette (cream card) */}
      <section data-reveal-section className={cn(styles.card, styles.cardCream)}>
        <div className={styles.cardHead} data-reveal>
          <span className={styles.cardNum}>{c.palette.number}</span>
          <span className={styles.cardLabel}>{c.palette.label}</span>
        </div>
        <h2 className={styles.cardTitle} data-reveal>
          {c.palette.title}
        </h2>
        <div className={styles.chips} data-reveal>
          {c.palette.swatches.map((sw, i) => {
            const light = sw.hex === "#FFF8E4" || sw.hex === "#FFFFFF";
            return (
              <div key={i} className={styles.chip}>
                <div
                  className={styles.chipSw}
                  style={{
                    background: sw.hex,
                    ...(light
                      ? { borderBottom: "1px solid var(--ayye-hair)" }
                      : {}),
                  }}
                  aria-hidden="true"
                />
                <div className={styles.info}>
                  <div className={styles.role}>{sw.role}</div>
                  <div className={styles.name}>{sw.name}</div>
                  <div className={styles.hex}>{sw.hex}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.dom}>
          <h3 className={styles.domhead} data-reveal>
            {c.palette.dominanceHeading}
          </h3>
          <div className={styles.domwrap}>
            <div className={styles.pie} data-reveal aria-hidden="true" />
            <div className={styles.leg} data-reveal>
              {c.palette.dominance.map((d) => (
                <div key={d.label} className={styles.legItem}>
                  <span
                    className={styles.legSw}
                    style={{ background: d.hex }}
                    aria-hidden="true"
                  />
                  <span>
                    {d.label} {d.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className={styles.domline} data-reveal>
            {c.palette.dominanceCopy}
          </p>
        </div>
        <div
          className={styles.gradbar}
          data-reveal
          style={{ background: c.palette.gradient }}
          aria-hidden="true"
        />
        <p className={styles.gradLabel} data-reveal>
          {c.palette.gradientLabel}
        </p>
      </section>

      {/* Section 4: 02 The type (black card) */}
      <section data-reveal-section className={cn(styles.card, styles.cardBlack)}>
        <div className={styles.cardHead} data-reveal>
          <span className={styles.cardNum}>{c.type.number}</span>
          <span className={styles.cardLabel}>{c.type.label}</span>
        </div>
        <h2 className={styles.cardTitle} data-reveal>
          {c.type.titleLines[0]}
          <br />
          {c.type.titleLines[1]}
        </h2>
        <div className={styles.ladder} data-reveal>
          {c.type.weights.map((w) => (
            <div key={w.value} className={styles.lrow}>
              <span className={styles.lw}>
                {w.label} {w.value}
              </span>
              <span className={styles.ls} style={{ fontWeight: w.value }}>
                {c.type.specimenLine}
              </span>
            </div>
          ))}
        </div>
        <p className={styles.specimen} data-reveal>
          {c.type.bigSpecimen}
        </p>
        <p className={styles.typeCopy} data-reveal>
          {c.type.copy}
        </p>
      </section>

      {/* Section 5: 03 The social system (cream card) */}
      <section data-reveal-section className={cn(styles.card, styles.cardCream)}>
        <div className={styles.cardHead} data-reveal>
          <span className={styles.cardNum}>{c.social.number}</span>
          <span className={styles.cardLabel}>{c.social.label}</span>
        </div>
        <h2 className={styles.cardTitle} data-reveal>
          {c.social.titleLines[0]}
          <br />
          {c.social.titleLines[1]}
        </h2>
        <p className={styles.cardNote} data-reveal>
          {c.social.note}
        </p>
        <Carousel bare accent={c.social.accent} slides={c.social.slides} />
        <p className={styles.cardCaption} data-reveal>
          {c.social.carouselCaption}
        </p>
        <div className={styles.compare}>
          <figure className={styles.cmp} data-reveal>
            <div className={styles.cmpBar} aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.cmpImg}
              src={c.social.compare.left.src}
              alt={c.social.compare.left.alt}
              loading="lazy"
            />
            <figcaption className={styles.cmpCap}>
              {c.social.compare.left.caption}
            </figcaption>
          </figure>
          <figure className={styles.cmp} data-reveal>
            <div className={styles.cmpBar} aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.cmpImg}
              src={c.social.compare.right.src}
              alt={c.social.compare.right.alt}
              loading="lazy"
            />
            <figcaption className={styles.cmpCap}>
              {c.social.compare.right.caption}
            </figcaption>
          </figure>
        </div>
        <p className={styles.cardCaption} data-reveal>
          {c.social.compare.caption}
        </p>
      </section>

      {/* Section 6: 04 UGC (cream card) */}
      <section data-reveal-section className={cn(styles.card, styles.cardCream)}>
        <div className={styles.cardHead} data-reveal>
          <span className={styles.cardNum}>{c.ugc.number}</span>
          <span className={styles.cardLabel}>{c.ugc.label}</span>
        </div>
        <h2 className={styles.cardTitle} data-reveal>
          {c.ugc.title}
        </h2>
        <div className={styles.vids} data-reveal>
          {c.ugc.videos.map((v) => (
            <div key={v.src} className={styles.vid}>
              <AyyeVideo
                className={styles.vidEl}
                src={v.src}
                poster={v.poster}
                label={v.label}
              />
            </div>
          ))}
        </div>
        <p className={styles.cardCaption} data-reveal>
          {c.ugc.caption}
        </p>
      </section>

      {/* Section 7: 05 The landing pages (cream card) */}
      <section data-reveal-section className={cn(styles.card, styles.cardCream)}>
        <div className={styles.cardHead} data-reveal>
          <span className={styles.cardNum}>{c.landing.number}</span>
          <span className={styles.cardLabel}>{c.landing.label}</span>
        </div>
        <h2 className={styles.cardTitle} data-reveal>
          {c.landing.titleLines[0]}
          <br />
          {c.landing.titleLines[1]}
        </h2>
        <div className={styles.browser} data-reveal>
          <div className={styles.bbar}>
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.url}>{c.landing.chromeUrl}</span>
          </div>
          <iframe
            className={styles.browserFrame}
            src={c.landing.iframeSrc}
            title="Ayye creators landing page"
            loading="lazy"
          />
        </div>
        <p className={styles.cardCaption} data-reveal>
          {c.landing.caption}
        </p>
      </section>

      {/* Section 8: LC close (plum, full-bleed, LC voice) */}
      <section data-reveal-section className={styles.close}>
        <div className={styles.closeInner}>
          <SectionEyebrow>{c.close.kicker}</SectionEyebrow>
          <h2 className={styles.closeHeadline} data-reveal>
            {c.close.headline}
          </h2>
          <div className={styles.closeCta} data-reveal>
            <a className={styles.guideLink} href={c.close.linkHref}>
              <span>{c.close.linkText}</span>
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </Page>
  );
}
