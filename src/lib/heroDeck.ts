// lib/heroDeck.ts
// GROQ query + typed fetch for the homepage hero deck.

import { groq } from 'next-sanity';

import { sanityFetch } from '@/sanity/fetch';
import type { HeroCard } from '@/components/HeroDeck/heroDeck.types';

export const HERO_DECK_QUERY = groq`
  *[_type == "homeHero"][0]{
    deck[]{
      _key,
      "cardType": _type,
      // poster + post (shared image field)
      num, title, "imageUrl": image.asset->url,
      // post
      alt, "hotspot": image.hotspot, "linkUrl": link,
      "ratio": image.asset->metadata.dimensions.aspectRatio,
      // quote
      eyebrow,
      // shared text
      text,
      // review / ayyeReview
      name, role, helpful, accentText, "avatarUrl": avatar.asset->url,
      // ayyeReceipt
      head, sub, lines[]{label, value}, totalLabel, totalValue
    }
  }
`;

export type HeroDeckResponse = { deck?: HeroCard[] };

export async function getHeroDeck(): Promise<HeroCard[]> {
  const data = await sanityFetch<HeroDeckResponse>({ query: HERO_DECK_QUERY });
  return data?.deck ?? [];
}
