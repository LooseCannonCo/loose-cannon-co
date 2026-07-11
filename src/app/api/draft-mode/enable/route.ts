// Entry point the Presentation tool calls to switch the site into draft mode.
// next-sanity validates the signed preview secret (created by the Studio) and
// sets Next's draft-mode cookie, then redirects to the page being previewed.
// Never call this by hand; the Studio generates the secret per session.

import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { client } from "@/sanity/client";

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({
    token:
      process.env.SANITY_API_READ_TOKEN || process.env.SANITY_WRITE_TOKEN,
  }),
});
