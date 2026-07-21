import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/Footer/Footer";
import { Nav } from "@/components/Nav/Nav";
import { Page } from "@/components/Page/Page";
import { SectionEyebrow } from "@/components/SectionEyebrow/SectionEyebrow";
import { cn, formatDate } from "@/lib/utils";
import { sanityFetch } from "@/sanity/fetch";
import { urlFor } from "@/sanity/image";
import { getAllPosts, type PostListItem } from "@/sanity/queries";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Blah Blah Blah | Loose Cannon Co.",
  description:
    "The Loose Cannon Co. blog. Notes on social, creative, and running a small agency on purpose.",
};

/* List cover slot: 3:2 landscape. Sanity crops server-side via the per-field
 * hotspot (same width + height + fit("crop") chain as the case study hero). */
const COVER_W = 900;
const COVER_H = 600;

export default async function BlogIndex() {
  const posts = await sanityFetch<PostListItem[]>({ query: getAllPosts });

  return (
    <Page>
      <Nav />

      {/* MASTHEAD, same pattern as Work / About / Services / Contact. */}
      <div className={styles.masthead}>
        <span className={styles.fur}>Blah Blah Blah // The blog</span>
        <span className={cn(styles.fur, styles.furR)}>
          Loose Cannon Co. // Words, occasionally
        </span>
      </div>

      <header className={styles.header} data-reveal-section>
        <SectionEyebrow>The blog</SectionEyebrow>
        <h1 className={styles.headline} data-reveal>
          Blah blah blah.
        </h1>
        <p className={styles.subhead} data-reveal>
          Things we think about social, creative, and agency life. Read them or
          skip them, we will keep writing either way.
        </p>
      </header>

      <div className={styles.list}>
        {posts.length === 0 ? (
          <p className={styles.empty}>Nothing here yet. Check back soon.</p>
        ) : (
          posts.map((post) => (
            <article
              key={post.slug}
              className={styles.row}
              data-reveal-section
            >
              <Link href={`/blog/${post.slug}`} className={styles.rowLink}>
                <div className={styles.cover} data-reveal>
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={urlFor(post.coverImage)
                        .width(COVER_W)
                        .height(COVER_H)
                        .fit("crop")
                        .quality(70)
                        .auto("format")
                        .url()}
                      alt={post.coverImage.alt ?? ""}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.coverBlank} aria-hidden="true" />
                  )}
                </div>
                <div className={styles.rowText}>
                  <h2 className={styles.rowTitle} data-reveal>
                    {post.title}
                  </h2>
                  {post.summary ? (
                    <p className={styles.rowSummary} data-reveal>
                      {post.summary}
                    </p>
                  ) : null}
                  <p className={styles.rowMeta} data-reveal>
                    {[
                      post.author,
                      post.publishedAt ? formatDate(post.publishedAt) : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </Link>
            </article>
          ))
        )}
      </div>

      <Footer />
    </Page>
  );
}
