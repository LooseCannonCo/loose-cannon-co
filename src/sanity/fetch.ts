// sanity/fetch.ts
// Draft-aware fetch used by pages. Two modes:
//
// - Normal visitors: identical to the old direct client.fetch (published
//   content, same caching), so production behavior is unchanged.
// - Draft mode (enabled by the Presentation tool via /api/draft-mode/enable):
//   fetches draft content uncached, with stega markers embedded so the
//   Presentation tool can draw click-to-edit overlays.
//
// Next 14 nuance that makes this safe for static pages: draftMode() reads as
// disabled at build time (pages stay SSG), and only when the draft cookie is
// present does the route render dynamically per-request.

import { draftMode } from "next/headers";
import type { QueryParams } from "next-sanity";

import { client } from "./client";

const token =
  process.env.SANITY_API_READ_TOKEN || process.env.SANITY_WRITE_TOKEN;

export async function sanityFetch<T>({
  query,
  params = {},
}: {
  query: string;
  params?: QueryParams;
}): Promise<T> {
  if (draftMode().isEnabled) {
    if (!token) {
      throw new Error(
        "Draft preview needs SANITY_API_READ_TOKEN or SANITY_WRITE_TOKEN to be set.",
      );
    }
    return client.fetch<T>(query, params, {
      token,
      perspective: "previewDrafts",
      useCdn: false,
      stega: true,
      cache: "no-store",
    });
  }
  return client.fetch<T>(query, params);
}
