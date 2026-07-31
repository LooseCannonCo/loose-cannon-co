// sanity/schemas/post.ts
// Editor-first schema for the "Blah Blah Blah" blog (/blog and /blog/[slug]).
//
// This is the form Briana (or Noah) fills out to write a post. Every field
// has a plain-English title and description, every body block has an icon
// and a recognizable preview, and gentle warnings (never hard blocks, except
// the truly required fields) act as the pre-publish checklist: cover image
// added, summary written, alt text on images. Sanity lists those warnings in
// the publish pane, so the checklist shows up exactly when it matters.

import {
  BlockquoteIcon,
  ComposeIcon,
  ImageIcon,
  ImagesIcon,
  InlineElementIcon,
  PlayIcon,
  RemoveIcon,
  SplitVerticalIcon,
} from "@sanity/icons";
import { defineField, defineType } from "sanity";

/** Alt + optional caption, shared by every image the body can hold. */
const imageFields = [
  defineField({
    name: "alt",
    title: "Image description (alt text)",
    type: "string",
    description:
      "Describe the image in a few words, like you would to someone on the phone. Helps Google and screen readers.",
  }),
  defineField({
    name: "caption",
    title: "Caption",
    type: "string",
    description: "Optional. Shows in small text under the image.",
  }),
];

/** Custom validator for a gentle nudge (never a block) when an image is
 *  missing its alt text. Use as rule.custom(missingAlt).warning(). */
const missingAlt = (value: unknown) => {
  const img = value as { asset?: unknown; alt?: string } | undefined;
  return img?.asset && !img.alt
    ? "Add a short image description (alt text) so Google and screen readers can read it."
    : true;
};

export const post = defineType({
  name: "post",
  title: "Blah Blah Blah (Blog Post)",
  type: "document",
  icon: ComposeIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description:
        "The headline of the post. Sentence case, no all caps. Under 70 characters is the sweet spot.",
      validation: (rule) => [
        rule.required().max(120),
        rule
          .max(70)
          .warning(
            "Long titles get cut off in Google results. Under 70 characters is the sweet spot.",
          ),
      ],
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      description:
        "The end of the link, like /blog/your-title. Click Generate to make it from the title.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description:
        "One or two sentences saying what the post is about. Shows on the blog list, and in Google and AI search.",
      validation: (rule) => [
        rule.required().max(200),
        rule
          .min(50)
          .warning(
            "A little short. One or two full sentences (about 50 to 160 characters) reads best.",
          ),
        rule
          .max(160)
          .warning(
            "Google trims summaries around 160 characters. Trim a touch so it shows in full.",
          ),
      ],
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      description:
        "The big image at the top of the post and on the blog list. Landscape works best: at least 1600 x 800 pixels, JPG or PNG.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Image description (alt text)",
          type: "string",
          description:
            "Describe the image in a few words. Helps Google and screen readers.",
        }),
      ],
      validation: (rule) => [
        rule
          .custom((value: unknown) =>
            (value as { asset?: unknown } | undefined)?.asset
              ? true
              : "Add a cover image. Posts without one look bare on the blog list and in shared links.",
          )
          .warning(),
        rule.custom(missingAlt).warning(),
      ],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      description: "Who wrote this.",
      options: {
        list: [
          { title: "Briana Brugh", value: "Briana Brugh" },
          { title: "Noah Charnow", value: "Noah Charnow" },
          { title: "Loose Cannon Co.", value: "Loose Cannon Co." },
        ],
        layout: "radio",
      },
      initialValue: "Briana Brugh",
    }),
    defineField({
      name: "publishedAt",
      title: "Publish date",
      type: "datetime",
      description:
        "The date shown on the post. Set to now automatically; only change it to backdate or schedule the byline.",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      description:
        "The article itself. Write like a normal doc. Click the + between paragraphs to add images, quotes, videos, and more.",
      of: [
        {
          type: "block",
          title: "Text",
          // NOTE: the base block type does not accept an `icon` property
          // (Sanity rejects the schema); only the custom object blocks below
          // carry icons.
          // Trimmed to the styles the blog actually renders, with everyday
          // names. No h1 (the post title owns it), no code, no underline.
          styles: [
            { title: "Normal text", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Small heading", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet list", value: "bullet" },
            { title: "Numbered list", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                type: "object",
                name: "link",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    title: "Web address",
                    type: "url",
                    description: "Paste the full link, starting with https://",
                    validation: (rule) =>
                      rule.uri({ scheme: ["http", "https", "mailto"] }),
                  }),
                ],
              },
            ],
          },
        },
        {
          type: "image",
          title: "Image",
          icon: ImageIcon,
          description:
            "One photo or graphic. At least 1400 pixels wide looks sharp; full bleed wants 2000 or more. JPG or PNG.",
          options: { hotspot: true },
          fields: [
            ...imageFields,
            defineField({
              name: "width",
              title: "Width",
              type: "string",
              description: "How wide the image sits in the article.",
              options: {
                list: [
                  { title: "Small (centered)", value: "small" },
                  { title: "Column width", value: "column" },
                  { title: "Full bleed (edge to edge)", value: "fullBleed" },
                ],
                layout: "radio",
              },
              initialValue: "column",
            }),
          ],
          validation: (rule) => rule.custom(missingAlt).warning(),
        },
        {
          type: "object",
          name: "pullQuote",
          title: "Pull quote",
          icon: BlockquoteIcon,
          description: "A big line pulled out to break up the text.",
          fields: [
            defineField({
              name: "text",
              title: "Quote",
              type: "text",
              rows: 2,
              description: "A line pulled from the article, shown big. Sentence case.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "attribution",
              title: "Attribution",
              type: "string",
              description: "Optional. Who said it, if it is not you.",
            }),
          ],
          preview: {
            select: { text: "text" },
            prepare({ text }) {
              return {
                title: text ?? "Pull quote",
                subtitle: "Pull quote",
                media: BlockquoteIcon,
              };
            },
          },
        },
        {
          type: "object",
          name: "carousel",
          title: "Carousel",
          icon: ImagesIcon,
          description: "A set of images readers swipe through.",
          fields: [
            defineField({
              name: "images",
              title: "Images",
              type: "array",
              description:
                "Add the images in order. Portrait works best: at least 960 x 1200 pixels (4 tall to 5 wide), JPG or PNG.",
              of: [
                {
                  type: "image",
                  options: { hotspot: true },
                  fields: imageFields,
                  validation: (rule) => rule.custom(missingAlt).warning(),
                },
              ],
              validation: (rule) => rule.required().min(2),
            }),
          ],
          preview: {
            select: { images: "images", media: "images.0" },
            prepare({ images, media }) {
              const count = Array.isArray(images) ? images.length : 0;
              return { title: `Carousel · ${count} images`, media };
            },
          },
        },
        {
          type: "object",
          name: "sideBySide",
          title: "Two images side by side",
          icon: SplitVerticalIcon,
          description: "Two images in a row. They stack on phones.",
          fields: [
            defineField({
              name: "images",
              title: "Images",
              type: "array",
              description:
                "Exactly two. Portrait works best: at least 900 x 1125 pixels each, JPG or PNG.",
              of: [
                {
                  type: "image",
                  options: { hotspot: true },
                  fields: imageFields,
                  validation: (rule) => rule.custom(missingAlt).warning(),
                },
              ],
              validation: (rule) => rule.required().length(2),
            }),
          ],
          preview: {
            select: { media: "images.0" },
            prepare({ media }) {
              return { title: "Two images side by side", media };
            },
          },
        },
        {
          type: "object",
          name: "wrappedImage",
          title: "Wrapped image",
          icon: InlineElementIcon,
          description: "A smaller image with your writing flowing around it.",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              description: "At least 800 pixels wide, JPG or PNG.",
              options: { hotspot: true },
              fields: imageFields,
              validation: (rule) => [rule.required(), rule.custom(missingAlt).warning()],
            }),
            defineField({
              name: "side",
              title: "Which side",
              type: "string",
              description: "The image sits on this side; your writing wraps around it.",
              options: {
                list: [
                  { title: "Left", value: "left" },
                  { title: "Right", value: "right" },
                ],
                layout: "radio",
              },
              initialValue: "left",
            }),
          ],
          preview: {
            select: { media: "image", side: "side" },
            prepare({ media, side }) {
              return { title: `Wrapped image · ${side ?? "left"}`, media };
            },
          },
        },
        {
          type: "object",
          name: "videoEmbed",
          title: "Video",
          icon: PlayIcon,
          description: "A video from YouTube or Vimeo, or a short uploaded clip.",
          fields: [
            defineField({
              name: "url",
              title: "YouTube or Vimeo link",
              type: "url",
              description: "Paste the normal watch link. Leave empty if uploading a file.",
            }),
            defineField({
              name: "file",
              title: "Or upload a video file",
              type: "file",
              options: { accept: "video/*" },
              description:
                "Use for short clips. For anything long, YouTube or Vimeo is better.",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
              description: "Optional. Shows in small text under the video.",
            }),
          ],
          validation: (rule) =>
            rule.custom((value?: { url?: string; file?: unknown }) =>
              value?.url || value?.file
                ? true
                : "Add a YouTube or Vimeo link, or upload a video file.",
            ),
          preview: {
            select: { url: "url", caption: "caption" },
            prepare({ url, caption }) {
              return {
                title: "Video",
                subtitle: caption ?? url ?? "Uploaded file",
                media: PlayIcon,
              };
            },
          },
        },
        {
          type: "object",
          name: "sectionBreak",
          title: "Section break",
          icon: RemoveIcon,
          description: "A divider between parts of the post.",
          fields: [
            // Sanity objects need at least one field; this one is invisible.
            // The break itself renders as the three-square print mark.
            defineField({
              name: "style",
              title: "Style",
              type: "string",
              hidden: true,
              initialValue: "marks",
            }),
          ],
          preview: {
            prepare() {
              return { title: "Section break", subtitle: "Divider", media: RemoveIcon };
            },
          },
        },
      ],
    }),
  ],
  orderings: [
    {
      name: "publishedAtDesc",
      title: "Newest first",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      author: "author",
      media: "coverImage",
    },
    prepare({ title, author, media }) {
      return {
        title: title ?? "Untitled post",
        subtitle: author ?? undefined,
        media,
      };
    },
  },
});
