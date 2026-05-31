import { notFound } from "next/navigation";

import { BackLink } from "@/components/BackLink/BackLink";
import { BarComparison } from "@/components/BarComparison/BarComparison";
import { Brief, type BriefBreakdownItem } from "@/components/Brief/Brief";
import { CaseGallery } from "@/components/CaseGallery/CaseGallery";
import { CaseGalleryDrag } from "@/components/CaseGalleryDrag/CaseGalleryDrag";
import { Credits } from "@/components/Credits/Credits";
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
  type StickerPosition,
  type TrioCellData,
} from "@/sanity/queries/caseStudy";

export const dynamicParams = true;

export async function generateStaticParams() {
  const items = await client.fetch<CaseStudyListItem[]>(getAllCaseStudies);
  return items.filter((i) => i.slug).map((i) => ({ slug: i.slug }));
}

const artifactPlaceholderStyle: React.CSSProperties = {
  aspectRatio: "4 / 5",
  boxShadow: "8px 8px 0 var(--lc-plum)",
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
  display: "block",
  boxShadow: "8px 8px 0 var(--lc-plum)",
  border: "2px solid var(--lc-plum)",
};

/**
 * Hero artifact render chain, in order of preference:
 *   1. heroVideo (muted/loop/autoplay/playsinline + poster)
 *   2. coverImage
 *   3. legacy hero.artifact image (backward compat)
 *   4. cream placeholder swatch
 */
function renderArtifact(
  hero: CaseStudy["hero"],
  heroVideo: CaseStudy["heroVideo"],
  coverImage: CaseStudy["coverImage"],
): React.ReactNode {
  if (heroVideo?.fileUrl) {
    const posterUrl = heroVideo.posterImage
      ? urlFor(heroVideo.posterImage).width(900).auto("format").url()
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
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={urlFor(coverImage).width(900).auto("format").url()}
        alt={hero?.artifactCaption ?? ""}
        style={heroMediaStyle}
      />
    );
  }

  const art = hero?.artifact;
  const hasImage = Boolean((art as { asset?: unknown } | undefined)?.asset);
  if (hasImage && art) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={urlFor(art).width(900).auto("format").url()}
        alt={hero?.artifactCaption ?? ""}
        style={heroMediaStyle}
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
        caseLabel={`Case ${doc.caseNumber}`}
        tag={doc.featured ? "Featured" : undefined}
      />

      {hero ? (
        <Hero
          eyebrow={hero.eyebrow ?? ""}
          number={{
            prefix: hero.prefix,
            digits: hero.digits,
            suffix: hero.suffix,
            sticker: hero.heroSticker?.text
              ? {
                  text: hero.heroSticker.text,
                  angle: hero.heroSticker.angle ?? 0,
                }
              : undefined,
          }}
          headline={hero.headline ?? ""}
          subhead={hero.subhead ?? ""}
          meta={hero.meta ?? ""}
          artifact={renderArtifact(hero, heroVideo, coverImage)}
          artifactSticker={
            hero.artifactSticker?.text
              ? {
                  text: hero.artifactSticker.text,
                  angle: hero.artifactSticker.angle ?? 0,
                  position: (hero.artifactSticker.position ??
                    "bottom-right") as StickerPosition,
                }
              : undefined
          }
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
          <CaseGalleryDrag items={gallery} />
        ) : (
          <CaseGallery items={gallery} />
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

      {quote?.text ? (
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
          caseLabel={`Case ${upNext.next.caseNumber ?? ""} · ${upNext.next.discipline ?? ""}`}
          descriptor={upNext.descriptor ?? ""}
          psText={upNext.psLine}
        />
      ) : null}

      <Footer />
    </Page>
  );
}
