// sanity/schemas/homeHero.ts
// Singleton that curates the homepage hero deck.
// Registered in schemas/index.ts and pinned as a singleton in sanity.config.ts
// (one document, fixed id "homeHero", not creatable repeatedly).
//
// IMPORTANT (data safety): every field `name` and `type` is unchanged from the
// original schema. Only titles, descriptions, and visibility changed.
//
// The `deck` array is the curation surface: add cards, drag to reorder, remove
// to hide. Card order in the array = priority. The front end deals them in a
// random arrangement but surfaces them in this order.

import { defineType, defineField, defineArrayMember } from 'sanity';

// Post: a finished post graphic uploaded as an image. The primary, most-used
// card type, so it sits first in the deck's "Add item" list.
const post = defineArrayMember({
  type: 'object', name: 'post', title: 'Post (upload a finished graphic)',
  fields: [
    defineField({
      name: 'image', title: 'Image', type: 'image', options: { hotspot: true },
      description: 'The finished graphic. Any shape works. At least 1080 px wide so it stays sharp.',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'alt', title: 'Alt text', type: 'string', description: 'Optional. Describes the image for screen readers and Google. One short sentence.' }),
    defineField({ name: 'link', title: 'Link', type: 'url', description: 'Optional. Where the card goes when clicked. A page on this site (e.g. /work/ayye) or a full URL.', validation: (r) => r.uri({ allowRelative: true, scheme: ['http', 'https'] }) }),
  ],
  preview: { select: { media: 'image', title: 'alt' }, prepare: ({ media, title }) => ({ title: title || 'Post', subtitle: 'Post graphic', media }) },
});

const poster = defineArrayMember({
  type: 'object', name: 'poster', title: 'Poster (image + big number)',
  fields: [
    defineField({ name: 'num', title: 'Big number', type: 'string', description: 'The stat shown huge on the card, e.g. 312.', validation: (r) => r.required() }),
    defineField({ name: 'title', title: 'Title', type: 'string', description: 'The line under the number.', validation: (r) => r.required() }),
    defineField({
      name: 'image', title: 'Background photo', type: 'image', options: { hotspot: true },
      description: 'Optional. Sits behind the number. Portrait, at least 1080 x 1350 px (4:5).',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'num' }, prepare: ({ title, subtitle }) => ({ title: `Poster: ${title}`, subtitle: `#${subtitle}` }) },
});

const quote = defineArrayMember({
  type: 'object', name: 'quote', title: 'Quote / Overheard',
  fields: [
    defineField({ name: 'eyebrow', title: 'Small label', type: 'string', initialValue: 'Overheard at the gym', description: 'The tiny line above the quote.' }),
    defineField({ name: 'text', title: 'Quote', type: 'text', rows: 3, description: 'Keep it short. One or two lines reads best on a card.', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'text', subtitle: 'eyebrow' }, prepare: ({ title, subtitle }) => ({ title: `Quote: ${title}`, subtitle }) },
});

const review = defineArrayMember({
  type: 'object', name: 'review', title: 'Google Review',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', description: 'Who left the review.', validation: (r) => r.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string', description: 'Optional, e.g. Local Guide.' }),
    defineField({ name: 'text', title: 'Review', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'helpful', title: 'Helpful count', type: 'string', description: 'e.g. 2,872. Shown as the "people found this helpful" number.' }),
    defineField({
      name: 'avatar', title: 'Avatar', type: 'image', options: { hotspot: true },
      description: 'Optional. Small square headshot, at least 200 x 200 px.',
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'role' }, prepare: ({ title, subtitle }) => ({ title: `Review: ${title}`, subtitle }) },
});

const ayyeStatement = defineArrayMember({
  type: 'object', name: 'ayyeStatement', title: 'Ayye: Statement',
  fields: [
    defineField({ name: 'text', title: 'Statement', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({ name: 'accentText', title: 'Accent phrase (amber)', type: 'string', description: 'Optional. A phrase inside the statement to highlight amber. Must match the statement text exactly.' }),
  ],
  preview: { select: { title: 'text' }, prepare: ({ title }) => ({ title: `Ayye statement: ${title}` }) },
});

const ayyeReceipt = defineArrayMember({
  type: 'object', name: 'ayyeReceipt', title: 'Ayye: Receipt',
  fields: [
    defineField({ name: 'head', title: 'Header', type: 'string', initialValue: 'RECEIPT', description: 'The big word at the top of the receipt.' }),
    defineField({ name: 'sub', title: 'Subhead', type: 'string', initialValue: 'Scope of work' }),
    defineField({
      name: 'lines', title: 'Line items', type: 'array',
      description: 'The rows on the receipt. Each has a label on the left and a value on the right.',
      of: [defineArrayMember({ type: 'object', name: 'line', fields: [
        defineField({ name: 'label', type: 'string', title: 'Label' }),
        defineField({ name: 'value', type: 'string', title: 'Value' }),
      ], preview: { select: { title: 'label', subtitle: 'value' } } })],
    }),
    defineField({ name: 'totalLabel', title: 'Total label', type: 'string', initialValue: 'Out of scope', description: 'The bold bottom row, left side.' }),
    defineField({ name: 'totalValue', title: 'Total value', type: 'string', description: 'The bold bottom row, right side.' }),
  ],
  preview: { select: { title: 'head', subtitle: 'sub' }, prepare: ({ title, subtitle }) => ({ title: `Ayye receipt: ${title}`, subtitle }) },
});

const ayyeReview = defineArrayMember({
  type: 'object', name: 'ayyeReview', title: 'Ayye: App Store Review',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', title: 'Role / tagline', type: 'string' }),
    defineField({ name: 'text', title: 'Review', type: 'text', rows: 4, validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'name', subtitle: 'role' }, prepare: ({ title, subtitle }) => ({ title: `Ayye review: ${title}`, subtitle }) },
});

export default defineType({
  name: 'homeHero',
  title: 'Homepage hero',
  type: 'document',
  fields: [
    // Internal bookkeeping only; hidden so editors never see it. Kept in the
    // schema (rather than deleted) so existing data does not show up as an
    // "unknown field" warning.
    defineField({ name: 'internalTitle', title: 'Internal title', type: 'string', initialValue: 'Homepage hero', hidden: true }),
    defineField({
      name: 'deck',
      title: 'Hero cards (top of homepage)',
      type: 'array',
      description:
        'The card deck visitors see first. Add, remove, and drag to reorder. Order = priority: the site shuffles where cards sit, but shows them in this order, so put the strongest work first. 5 to 8 cards feels right.',
      of: [post, poster, quote, review, ayyeStatement, ayyeReceipt, ayyeReview],
    }),
  ],
  preview: { prepare: () => ({ title: 'Homepage hero' }) },
});
