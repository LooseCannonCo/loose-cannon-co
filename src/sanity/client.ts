import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Fresh reads (no CDN cache lag). Static case study pages are cached by
  // Next's SSG/ISR anyway, so this mainly keeps dev + just-migrated content live.
  useCdn: false,
  // Server-only token so reads work even when the dataset gates reads behind
  // auth. Next replaces non-NEXT_PUBLIC_ env with undefined in client bundles,
  // so this never reaches the browser. Prefers a dedicated read token if set.
  token:
    process.env.SANITY_API_READ_TOKEN || process.env.SANITY_WRITE_TOKEN,
});
