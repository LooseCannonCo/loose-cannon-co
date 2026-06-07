// sanity/schemas/homeHero.ts
// Singleton that curates the homepage hero deck.
// Registered in schemas/index.ts and pinned as a singleton in sanity.config.ts
// (one document, fixed id "homeHero", not creatable repeatedly).
//
// The `deck` array is the curation surface: add cards, drag to reorder, remove to hide.
// Card order in the array = priority. The front end deals them in a random arrangement
// but surfaces them in this order, so put your strongest work first.

import { defineType, defineField, defineArrayMember } from 'sanity';

// Post: a finished post graphic uploaded as an image. The primary, most-used
// card type, so it sits first in the deck's "Add item" list.
const post = defineArrayMember({
  type: 'object', name: 'post', title: 'Post (upload a finished graphic)',
  fields: [
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: 'alt', title: 'Alt text', type: 'string', description: 'Optional. Describes the image for accessibility.' }),
    defineField({ name: 'link', title: 'Link', type: 'url', description: 'Optional. Internal (e.g. /work/ayye) or a full URL.', validation: (r) => r.uri({ allowRelative: true, scheme: ['http', 'https'] }) }),
  ],
  preview: { select: { media: 'image', title: 'alt' }, prepare: ({ media, title }) => ({ title: title || 'Post', subtitle: 'Post graphic', media }) },
});

const poster = defineArrayMember({
  type: 'object', name: 'poster', title: 'Poster (image + big number)',
  fields: [
    defineField({ name: 'num', title: 'Big number', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'image', title: 'Background photo', type: 'image', options: { hotspot: true } }),
  ],
  preview: { select: { title: 'title', subtitle: 'num' }, prepare: ({ title, subtitle }) => ({ title: `Poster — ${title}`, subtitle: `#${subtitle}` }) },
});

const quote = defineArrayMember({
  type: 'object', name: 'quote', title: 'Quote / Overheard',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string', initialValue: 'Overheard at the gym' }),
    defineField({ name: 'text', title: 'Quote', type: 'text', rows: 3, validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'text', subtitle: 'eyebrow' }, prepare: ({ title, subtitle }) => ({ title: `Quote — ${title}`, subtitle }) },
});

const review = defineArrayMember({
  type: 'object', name: 'review', title: 'Google Review',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string' }),
    defineField({ name: 'text', title: 'Review', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'helpful', title: 'Helpful count', type: 'string', description: 'e.g. 2,872' }),
    defineField({ name: 'avatar', title: 'Avatar', type: 'image', options: { hotspot: true } }),
  ],
  preview: { select: { title: 'name', subtitle: 'role' }, prepare: ({ title, subtitle }) => ({ title: `Review — ${title}`, subtitle }) },
});

const ayyeStatement = defineArrayMember({
  type: 'object', name: 'ayyeStatement', title: 'Ayye — Statement',
  fields: [
    defineField({ name: 'text', title: 'Statement', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({ name: 'accentText', title: 'Accent phrase (amber)', type: 'string', description: 'Optional. A phrase inside the statement to highlight amber.' }),
  ],
  preview: { select: { title: 'text' }, prepare: ({ title }) => ({ title: `Ayye statement — ${title}` }) },
});

const ayyeReceipt = defineArrayMember({
  type: 'object', name: 'ayyeReceipt', title: 'Ayye — Receipt',
  fields: [
    defineField({ name: 'head', title: 'Header', type: 'string', initialValue: 'RECEIPT' }),
    defineField({ name: 'sub', title: 'Subhead', type: 'string', initialValue: 'Scope of work' }),
    defineField({
      name: 'lines', title: 'Line items', type: 'array',
      of: [defineArrayMember({ type: 'object', name: 'line', fields: [
        defineField({ name: 'label', type: 'string', title: 'Label' }),
        defineField({ name: 'value', type: 'string', title: 'Value' }),
      ], preview: { select: { title: 'label', subtitle: 'value' } } })],
    }),
    defineField({ name: 'totalLabel', title: 'Total label', type: 'string', initialValue: 'Out of scope' }),
    defineField({ name: 'totalValue', title: 'Total value', type: 'string' }),
  ],
  preview: { select: { title: 'head', subtitle: 'sub' }, prepare: ({ title, subtitle }) => ({ title: `Ayye receipt — ${title}`, subtitle }) },
});

const ayyeReview = defineArrayMember({
  type: 'object', name: 'ayyeReview', title: 'Ayye — App Store Review',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', title: 'Role / tagline', type: 'string' }),
    defineField({ name: 'text', title: 'Review', type: 'text', rows: 4, validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'name', subtitle: 'role' }, prepare: ({ title, subtitle }) => ({ title: `Ayye review — ${title}`, subtitle }) },
});

export default defineType({
  name: 'homeHero',
  title: 'Homepage hero',
  type: 'document',
  fields: [
    defineField({ name: 'internalTitle', title: 'Internal title', type: 'string', initialValue: 'Homepage hero' }),
    defineField({
      name: 'deck',
      title: 'Hero deck (curate + order the cards)',
      type: 'array',
      of: [post, poster, quote, review, ayyeStatement, ayyeReceipt, ayyeReview],
    }),
  ],
  preview: { prepare: () => ({ title: 'Homepage hero' }) },
});
