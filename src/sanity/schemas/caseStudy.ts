import { defineArrayMember, defineField, defineType } from "sanity";

const STICKER_FIELDS = [
  defineField({ name: "text", title: "Text", type: "string" }),
  defineField({
    name: "angle",
    title: "Angle (deg, -14 to +10)",
    type: "number",
    initialValue: 0,
  }),
];

const POSITION_LIST = [
  "top-right",
  "top-left",
  "bottom-right",
  "bottom-left",
];

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  fields: [
    defineField({
      name: "client",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "discipline",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "year",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "caseNumber",
      title: "Case number (e.g. 001)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "client", maxLength: 96 },
      validation: (r) => r.required(),
    }),

    // ── Cover ─────────────────────────────────────────────────────────────
    // Thumbnail used in case row listings on /work and the home featured-work
    // section. Separate from hero.artifact (which is the full poster used on
    // the case study detail page). Optional: row falls back to an on-brand
    // halftone print swatch when empty.
    defineField({
      name: "coverImage",
      title: "Cover image (case row thumbnail)",
      type: "image",
      options: { hotspot: true },
    }),

    // ── Hero video (optional, for motion-led cases like Smolotov) ─────────
    // When set, the case detail hero renders this as muted/loop/autoplay/
    // playsinline video using posterImage as the poster. Card thumbnails fall
    // back to posterImage when coverImage is empty.
    defineField({
      name: "heroVideo",
      title: "Hero video (optional, motion-led cases)",
      type: "object",
      fields: [
        defineField({
          name: "file",
          title: "Video file (mp4)",
          type: "file",
          options: { accept: "video/mp4" },
        }),
        defineField({
          name: "posterImage",
          title: "Poster image (also used as card thumbnail fallback)",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),

    // ── Gallery title block (optional, sits above the gallery grid) ──────
    // Renders only when `galleryTitle` is set. Same eyebrow + section-title +
    // intro lockup as the StatsTrio title block, so cases that need to frame
    // their gallery as a chapter (Ayye "What we built.") get a proper title;
    // image-only galleries (FITAID) leave these blank and the section renders
    // just the eyebrow + grid as before.
    defineField({
      name: "galleryEyebrow",
      title: "Gallery eyebrow (optional)",
      type: "string",
    }),
    defineField({
      name: "galleryTitle",
      title: "Gallery title (optional, enables the title block)",
      type: "string",
    }),
    defineField({
      name: "galleryIntro",
      title: "Gallery intro (optional, short paragraph)",
      type: "text",
      rows: 2,
    }),

    // ── Gallery ───────────────────────────────────────────────────────────
    // Arbitrary set of post/asset images. FITAID uses this for the social
    // post grid. Each entry is an image with optional alt + caption.
    defineField({
      name: "gallery",
      title: "Gallery (social posts, additional assets)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "image",
              type: "image",
              options: { hotspot: true },
              validation: (r) => r.required(),
            }),
            defineField({ name: "alt", title: "Alt text", type: "string" }),
            defineField({
              name: "caption",
              title: "Caption (short, optional)",
              type: "string",
            }),
          ],
          preview: {
            select: { media: "image", title: "caption", subtitle: "alt" },
          },
        }),
      ],
    }),

    // ── Feature image (optional, full-bleed cinematic beat) ──────────────
    // Renders edge-to-edge between the Brief and the content gallery. Hotspot
    // + crop are enabled so the editor controls the focal point when a tall
    // source gets cropped to a wide cinematic band. Caption is optional and
    // renders eyebrow-style bottom-left. No image = the whole section skips.
    defineField({
      name: "featureImage",
      title: "Feature image (full-bleed, optional)",
      type: "object",
      fields: [
        defineField({
          name: "image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({ name: "alt", title: "Alt text", type: "string" }),
        defineField({
          name: "caption",
          title: "Caption (short, optional, bottom-left)",
          type: "string",
        }),
      ],
    }),

    // ── Hero ──────────────────────────────────────────────────────────────
    defineField({
      name: "hero",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", type: "string" }),
        defineField({ name: "prefix", title: "Prefix (e.g. + or $)", type: "string" }),
        // Optional: leave blank to render a stat-less hero (eyebrow + headline +
        // subhead + meta + artifact, no big number block).
        defineField({
          name: "digits",
          title: "Digits (leave blank for a no-number hero)",
          type: "string",
        }),
        defineField({ name: "suffix", title: "Suffix (e.g. % or K)", type: "string" }),
        defineField({
          name: "heroSticker",
          type: "object",
          fields: STICKER_FIELDS,
        }),
        defineField({ name: "headline", type: "text", rows: 2 }),
        defineField({ name: "subhead", type: "text", rows: 2 }),
        defineField({
          name: "meta",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({
          name: "artifact",
          title: "Artifact image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "artifactCaption",
          title: "Artifact caption (shown as placeholder until an image is uploaded)",
          type: "string",
        }),
        defineField({
          name: "artifactSticker",
          type: "object",
          fields: [
            ...STICKER_FIELDS,
            defineField({
              name: "position",
              type: "string",
              options: { list: POSITION_LIST },
            }),
          ],
        }),
      ],
    }),

    // ── Brief ─────────────────────────────────────────────────────────────
    defineField({
      name: "brief",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", type: "string" }),
        defineField({ name: "headline", type: "text", rows: 3 }),
        defineField({
          name: "body",
          title: "Body paragraphs",
          type: "array",
          of: [defineArrayMember({ type: "text" })],
        }),
        defineField({
          name: "breakdown",
          type: "object",
          fields: [
            defineField({
              name: "type",
              type: "string",
              options: { list: ["threeCol", "threeStep"] },
              initialValue: "threeCol",
            }),
            defineField({
              name: "items",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({ name: "title", type: "string" }),
                    defineField({ name: "sub", type: "string" }),
                    defineField({ name: "body", type: "text", rows: 3 }),
                    defineField({
                      name: "stat",
                      title: "Stat line (three-step only)",
                      type: "string",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    // ── Content section ───────────────────────────────────────────────────
    defineField({
      name: "contentSection",
      type: "object",
      fields: [
        defineField({
          name: "type",
          type: "string",
          options: { list: ["nineGrid", "threeUpVideo"] },
          initialValue: "nineGrid",
        }),
        defineField({
          name: "tiles",
          title: "Tiles (nineGrid)",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "label", type: "string" }),
                defineField({
                  name: "kind",
                  type: "string",
                  options: { list: ["image", "review", "editorial", "placeholder"] },
                  initialValue: "image",
                }),
                defineField({
                  name: "tone",
                  type: "string",
                  options: { list: ["pink", "dark", "cream"] },
                  initialValue: "pink",
                }),
                defineField({
                  name: "image",
                  type: "image",
                  options: { hotspot: true },
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: "videos",
          title: "Videos (threeUpVideo)",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "label", type: "string" }),
                defineField({ name: "platform", type: "string" }),
                defineField({ name: "file", type: "file" }),
                defineField({
                  name: "aspect",
                  type: "string",
                  options: { list: ["4x5", "1x1", "9x16"] },
                  initialValue: "4x5",
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    // ── Stats trio ────────────────────────────────────────────────────────
    defineField({
      name: "statsTrio",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", type: "string" }),
        defineField({ name: "title", type: "string", initialValue: "The receipts." }),
        defineField({ name: "explanation", type: "text", rows: 2 }),
        defineField({
          name: "cells",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "chartType",
                  type: "string",
                  options: { list: ["ringFill", "barComparison"] },
                  validation: (r) => r.required(),
                }),
                defineField({
                  name: "config",
                  type: "object",
                  fields: [
                    defineField({ name: "percent", title: "Ring fill % (ringFill)", type: "number" }),
                    defineField({ name: "prior", title: "Prior value (barComparison)", type: "number" }),
                    defineField({ name: "current", title: "Current value (barComparison)", type: "number" }),
                    defineField({ name: "priorLabel", type: "string" }),
                    defineField({ name: "currentLabel", type: "string" }),
                    defineField({ name: "prefix", type: "string" }),
                    defineField({ name: "digits", type: "string" }),
                    defineField({ name: "unit", type: "string" }),
                    defineField({ name: "caption", type: "string" }),
                    defineField({ name: "source", type: "string" }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    // ── Quote ─────────────────────────────────────────────────────────────
    defineField({
      name: "quote",
      type: "object",
      fields: [
        defineField({ name: "text", type: "text", rows: 3 }),
        defineField({
          name: "attribution",
          type: "object",
          fields: [
            defineField({ name: "name", type: "string" }),
            defineField({ name: "role", type: "string" }),
          ],
        }),
      ],
    }),

    // ── Credits ───────────────────────────────────────────────────────────
    defineField({
      name: "credits",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "name", type: "string" }),
          ],
          preview: {
            select: { title: "name", subtitle: "label" },
          },
        }),
      ],
    }),

    // ── Up next ───────────────────────────────────────────────────────────
    defineField({
      name: "upNext",
      type: "object",
      fields: [
        defineField({
          name: "caseRef",
          title: "Next case",
          type: "reference",
          to: [{ type: "caseStudy" }],
        }),
        defineField({ name: "descriptor", type: "string" }),
        defineField({
          name: "psLine",
          title: "P.S. line (optional override)",
          type: "string",
        }),
      ],
    }),
  ],

  preview: {
    select: { title: "client", caseNumber: "caseNumber", media: "hero.artifact" },
    prepare({ title, caseNumber }) {
      return {
        title: title ?? "Untitled case",
        subtitle: caseNumber ? `Case ${caseNumber}` : undefined,
      };
    },
  },
});
