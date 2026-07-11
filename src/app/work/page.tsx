import { Button } from "@/components/Button/Button";
import { CaseBand } from "@/components/CaseBand/CaseBand";
import { Footer } from "@/components/Footer/Footer";
import { Nav } from "@/components/Nav/Nav";
import { Page } from "@/components/Page/Page";
import { SectionEyebrow } from "@/components/SectionEyebrow/SectionEyebrow";
import { cn } from "@/lib/utils";
import { sanityFetch } from "@/sanity/fetch";
import {
  getAllCaseStudies,
  type CaseStudyListItem,
} from "@/sanity/queries/caseStudy";

import { WorkMotion } from "./WorkMotion";
import styles from "./page.module.css";

/** Extract a comparable 4-digit year from a freeform year string. */
function yearNum(y: string): number {
  const m = (y ?? "").match(/\d{4}/);
  return m ? parseInt(m[0], 10) : 0;
}

/** Featured first, then year DESC, then caseNumber ASC. */
function sortCases(a: CaseStudyListItem, b: CaseStudyListItem): number {
  const fa = a.featured ? 1 : 0;
  const fb = b.featured ? 1 : 0;
  if (fa !== fb) return fb - fa;
  const ya = yearNum(a.year);
  const yb = yearNum(b.year);
  if (ya !== yb) return yb - ya;
  return (a.caseNumber ?? "").localeCompare(b.caseNumber ?? "", undefined, {
    numeric: true,
  });
}

export default async function WorkIndex() {
  const cases = await sanityFetch<CaseStudyListItem[]>({
    query: getAllCaseStudies,
  });
  const sorted = [...cases].sort(sortCases);

  return (
    <Page>
      <Nav />
      <WorkMotion />

      {/* MASTHEAD — same pattern as About / Services / Contact. */}
      <div className={styles.masthead}>
        <span className={styles.fur}>Work // No. 004</span>
        <span className={cn(styles.fur, styles.furR)}>
          Loose Cannon Co. // The receipts
        </span>
      </div>

      <header className={styles.header}>
        <SectionEyebrow>Receipts</SectionEyebrow>
        <h1 className={styles.headline}>
          <span className={styles.hl1}>Our work.</span>
          <span className={styles.hl2}>Or whatever.</span>
        </h1>
        <p className={cn(styles.subhead, styles.rv)}>
          Receipts from social-first work that paid the bills.
        </p>
      </header>

      {/* Big alternating bands, one per case, with chapter-break spacing
          between. This is the page's immersion treatment vs the compact
          WorkRow teaser the home uses. No stat number here; the big
          hero number lives on the individual case study detail pages. */}
      <div className={styles.bands}>
        {sorted.map((c, i) => (
          <CaseBand
            key={c.slug}
            // Presentation-only additions: scroll-reveal class + a vertical
            // sidelabel numbered by the row's order in the list (from index).
            className={styles.rv}
            receiptLabel={`Receipt ${String(i + 1).padStart(2, "0")}`}
            slug={c.slug}
            client={c.client}
            discipline={c.discipline}
            year={c.year}
            headline={c.headline}
            coverImage={c.coverImage ?? c.posterImage}
            coverRatio={c.coverRatio}
            coverHotspot={c.coverHotspot}
            // Ayye card only: the Creators UGC spot as the cover, instead of
            // the wordmark-on-pink still. Other cards keep their image cover.
            coverVideo={
              c.slug === "ayye"
                ? {
                    src: "/ayye/ayye-creator.mp4",
                    poster: "/ayye/ayye-creator-poster.jpg",
                  }
                : undefined
            }
          />
        ))}
      </div>

      {/* CLOSING CTA — dark torn band, tilted content. Same treatment as the
          Services closing CTA; button links to /contact to match it. No Flippy
          here (he already lives at the top of the page). */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaH2}>Want to be a receipt?</h2>
          <div className={styles.ctaBtn}>
            <Button href="/contact" variant="onDark">
              Start a project
            </Button>
          </div>
          <p className={styles.yell}>
            Or just yell at us.{" "}
            <a href="mailto:seymourbuttz@loosecannon.co">
              seymourbuttz@loosecannon.co
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </Page>
  );
}
