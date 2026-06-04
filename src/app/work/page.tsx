import { CaseBand } from "@/components/CaseBand/CaseBand";
import { Footer } from "@/components/Footer/Footer";
import { Nav } from "@/components/Nav/Nav";
import { Page } from "@/components/Page/Page";
import { SectionEyebrow } from "@/components/SectionEyebrow/SectionEyebrow";
import { client } from "@/sanity/client";
import {
  getAllCaseStudies,
  type CaseStudyListItem,
} from "@/sanity/queries/caseStudy";

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
  const cases = await client.fetch<CaseStudyListItem[]>(getAllCaseStudies);
  const sorted = [...cases].sort(sortCases);

  return (
    <Page>
      <Nav />

      <header className={styles.header}>
        <SectionEyebrow>Receipts</SectionEyebrow>
        <h1 className={styles.headline}>Work.</h1>
        <p className={styles.subhead}>
          Receipts from social-first work that paid the bills.
        </p>
      </header>

      {/* Big alternating bands, one per case, with chapter-break spacing
          between. This is the page's immersion treatment vs the compact
          WorkRow teaser the home uses. No stat number here; the big
          hero number lives on the individual case study detail pages. */}
      <div className={styles.bands}>
        {sorted.map((c) => (
          <CaseBand
            key={c.slug}
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

      <Footer />
    </Page>
  );
}
