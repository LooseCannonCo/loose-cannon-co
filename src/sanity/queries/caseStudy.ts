import { groq } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url";

/** Lightweight list for the work index (built later). */
export const getAllCaseStudies = groq`*[_type == "caseStudy"] | order(caseNumber asc){
  "slug": slug.current,
  client,
  caseNumber,
  discipline
}`;

/** Full case study by slug, with the up-next reference dereferenced. */
export const getCaseStudyBySlug = groq`*[_type == "caseStudy" && slug.current == $slug][0]{
  ...,
  upNext{
    descriptor,
    psLine,
    "next": caseRef->{ "slug": slug.current, client, caseNumber, discipline }
  }
}`;

export type StickerPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left";

export interface StickerData {
  text?: string;
  angle?: number;
}

export interface CaseStudyHero {
  eyebrow?: string;
  prefix?: string;
  digits: string;
  suffix?: string;
  heroSticker?: StickerData;
  headline?: string;
  subhead?: string;
  meta?: string[];
  artifact?: SanityImageSource;
  artifactCaption?: string;
  artifactSticker?: StickerData & { position?: StickerPosition };
}

export interface BriefBreakdownItemData {
  title?: string;
  sub?: string;
  body?: string;
  stat?: string;
}

export interface CaseStudyBrief {
  eyebrow?: string;
  headline?: string;
  body?: string[];
  breakdown?: { type?: "threeCol" | "threeStep"; items?: BriefBreakdownItemData[] };
}

export interface NineTileData {
  label?: string;
  kind?: "image" | "review" | "editorial" | "placeholder";
  tone?: "pink" | "dark" | "cream";
  image?: SanityImageSource;
}

export interface VideoData {
  label?: string;
  platform?: string;
  aspect?: string;
}

export interface ContentSectionData {
  type?: "nineGrid" | "threeUpVideo";
  tiles?: NineTileData[];
  videos?: VideoData[];
}

export interface TrioCellData {
  chartType: "ringFill" | "barComparison";
  config?: {
    percent?: number;
    prior?: number;
    current?: number;
    priorLabel?: string;
    currentLabel?: string;
    prefix?: string;
    digits?: string;
    unit?: string;
    caption?: string;
    source?: string;
  };
}

export interface StatsTrioData {
  eyebrow?: string;
  title?: string;
  explanation?: string;
  cells?: TrioCellData[];
}

export interface QuoteData {
  text?: string;
  attribution?: { name?: string; role?: string };
}

export interface CreditData {
  label?: string;
  name?: string;
}

export interface UpNextData {
  descriptor?: string;
  psLine?: string;
  next?: {
    slug?: string;
    client?: string;
    caseNumber?: string;
    discipline?: string;
  } | null;
}

export interface CaseStudy {
  _id: string;
  client: string;
  discipline: string;
  year: string;
  caseNumber: string;
  featured?: boolean;
  slug?: { current?: string };
  hero?: CaseStudyHero;
  brief?: CaseStudyBrief;
  contentSection?: ContentSectionData;
  statsTrio?: StatsTrioData;
  quote?: QuoteData;
  credits?: CreditData[];
  upNext?: UpNextData;
}

export interface CaseStudyListItem {
  slug: string;
  client: string;
  caseNumber: string;
  discipline: string;
}
