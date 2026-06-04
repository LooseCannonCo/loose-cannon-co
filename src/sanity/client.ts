import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Fresh reads (no CDN cache lag). Static case study pages are cached by
  // Next's SSG/ISR anyway, so this mainly keeps dev + just-migrated content live.
  useCdn: false,
  // Published only. With a token the default "raw" perspective returns BOTH a
  // published doc and its draft (drafts.*), which made every case with an open
  // draft list twice on /work (Ayye had drafts.caseStudy.ayye alongside
  // caseStudy.ayye). "published" drops drafts so each case appears once.
  perspective: "published",
  // Server-only token so reads work even when the dataset gates reads behind
  // auth. Next replaces non-NEXT_PUBLIC_ env with undefined in client bundles,
  // so this never reaches the browser. Prefers a dedicated read token if set.
  token:
    process.env.SANITY_API_READ_TOKEN || process.env.SANITY_WRITE_TOKEN,
});
