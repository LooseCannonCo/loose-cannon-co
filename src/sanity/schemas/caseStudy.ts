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

    // ── Hero ──────────────────────────────────────────────────────────────
    defineField({
      name: "hero",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", type: "string" }),
        defineField({ name: "prefix", title: "Prefix (e.g. + or $)", type: "string" }),
        defineField({
          name: "digits",
          type: "string",
          validation: (r) => r.required(),
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
