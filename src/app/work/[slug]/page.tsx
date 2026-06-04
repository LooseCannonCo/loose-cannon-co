import { notFound } from "next/navigation";

import { BackLink } from "@/components/BackLink/BackLink";
import { BarComparison } from "@/components/BarComparison/BarComparison";
import { Brief, type BriefBreakdownItem } from "@/components/Brief/Brief";
import { CaseGallery } from "@/components/CaseGallery/CaseGallery";
import { Carousel } from "@/components/Carousel/Carousel";
import { Credits } from "@/components/Credits/Credits";
import { FeatureImage } from "@/components/FeatureImage/FeatureImage";
import { Footer } from "@/components/Footer/Footer";
import { Hero } from "@/components/Hero/Hero";
import { MetaStrip } from "@/components/MetaStrip/MetaStrip";
import { Nav } from "@/components/Nav/Nav";
import { Page } from "@/components/Page/Page";
import { QuoteBlock } from "@/components/QuoteBlock/QuoteBlock";
import { RingFill } from "@/components/RingFill/RingFill";
import { StatsTrio, type TrioCell } from "@/components/StatsTrio/StatsTrio";
import { ThreeUpVideo } from "@/components/ThreeUpVideo/ThreeUpVideo";
import { UpNext } from "@/components/UpNext/UpNext";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import {
  getAllCaseStudies,
  getCaseStudyBySlug,
  type CaseStudy,
  type CaseStudyListItem,
  type TrioCellData,
} from "@/sanity/queries/caseStudy";

export const dynamicParams = true;

export async function generateStaticParams() {
  const items = await client.fetch<CaseStudyListItem[]>(getAllCaseStudies);
  // "ayye" is served by the bespoke static route src/app/work/ayye/page.tsx,
  // which takes precedence over this dynamic template, so exclude it here.
  return items
    .filter((i) => i.slug && i.slug !== "ayye")
    .map((i) => ({ slug: i.slug }));
}

/* Hero artifact slot: fixed 4:5 portrait so portrait source images (FITAID
 * gollum.jpg 1080x1350, Smolotov smolotov-poster.jpg 1080x1350) display
 * full-frame with no crop. Sanity is still asked for an explicit crop URL
 * (900x1125, matching 4:5) so the per-field hotspot drives any server-side
 * crop on off-ratio assets; CSS object-fit: cover is the safety net. The
 * landscape Gemini 3200x1344 asset, when re-linked here later, will be
 * hotspot-cropped to portrait via that same path. */
const HERO_W = 900;
const HERO_H = 1125;

const artifactPlaceholderStyle: React.CSSProperties = {
  aspectRatio: "4 / 5",
  boxShadow: "var(--lc-offset-block)",
  border: "2px solid var(--lc-plum)",
  background: "var(--lc-cream)",
  display: "grid",
  placeItems: "center",
  textAlign: "center",
  padding: "24px",
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "0.04em",
  color: "var(--lc-plum)",
  lineHeight: 1.5,
};

const heroMediaStyle: React.CSSProperties = {
  width: "100%",
  aspectRatio: "4 / 5",
  display: "block",
  objectFit: "cover",
  boxShadow: "var(--lc-offset-block)",
  border: "2px solid var(--lc-plum)",
};

/**
 * Hero artifact render chain, in order of preference:
 *   1. heroVideo (muted/loop/autoplay/playsinline + poster)
 *   2. coverImage
 *   3. legacy hero.artifact image (backward compat)
 *   4. cream placeholder swatch
 * Each image URL passes width + height + fit("crop") so Sanity applies the
 * per-field hotspot server-side.
 */
function renderArtifact(
  hero: CaseStudy["hero"],
  heroVideo: CaseStudy["heroVideo"],
  coverImage: CaseStudy["coverImage"],
): React.ReactNode {
  if (heroVideo?.fileUrl) {
    const posterUrl = heroVideo.posterImage
      ? urlFor(heroVideo.posterImage)
          .width(HERO_W)
          .height(HERO_H)
          .fit("crop")
          .quality(70)
          .auto("format")
          .url()
      : undefined;
    return (
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={posterUrl}
        style={heroMediaStyle}
      >
        <source
          src={heroVideo.fileUrl}
          type={heroVideo.mimeType ?? "video/mp4"}
        />
      </video>
    );
  }

  if (coverImage) {
    return (
      // Above-the-fold LCP candidate: eager load + high fetch priority.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={urlFor(coverImage)
          .width(HERO_W)
          .height(HERO_H)
          .fit("crop")
          .quality(70)
          .auto("format")
          .url()}
        alt={hero?.artifactCaption ?? ""}
        style={heroMediaStyle}
        loading="eager"
        fetchPriority="high"
      />
    );
  }

  const art = hero?.artifact;
  const hasImage = Boolean((art as { asset?: unknown } | undefined)?.asset);
  if (hasImage && art) {
    return (
      // Above-the-fold LCP candidate: eager load + high fetch priority.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={urlFor(art)
          .width(HERO_W)
          .height(HERO_H)
          .fit("crop")
          .quality(70)
          .auto("format")
          .url()}
        alt={hero?.artifactCaption ?? ""}
        style={heroMediaStyle}
        loading="eager"
        fetchPriority="high"
      />
    );
  }

  return (
    <div style={artifactPlaceholderStyle}>
      {hero?.artifactCaption ?? "Artifact"}
      <br />
      (image placeholder)
    </div>
  );
}

function buildChart(cell: TrioCellData): React.ReactNode {
  const c = cell.config ?? {};
  if (cell.chartType === "barComparison") {
    return (
      <BarComparison
        prior={c.prior ?? 0}
        current={c.current ?? 0}
        priorLabel={c.priorLabel}
        currentLabel={c.currentLabel}
      />
    );
  }
  return <RingFill percent={c.percent ?? 0} />;
}

export default async function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const doc = await client.fetch<CaseStudy | null>(getCaseStudyBySlug, {
    slug: params.slug,
  });
  if (!doc) notFound();

  const {
    hero,
    brief,
    contentSection,
    statsTrio,
    quote,
    credits,
    upNext,
    coverImage,
    heroVideo,
    gallery,
    galleryEyebrow,
    galleryTitle,
    galleryIntro,
    featureImage,
  } = doc;

  const breakdown: BriefBreakdownItem[] | undefined =
    brief?.breakdown?.items?.map((it) => ({
      title: it.title ?? "",
      sub: it.sub,
      body: it.body ?? "",
      stat: it.stat,
    }));

  return (
    <Page>
      <Nav />
      <BackLink href="/work" />

      <MetaStrip
        client={doc.client}
        discipline={doc.discipline}
        year={doc.year}
        tag={doc.featured ? "Featured" : undefined}
      />

      {hero ? (
        <Hero
          eyebrow={hero.eyebrow ?? ""}
          number={
            hero.digits
              ? {
                  prefix: hero.prefix,
                  digits: hero.digits,
                  suffix: hero.suffix,
                  sticker: hero.heroSticker?.text
                    ? {
                        text: hero.heroSticker.text,
                        angle: hero.heroSticker.angle ?? 0,
                      }
                    : undefined,
                }
              : undefined
          }
          headline={hero.headline ?? ""}
          subhead={hero.subhead ?? ""}
          meta={hero.meta ?? ""}
          artifact={renderArtifact(hero, heroVideo, coverImage)}
        />
      ) : null}

      {brief ? (
        <Brief
          eyebrow={brief.eyebrow ?? ""}
          headlineLines={(brief.headline ?? "").split("\n")}
          body={brief.body ?? []}
          breakdown={breakdown}
          breakdownVariant={
            brief.breakdown?.type === "threeStep" ? "steps" : "cols"
          }
        />
      ) : null}

      {/* Full-bleed cinematic beat between the Brief and the content gallery.
          Skips entirely when no image is set on the case study. */}
      <FeatureImage data={featureImage} />

      {/* Content section: ThreeUpVideo for motion-led cases (Smolotov),
          CaseGallery for image-led cases (FITAID). The legacy NineGrid that
          rendered "IMAGE PLACEHOLDER / EDITORIAL / REVIEW" tile labels was
          removed; gallery is the single image content section now. */}
      {contentSection?.type === "threeUpVideo" ? (
        <ThreeUpVideo videos={contentSection.videos ?? []} />
      ) : null}

      {/* Gallery dispatch: large collections (~6+) get the drag gallery
          primitive (FITAID pattern). Small sets stay a static 3-col grid
          (CaseGallery). Threshold is the "scroll through them" density
          inflection. */}
      {gallery && gallery.length > 0 ? (
        gallery.length >= 6 ? (
          // Shared carousel. Resolve Sanity URLs here (identical crop params to
          // the prior CaseGalleryDrag) so the component stays presentation-only.
          // No `accent` is passed, so the FITAID carousel renders bar-less,
          // exactly as before.
          <Carousel
            slides={gallery.map((item) => ({
              src: (item.image as { asset?: unknown } | undefined)?.asset
                ? urlFor(item.image)
                    .width(960)
                    .height(1200)
                    .fit("crop")
                    .quality(70)
                    .auto("format")
                    .url()
                : "",
              alt: item.alt,
              caption: item.caption,
            }))}
            eyebrow={galleryEyebrow || undefined}
            title={galleryTitle || undefined}
            intro={galleryIntro || undefined}
          />
        ) : (
          <CaseGallery
            items={gallery}
            eyebrow={galleryEyebrow || undefined}
            title={galleryTitle || undefined}
            intro={galleryIntro || undefined}
          />
        )
      ) : null}

      {statsTrio ? (
        <StatsTrio
          eyebrow={statsTrio.eyebrow ?? ""}
          title={statsTrio.title ?? "The receipts."}
          body={statsTrio.explanation ?? ""}
          cells={(statsTrio.cells ?? []).map<TrioCell>((cell) => ({
            chart: buildChart(cell),
            number: {
              prefix: cell.config?.prefix,
              digits: cell.config?.digits ?? "",
              unit: cell.config?.unit,
            },
            caption: cell.config?.caption ?? "",
            source: cell.config?.source ?? "",
          }))}
        />
      ) : null}

      {/* Quote is optional per case. Render the section ONLY when the case has
          real quote text in Sanity; an absent, empty, or whitespace-only quote
          renders nothing at all (no band, no reserved space), so a case like
          Ayye can ship without one while FITAID and Smolotov keep theirs. */}
      {quote?.text?.trim() ? (
        <QuoteBlock
          quote={quote.text}
          attribution={quote.attribution?.name ?? ""}
          role={quote.attribution?.role ?? ""}
        />
      ) : null}

      {credits && credits.length > 0 ? (
        <Credits
          credits={credits.map((c) => ({
            label: c.label ?? "",
            name: c.name ?? "",
          }))}
        />
      ) : null}

      {upNext?.next?.slug ? (
        <UpNext
          title={`${upNext.next.client ?? ""}.`}
          href={`/work/${upNext.next.slug}`}
          caseLabel={upNext.next.discipline ?? ""}
          descriptor={upNext.descriptor ?? ""}
          posterImage={upNext.next.coverImage ?? upNext.next.posterImage}
          psText={upNext.psLine}
        />
      ) : null}

      <Footer />
    </Page>
  );
}
