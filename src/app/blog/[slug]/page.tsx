import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";

import { BackLink } from "@/components/BackLink/BackLink";
import { Carousel } from "@/components/Carousel/Carousel";
import { Footer } from "@/components/Footer/Footer";
import { Nav } from "@/components/Nav/Nav";
import { Page } from "@/components/Page/Page";
import { SectionEyebrow } from "@/components/SectionEyebrow/SectionEyebrow";
import { cn, formatDate } from "@/lib/utils";
import { client } from "@/sanity/client";
import { sanityFetch } from "@/sanity/fetch";
import { urlFor } from "@/sanity/image";
import {
  getAllPosts,
  getPostBySlug,
  type Post,
  type PostListItem,
} from "@/sanity/queries";

import styles from "./page.module.css";

export const dynamicParams = true;

const SITE_URL = "https://loosecannon.co";

/* Cover slot: 2:1 landscape banner above the title. Sanity crops server-side
 * via the per-field hotspot (same chain as the case study hero artifact). */
const COVER_W = 1600;
const COVER_H = 800;

export async function generateStaticParams() {
  const items = await client.fetch<PostListItem[]>(getAllPosts);
  return items.filter((i) => i.slug).map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await sanityFetch<Post | null>({
    query: getPostBySlug,
    params: { slug: params.slug },
  });
  if (!post) return {};

  const ogImage = post.coverImage
    ? urlFor(post.coverImage)
        .width(1200)
        .height(630)
        .fit("crop")
        .auto("format")
        .url()
    : undefined;

  return {
    title: `${post.title} | Blah Blah Blah`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      url: `${SITE_URL}/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
  };
}

/* ── Body block types ─────────────────────────────────────────────────────
 * Shapes of the custom portable text objects defined in the post schema.
 * Sanity leaves optional fields undefined, so everything is loose. */
interface ArticleImage {
  asset?: unknown;
  alt?: string;
  caption?: string;
  width?: "small" | "column" | "fullBleed";
}

interface CarouselValue {
  images?: ArticleImage[];
}

interface SideBySideValue {
  images?: ArticleImage[];
}

interface WrappedImageValue {
  image?: ArticleImage;
  side?: "left" | "right";
}

interface VideoEmbedValue {
  url?: string;
  /** Dereferenced by getPostBySlug from the uploaded file, when present. */
  fileUrl?: string;
  mimeType?: string;
  caption?: string;
}

interface PullQuoteValue {
  text?: string;
  attribution?: string;
}

/** YouTube (watch, share, shorts) or Vimeo URL to an embeddable player URL. */
function parseEmbedUrl(url?: string): string | undefined {
  if (!url) return undefined;
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/,
  );
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return undefined;
}

function Figcaption({ text }: { text?: string }) {
  if (!text) return null;
  return <figcaption className={styles.caption}>{text}</figcaption>;
}

/* Inline body blocks render through the same urlFor chain as everything else,
 * with the editor-written alt. Single images keep their native aspect ratio
 * (width only, no height); carousel and side-by-side tiles crop to 4:5 so
 * the rows line up. */
const bodyComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value: ArticleImage }) => {
      if (!value?.asset) return null;
      const width = value.width ?? "column";
      return (
        <figure
          className={cn(
            styles.figure,
            width === "small" && styles.figSmall,
            width === "fullBleed" && styles.figBleed,
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={urlFor(value)
              .width(width === "fullBleed" ? 2000 : 1400)
              .quality(70)
              .auto("format")
              .url()}
            alt={value.alt ?? ""}
            loading="lazy"
          />
          <Figcaption text={value.caption} />
        </figure>
      );
    },
    carousel: ({ value }: { value: CarouselValue }) => {
      const images = (value.images ?? []).filter((img) => img?.asset);
      if (images.length === 0) return null;
      return (
        <div className={styles.carouselBlock}>
          <Carousel
            bare
            showCaptions
            slides={images.map((img) => ({
              src: urlFor(img)
                .width(960)
                .height(1200)
                .fit("crop")
                .quality(70)
                .auto("format")
                .url(),
              alt: img.alt,
              caption: img.caption,
            }))}
          />
        </div>
      );
    },
    sideBySide: ({ value }: { value: SideBySideValue }) => {
      const images = (value.images ?? []).filter((img) => img?.asset);
      if (images.length === 0) return null;
      return (
        <div className={styles.sideBySide}>
          {images.map((img, i) => (
            <figure key={i} className={styles.sideFig}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={urlFor(img)
                  .width(900)
                  .height(1125)
                  .fit("crop")
                  .quality(70)
                  .auto("format")
                  .url()}
                alt={img.alt ?? ""}
                loading="lazy"
              />
              <Figcaption text={img.caption} />
            </figure>
          ))}
        </div>
      );
    },
    wrappedImage: ({ value }: { value: WrappedImageValue }) => {
      const img = value.image;
      if (!img?.asset) return null;
      return (
        <figure
          className={cn(
            styles.wrapFig,
            value.side === "right" ? styles.wrapRight : styles.wrapLeft,
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={urlFor(img).width(800).quality(70).auto("format").url()}
            alt={img.alt ?? ""}
            loading="lazy"
          />
          <Figcaption text={img.caption} />
        </figure>
      );
    },
    videoEmbed: ({ value }: { value: VideoEmbedValue }) => {
      const embedUrl = parseEmbedUrl(value.url);
      if (embedUrl) {
        return (
          <figure className={styles.videoBlock}>
            <div className={styles.videoFrame}>
              <iframe
                src={embedUrl}
                title={value.caption ?? "Video"}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <Figcaption text={value.caption} />
          </figure>
        );
      }
      if (value.fileUrl) {
        return (
          <figure className={styles.videoBlock}>
            <video
              className={styles.videoFile}
              controls
              playsInline
              preload="metadata"
            >
              <source src={value.fileUrl} type={value.mimeType ?? "video/mp4"} />
            </video>
            <Figcaption text={value.caption} />
          </figure>
        );
      }
      return null;
    },
    pullQuote: ({ value }: { value: PullQuoteValue }) => {
      if (!value.text?.trim()) return null;
      return (
        <aside className={styles.pullQuote}>
          <p className={styles.pullQuoteText}>{value.text}</p>
          {value.attribution ? (
            <p className={styles.pullQuoteAttr}>{value.attribution}</p>
          ) : null}
        </aside>
      );
    },
    sectionBreak: () => (
      <div className={styles.sectionBreak} role="separator">
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </div>
    ),
  },
};

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await sanityFetch<Post | null>({
    query: getPostBySlug,
    params: { slug: params.slug },
  });
  if (!post) notFound();

  const coverUrl = post.coverImage
    ? urlFor(post.coverImage)
        .width(COVER_W)
        .height(COVER_H)
        .fit("crop")
        .quality(70)
        .auto("format")
        .url()
    : undefined;

  const url = `${SITE_URL}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: post.publishedAt,
    ...(coverUrl ? { image: coverUrl } : {}),
    author: {
      "@type": post.author === "Loose Cannon Co." ? "Organization" : "Person",
      name: post.author ?? "Loose Cannon Co.",
    },
    publisher: { "@type": "Organization", name: "Loose Cannon Co.", url: SITE_URL },
    isPartOf: { "@type": "Blog", name: "Blah Blah Blah", url: `${SITE_URL}/blog` },
  };

  return (
    <Page>
      <Nav />
      <BackLink href="/blog" label="Back to the blog" />

      <article className={styles.article} data-reveal-section>
        <header className={styles.header}>
          <SectionEyebrow>Blah Blah Blah</SectionEyebrow>
          <h1 className={styles.title} data-reveal>
            {post.title}
          </h1>
          <p className={styles.meta} data-reveal>
            {[
              post.author,
              post.publishedAt ? formatDate(post.publishedAt) : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </header>

        {coverUrl ? (
          <div className={styles.cover} data-reveal>
            {/* Above-the-fold LCP candidate: eager load + high fetch priority. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt={post.coverImage?.alt ?? ""}
              loading="eager"
              fetchPriority="high"
            />
          </div>
        ) : null}

        <div className={styles.body}>
          <PortableText value={post.body ?? []} components={bodyComponents} />
        </div>
      </article>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Page>
  );
}
