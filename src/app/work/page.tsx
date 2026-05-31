import { Footer } from "@/components/Footer/Footer";
import { Nav } from "@/components/Nav/Nav";
import { Page } from "@/components/Page/Page";
import { SectionEyebrow } from "@/components/SectionEyebrow/SectionEyebrow";
import { Splatter } from "@/components/Splatter/Splatter";
import { WorkRow } from "@/components/WorkRow/WorkRow";
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
        <Splatter count={4} excludeCenter />
        <SectionEyebrow>Receipts</SectionEyebrow>
        <h1 className={styles.headline}>
          <span className={styles.bleed} aria-hidden="true">
            Work.
          </span>
          <span className={styles.ink}>Work.</span>
        </h1>
        <p className={styles.subhead}>
          Receipts from social-first work that paid the bills.
        </p>
      </header>

      <div className={styles.list}>
        {sorted.map((c, i) => (
          <WorkRow
            key={c.slug}
            index={i}
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

      <Footer />
    </Page>
  );
}
