// sanity/schemas/caseStudy.ts
// Editor-first schema for case study pages (/work/[slug]).
//
// IMPORTANT (data safety): every field `name` and `type` here is unchanged
// from the original schema. Only presentation changed: titles, descriptions,
// groups (tabs), fieldsets, conditional visibility, previews, and
// warning-level validation. Existing documents are untouched.
//
// Tabs are numbered in the order sections render on the live page, so the
// Studio form reads top-to-bottom like the page itself.

import { defineArrayMember, defineField, defineType } from "sanity";

const STICKER_FIELDS = [
  defineField({
    name: "text",
    title: "Sticker text",
    type: "string",
    description: "Short and punchy, 2 to 4 words. Leave empty for no sticker.",
  }),
  defineField({
    name: "angle",
    title: "Tilt (degrees)",
    type: "number",
    initialValue: 0,
    description:
      "How tilted the sticker sits. 0 is straight. Use -14 to 10 for the house look.",
    validation: (r) =>
      r
        .min(-14)
        .max(10)
        .warning("Keep between -14 and 10 so it matches the rest of the site."),
  }),
];

const POSITION_LIST = [
  { title: "Top right", value: "top-right" },
  { title: "Top left", value: "top-left" },
  { title: "Bottom right", value: "bottom-right" },
  { title: "Bottom left", value: "bottom-left" },
];

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",

  groups: [
    { name: "basics", title: "1. Basics", default: true },
    { name: "hero", title: "2. Top of page" },
    { name: "brief", title: "3. The brief" },
    { name: "media", title: "4. Images & video" },
    { name: "results", title: "5. Results & quote" },
    { name: "ending", title: "6. End of page" },
  ],

  fieldsets: [
    {
      name: "galleryHeading",
      title: "Gallery heading (optional)",
      description:
        "Adds an intro block above the gallery, like a chapter title. Leave all three empty and the gallery shows on its own.",
      options: { collapsible: true, collapsed: true },
    },
  ],

  fields: [
    // Shown only on the Ayye document, which is served by a custom-coded page.
    defineField({
      name: "editorNote",
      title: "Heads up: this page is custom-built",
      type: "string",
      group: "basics",
      readOnly: true,
      hidden: ({ document }) =>
        (document?.slug as { current?: string } | undefined)?.current !== "ayye",
      description:
        "The Ayye page at /work/ayye is custom-coded. Most fields in this document will NOT change that page. Check with your developer before editing here.",
    }),

    // ── 1. Basics ─────────────────────────────────────────────────────────
    defineField({
      name: "client",
      title: "Client name",
      type: "string",
      group: "basics",
      description:
        "The brand this case is about, e.g. FITAID. Shown all over the site.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "discipline",
      title: "Type of work",
      type: "string",
      group: "basics",
      description:
        "A short label, e.g. Social-first content. Shown next to the client name.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      group: "basics",
      description:
        "e.g. 2025. Also controls ordering on the Work page (newest first).",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "caseNumber",
      title: "Case number",
      type: "string",
      group: "basics",
      description:
        "Three digits, e.g. 001. Shown on the page and used for ordering.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "featured",
      title: "Show on homepage",
      type: "boolean",
      group: "basics",
      initialValue: false,
      description:
        "Turn on to feature this case in the homepage work list. The homepage shows up to 3 featured cases.",
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      group: "basics",
      options: { source: "client", maxLength: 96 },
      description:
        "The page URL: loosecannon.co/work/<this>. Click Generate to create it from the client name. Do not change it after the page is live, or shared links will break.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      group: "basics",
      options: { hotspot: true },
      description:
        "The main image for this case. Used at the top of the case page and as the thumbnail on the Work page and homepage. Portrait works best: at least 1080 x 1350 px (4:5). Drag the circle on the image to set the focal point.",
      validation: (r) =>
        r
          .required()
          .warning(
            "Without a cover, the site falls back to the video poster or a plain color swatch.",
          ),
    }),

    // ── 2. Top of page ────────────────────────────────────────────────────
    defineField({
      name: "heroVideo",
      title: "Video at the top (optional)",
      type: "object",
      group: "hero",
      description:
        "Only for motion-led cases. If a video is added, it plays silently on loop at the top of the case page instead of the cover image.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "file",
          title: "Video file",
          type: "file",
          options: { accept: "video/mp4" },
          description:
            "MP4 only. Keep it short and under about 10 MB so the page stays fast.",
        }),
        defineField({
          name: "posterImage",
          title: "Video still image",
          type: "image",
          options: { hotspot: true },
          description:
            "Shown while the video loads, and used as the thumbnail if there is no cover image. Portrait, at least 1080 x 1350 px (4:5).",
        }),
      ],
    }),
    defineField({
      name: "hero",
      title: "Headline & big number",
      type: "object",
      group: "hero",
      description:
        "The first thing visitors see: a small label, a big stat, and the headline.",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Small label",
          type: "string",
          description: "The tiny line above everything, e.g. Case 002. FITAID.",
        }),
        defineField({
          name: "prefix",
          title: "Symbol before the number",
          type: "string",
          description: "Optional, e.g. + or $. Sits in front of the big number.",
        }),
        defineField({
          name: "digits",
          title: "The big number",
          type: "string",
          description:
            "Just the number, e.g. 312. Leave empty and the page shows no big number at all (headline only).",
        }),
        defineField({
          name: "suffix",
          title: "Symbol after the number",
          type: "string",
          description: "Optional, e.g. % or K. Sits after the big number.",
        }),
        defineField({
          name: "heroSticker",
          title: "Sticker on the number (optional)",
          type: "object",
          options: { collapsible: true, collapsed: true },
          fields: STICKER_FIELDS,
        }),
        defineField({
          name: "headline",
          title: "Headline",
          type: "text",
          rows: 2,
          description:
            "The big statement. Press Enter to control where the line breaks.",
        }),
        defineField({
          name: "subhead",
          title: "Subheadline",
          type: "text",
          rows: 2,
          description: "One or two supporting sentences under the headline.",
        }),
        defineField({
          name: "meta",
          title: "Quick facts",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          description:
            "Short lines under the subheadline, e.g. Instagram + TikTok. Add 2 to 4.",
        }),
        defineField({
          name: "artifact",
          title: "Hero image (old field)",
          type: "image",
          options: { hotspot: true },
          description:
            "Old field from earlier cases. New cases should use the Cover image on the Basics tab instead. This image only shows if there is no video and no cover image.",
        }),
        defineField({
          name: "artifactCaption",
          title: "Hero image caption",
          type: "string",
          description:
            "Describes the hero image (used for accessibility, and shown as placeholder text if no image is set).",
        }),
        defineField({
          name: "artifactSticker",
          title: "Sticker on the hero image (optional)",
          type: "object",
          options: { collapsible: true, collapsed: true },
          fields: [
            ...STICKER_FIELDS,
            defineField({
              name: "position",
              title: "Corner",
              type: "string",
              options: { list: POSITION_LIST },
              description: "Which corner of the image the sticker sits on.",
            }),
          ],
        }),
      ],
    }),

    // ── 3. The brief ──────────────────────────────────────────────────────
    defineField({
      name: "brief",
      title: "The brief",
      type: "object",
      group: "brief",
      description: "The story section: what the client needed and what we did.",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Small label",
          type: "string",
          description: "The tiny line above this section, e.g. The brief.",
        }),
        defineField({
          name: "headline",
          title: "Section headline",
          type: "text",
          rows: 3,
          description: "Press Enter to control where the lines break.",
        }),
        defineField({
          name: "body",
          title: "Paragraphs",
          type: "array",
          of: [defineArrayMember({ type: "text" })],
          description:
            "Each item is one paragraph. Keep them short: 2 to 4 sentences each.",
        }),
        defineField({
          name: "breakdown",
          title: "The three-part breakdown",
          type: "object",
          description:
            "Three cards under the story, e.g. Strategy / Design / Content.",
          options: { collapsible: true, collapsed: false },
          fields: [
            defineField({
              name: "type",
              title: "Layout",
              type: "string",
              options: {
                list: [
                  { title: "Three columns, side by side", value: "threeCol" },
                  { title: "Three numbered steps, stacked", value: "threeStep" },
                ],
                layout: "radio",
              },
              initialValue: "threeCol",
            }),
            defineField({
              name: "items",
              title: "The three parts",
              type: "array",
              description: "Add exactly 3 for the layout to look right.",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({
                      name: "title",
                      title: "Title",
                      type: "string",
                      description: "e.g. Strategy.",
                    }),
                    defineField({
                      name: "sub",
                      title: "Small subtitle",
                      type: "string",
                      description: "Optional, e.g. Phase 01.",
                    }),
                    defineField({
                      name: "body",
                      title: "Text",
                      type: "text",
                      rows: 3,
                      description: "One short paragraph.",
                    }),
                    defineField({
                      name: "stat",
                      title: "Stat line",
                      type: "string",
                      description:
                        "Optional, e.g. +48% engagement. Only shows in the numbered-steps layout.",
                    }),
                  ],
                  preview: { select: { title: "title", subtitle: "sub" } },
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    // ── 4. Images & video ─────────────────────────────────────────────────
    defineField({
      name: "featureImage",
      title: "Full-width image (optional)",
      type: "object",
      group: "media",
      description:
        "One big cinematic image between the brief and the gallery. Leave the image empty and this whole section is skipped.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
          description:
            "Shown edge to edge, so it needs to be big: at least 1920 px wide, ideally 2400 px. Drag the circle on the image to keep the important part in frame when it gets cropped wide.",
        }),
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Describes the image for screen readers and Google. One short sentence.",
        }),
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
          description:
            "Optional. Small text over the bottom-left corner of the image.",
        }),
      ],
    }),
    defineField({
      name: "contentSection",
      title: "Video showcase (optional)",
      type: "object",
      group: "media",
      description:
        "A row of videos, for motion-led cases. Most cases use the gallery below instead.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "type",
          title: "Show this section?",
          type: "string",
          options: {
            list: [
              { title: "Yes: three videos side by side", value: "threeUpVideo" },
              {
                title: "No (old grid, no longer shown on the site)",
                value: "nineGrid",
              },
            ],
            layout: "radio",
          },
          initialValue: "nineGrid",
        }),
        defineField({
          name: "videos",
          title: "Videos",
          type: "array",
          hidden: ({ parent }) => parent?.type !== "threeUpVideo",
          description: "Add 3 for the layout to look right.",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "label",
                  title: "Label",
                  type: "string",
                  description: "Small caption under the video, e.g. Launch spot.",
                }),
                defineField({
                  name: "platform",
                  title: "Platform",
                  type: "string",
                  description: "e.g. Instagram, TikTok. Shown next to the label.",
                }),
                defineField({
                  name: "file",
                  title: "Video file",
                  type: "file",
                  description: "MP4, silent, under about 10 MB.",
                }),
                defineField({
                  name: "aspect",
                  title: "Shape",
                  type: "string",
                  options: {
                    list: [
                      { title: "Portrait 4:5 (feed post)", value: "4x5" },
                      { title: "Square 1:1", value: "1x1" },
                      { title: "Vertical 9:16 (Reels / TikTok)", value: "9x16" },
                    ],
                  },
                  initialValue: "4x5",
                }),
              ],
              preview: { select: { title: "label", subtitle: "platform" } },
            }),
          ],
        }),
        // Legacy grid from the first site build. The site no longer renders
        // these tiles; kept so old content stays visible and editable if a
        // document still has them.
        defineField({
          name: "tiles",
          title: "Old grid tiles (no longer shown on the site)",
          type: "array",
          hidden: ({ parent }) => parent?.type !== "nineGrid",
          description:
            "Left over from an earlier version of the site. These do not appear anywhere anymore. Use the Gallery below instead.",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "label", title: "Label", type: "string" }),
                defineField({
                  name: "kind",
                  title: "Kind",
                  type: "string",
                  options: {
                    list: ["image", "review", "editorial", "placeholder"],
                  },
                  initialValue: "image",
                }),
                defineField({
                  name: "tone",
                  title: "Tone",
                  type: "string",
                  options: { list: ["pink", "dark", "cream"] },
                  initialValue: "pink",
                }),
                defineField({
                  name: "image",
                  title: "Image",
                  type: "image",
                  options: { hotspot: true },
                }),
              ],
              preview: {
                select: { title: "label", subtitle: "kind", media: "image" },
              },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "galleryEyebrow",
      title: "Small label",
      type: "string",
      group: "media",
      fieldset: "galleryHeading",
      description: "The tiny line above the gallery heading, e.g. The work.",
    }),
    defineField({
      name: "galleryTitle",
      title: "Gallery heading",
      type: "string",
      group: "media",
      fieldset: "galleryHeading",
      description:
        "e.g. What we built. Filling this in is what turns the heading block on.",
    }),
    defineField({
      name: "galleryIntro",
      title: "Short intro",
      type: "text",
      rows: 2,
      group: "media",
      fieldset: "galleryHeading",
      description: "One or two sentences under the gallery heading.",
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
      description:
        "The images for this case: social posts, designs, photos. With 6 or more images the site shows a swipeable carousel; with fewer, a simple grid. Images display portrait (4:5), so upload at least 1080 x 1350 px and drag the focal-point circle on anything that is not already portrait.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              description:
                "Describes the image for screen readers and Google. One short sentence.",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
              description: "Optional. Small text shown with the image.",
            }),
          ],
          preview: {
            select: { media: "image", title: "caption", subtitle: "alt" },
          },
        }),
      ],
    }),

    // ── 5. Results & quote ────────────────────────────────────────────────
    defineField({
      name: "statsTrio",
      title: "Results (the numbers)",
      type: "object",
      group: "results",
      description:
        "The proof section: a heading plus up to three little charts.",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Small label",
          type: "string",
          description: "The tiny line above the heading, e.g. Results.",
        }),
        defineField({
          name: "title",
          title: "Section heading",
          type: "string",
          initialValue: "The receipts.",
        }),
        defineField({
          name: "explanation",
          title: "Short intro",
          type: "text",
          rows: 2,
          description: "One or two sentences of context for the numbers.",
        }),
        defineField({
          name: "cells",
          title: "The charts",
          type: "array",
          description:
            "Add up to 3. Each one is a small chart with a big number and caption.",
          of: [
            defineArrayMember({
              type: "object",
              preview: {
                select: {
                  chartType: "chartType",
                  digits: "config.digits",
                  caption: "config.caption",
                },
                prepare({ chartType, digits, caption }) {
                  return {
                    title: caption || digits || "Chart",
                    subtitle:
                      chartType === "barComparison" ? "Bar chart" : "Ring chart",
                  };
                },
              },
              fields: [
                defineField({
                  name: "chartType",
                  title: "Chart style",
                  type: "string",
                  options: {
                    list: [
                      {
                        title: "Ring (a circle that fills to a percentage)",
                        value: "ringFill",
                      },
                      {
                        title: "Bars (before vs after comparison)",
                        value: "barComparison",
                      },
                    ],
                    layout: "radio",
                  },
                  validation: (r) => r.required(),
                }),
                defineField({
                  name: "config",
                  title: "Chart settings",
                  type: "object",
                  description:
                    "Fill in the group that matches your chart style above, plus the big number and caption at the bottom.",
                  fieldsets: [
                    {
                      name: "ring",
                      title: "For the Ring style only",
                      options: { collapsible: true, collapsed: false },
                    },
                    {
                      name: "bars",
                      title: "For the Bars style only",
                      options: { collapsible: true, collapsed: false },
                    },
                    {
                      name: "number",
                      title: "Big number & caption (all styles)",
                      options: { collapsible: true, collapsed: false },
                    },
                  ],
                  fields: [
                    defineField({
                      name: "percent",
                      title: "How full the ring is (%)",
                      type: "number",
                      fieldset: "ring",
                      description: "0 to 100.",
                      validation: (r) =>
                        r
                          .min(0)
                          .max(100)
                          .warning("Should be between 0 and 100."),
                    }),
                    defineField({
                      name: "prior",
                      title: "Before value",
                      type: "number",
                      fieldset: "bars",
                      description: "Just the number, e.g. 120.",
                    }),
                    defineField({
                      name: "current",
                      title: "After value",
                      type: "number",
                      fieldset: "bars",
                      description: "Just the number, e.g. 480.",
                    }),
                    defineField({
                      name: "priorLabel",
                      title: "Before label",
                      type: "string",
                      fieldset: "bars",
                      description: "e.g. Before.",
                    }),
                    defineField({
                      name: "currentLabel",
                      title: "After label",
                      type: "string",
                      fieldset: "bars",
                      description: "e.g. After.",
                    }),
                    defineField({
                      name: "prefix",
                      title: "Symbol before the number",
                      type: "string",
                      fieldset: "number",
                      description: "Optional, e.g. + or $.",
                    }),
                    defineField({
                      name: "digits",
                      title: "The big number",
                      type: "string",
                      fieldset: "number",
                      description: "e.g. 312.",
                    }),
                    defineField({
                      name: "unit",
                      title: "Symbol after the number",
                      type: "string",
                      fieldset: "number",
                      description: "Optional, e.g. % or K.",
                    }),
                    defineField({
                      name: "caption",
                      title: "Caption",
                      type: "string",
                      fieldset: "number",
                      description:
                        "What the number means, e.g. Engagement rate lift.",
                    }),
                    defineField({
                      name: "source",
                      title: "Source",
                      type: "string",
                      fieldset: "number",
                      description:
                        "Where the number comes from, e.g. Meta insights, Q3 2025.",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "quote",
      title: "Client quote (optional)",
      type: "object",
      group: "results",
      description:
        "A pull quote from the client. Leave the quote text empty and the section is skipped.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "text",
          title: "The quote",
          type: "text",
          rows: 3,
          description: "No quotation marks needed; the design adds them.",
        }),
        defineField({
          name: "attribution",
          title: "Who said it",
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({
              name: "role",
              title: "Role",
              type: "string",
              description: "e.g. Marketing Director, FITAID.",
            }),
          ],
        }),
      ],
    }),

    // ── 6. End of page ────────────────────────────────────────────────────
    defineField({
      name: "credits",
      title: "Credits",
      type: "array",
      group: "ending",
      description: "Who worked on it. Each entry is a role plus a name.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Role",
              type: "string",
              description: "e.g. Creative Direction.",
            }),
            defineField({ name: "name", title: "Name", type: "string" }),
          ],
          preview: {
            select: { title: "name", subtitle: "label" },
          },
        }),
      ],
    }),
    defineField({
      name: "upNext",
      title: "Up next",
      type: "object",
      group: "ending",
      description:
        "The teaser at the very bottom that sends visitors to another case.",
      fields: [
        defineField({
          name: "caseRef",
          title: "Which case to tease",
          type: "reference",
          to: [{ type: "caseStudy" }],
          description:
            "Pick another case study. Its name and cover fill in automatically.",
        }),
        defineField({
          name: "descriptor",
          title: "One-line description",
          type: "string",
          description: "A short teaser line about that case.",
        }),
        defineField({
          name: "psLine",
          title: "P.S. line",
          type: "string",
          description: "Optional. Replaces the default P.S. line under the teaser.",
        }),
      ],
    }),
  ],

  orderings: [
    {
      name: "caseNumberAsc",
      title: "Case number",
      by: [{ field: "caseNumber", direction: "asc" }],
    },
    {
      name: "yearDesc",
      title: "Newest first",
      by: [{ field: "year", direction: "desc" }],
    },
  ],

  preview: {
    select: {
      client: "client",
      caseNumber: "caseNumber",
      year: "year",
      featured: "featured",
      cover: "coverImage",
      poster: "heroVideo.posterImage",
      artifact: "hero.artifact",
    },
    prepare({ client, caseNumber, year, featured, cover, poster, artifact }) {
      const subtitle = [
        caseNumber ? `Case ${caseNumber}` : null,
        year ?? null,
        featured ? "On homepage" : null,
      ]
        .filter(Boolean)
        .join(" · ");
      return {
        title: client ?? "Untitled case",
        subtitle: subtitle || undefined,
        media: cover ?? poster ?? artifact,
      };
    },
  },
});
