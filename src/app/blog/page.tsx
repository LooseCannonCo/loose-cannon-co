import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/Footer/Footer";
import { Nav } from "@/components/Nav/Nav";
import { Page } from "@/components/Page/Page";
import { formatDate } from "@/lib/utils";
import { sanityFetch } from "@/sanity/fetch";
import { urlFor } from "@/sanity/image";
import { getAllPosts, type PostListItem } from "@/sanity/queries";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Blah Blah Blah | Loose Cannon Co.",
  description:
    "The Loose Cannon Co. blog. Notes on social, creative, and running a small agency on purpose.",
};

/* ── Press sheet cycles ────────────────────────────────────────────────────
 * Width, crop, and tilt each run on their own cycle, keyed off the post's
 * index in the published list (newest = index 0). The lengths (5, 4, 7)
 * share no common factor, so the same width + crop + tilt combination does
 * not recur until post 140. That is deliberate; do not collapse them into
 * a single cycle. Widths are chosen so 7+5 fills one row and 4+4+4 fills
 * the next. */
const WIDTHS = [7, 5, 4, 4, 4];
const CROPS = ["4 / 3", "3 / 4", "1 / 1", "16 / 9"];
const TILTS = [-1.4, 2.1, -2.3, 1.2, 0.8, -1.0, 1.6];

/* Editor override from the post's cardSize field: fixed column + crop pairs.
 * An overridden post is skipped in the width and crop cycles (tilt still
 * cycles by list index), and grid-auto-flow: dense pulls a later card up
 * into any gap the override opens. */
const OVERRIDES: Record<string, { cols: number; crop: string }> = {
  small: { cols: 3, crop: "1 / 1" },
  medium: { cols: 4, crop: "4 / 3" },
  large: { cols: 7, crop: "4 / 3" },
  wide: { cols: 6, crop: "16 / 9" },
  tall: { cols: 5, crop: "3 / 4" },
};

/* Sanity crops server-side to the card's assigned ratio via the per-field
 * hotspot (width + height + fit("crop"), same chain as the case study hero).
 * Request width is roughly 2x the card's rendered desktop width per column
 * span, so the crop stays sharp on retina. */
function coverSize(cols: number, crop: string): { w: number; h: number } {
  const w = cols * 210;
  const [aw, ah] = crop.split("/").map((n) => Number(n.trim()));
  return { w, h: Math.round((w * ah) / aw) };
}

export default async function BlogIndex() {
  const posts = await sanityFetch<PostListItem[]>({ query: getAllPosts });

  /* Assign each card its slot. Overridden posts take their width and crop
   * from the map and do not advance the width/crop cycle counter. */
  let autoIndex = 0;
  const cards = posts.map((post, i) => {
    const override =
      post.cardSize && post.cardSize !== "auto"
        ? OVERRIDES[post.cardSize]
        : undefined;
    const cols = override ? override.cols : WIDTHS[autoIndex % WIDTHS.length];
    const crop = override ? override.crop : CROPS[autoIndex % CROPS.length];
    if (!override) autoIndex += 1;
    return { post, cols, crop, tilt: TILTS[i % TILTS.length] };
  });

  return (
    <Page>
      <Nav />

      {/* MASTHEAD: compact strip, not a hero, so the first card sits above
          the fold. Eyebrow, display title with the violet misregistration
          offset, tagline to its right, plum rule underneath. */}
      <header className={styles.masthead} data-reveal-section>
        <p className={styles.eyebrow} data-reveal>
          Blah blah blah // the blog
        </p>
        <div className={styles.mastheadRow}>
          <h1 className={styles.headline} data-reveal>
            Blah blah blah.
          </h1>
          <p className={styles.tagline} data-reveal>
            Things we think about social, creative, and agency life. Read them
            or skip them, we will keep writing either way.
          </p>
        </div>
      </header>

      <main className={styles.sheet} data-reveal-section>
        <div className={styles.grid}>
          {cards.length === 0 ? (
            <p className={styles.empty}>Nothing here yet. Check back soon.</p>
          ) : (
            cards.map(({ post, cols, crop, tilt }) => {
              const { w, h } = coverSize(cols, crop);
              return (
                <article
                  key={post.slug}
                  className={styles.card}
                  style={
                    {
                      "--span": cols,
                      "--crop": crop,
                      "--tilt": `${tilt}deg`,
                    } as CSSProperties
                  }
                  data-reveal
                >
                  <Link href={`/blog/${post.slug}`} className={styles.cardLink}>
                    <span className={styles.frame}>
                      <span className={styles.bleed} aria-hidden="true" />
                      <span className={styles.cover}>
                        {post.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={urlFor(post.coverImage)
                              .width(w)
                              .height(h)
                              .fit("crop")
                              .quality(70)
                              .auto("format")
                              .url()}
                            alt={post.coverImage.alt ?? ""}
                            loading="lazy"
                          />
                        ) : (
                          <span className={styles.blank} aria-hidden="true" />
                        )}
                      </span>
                    </span>
                    <h2 className={styles.title}>{post.title}</h2>
                    {post.summary ? (
                      <p className={styles.summary}>{post.summary}</p>
                    ) : null}
                    <p className={styles.meta}>
                      {[
                        post.author,
                        post.publishedAt ? formatDate(post.publishedAt) : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </Link>
                </article>
              );
            })
          )}
        </div>
      </main>

      <Footer />
    </Page>
  );
}
