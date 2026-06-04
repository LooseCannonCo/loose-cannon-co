/**
 * Ayye case study content (Case 003), transcribed from
 * ayye-case-sanity-content.md. This is the local source of truth while the
 * page is built (Step 3). Step 5 wires these same shapes to the editable
 * `ayyeCaseStudy` Sanity document; the bespoke layout + interactions stay in
 * the components either way. No em dashes anywhere.
 */

export interface AyyeSwatch {
  role: string;
  name: string;
  hex: string;
}

export interface AyyeCarouselSlide {
  src: string;
  alt: string;
}

export const ayyeContent = {
  meta: {
    slug: "ayye",
    caseNumber: "003",
    client: "Ayye",
    discipline: "Brand system",
    year: "2026",
    featured: true,
    tagline: "Decisions. Remembered.",
  },

  // Section 1: LC case intro (pink)
  intro: {
    sideLabel: "The work",
    backLabel: "Back to work",
    eyebrow: "Case 003 // a brand built to hold up",
    headline: "We gave Ayye a brand that proves itself.",
    lede: "Ayye had the app. It did not have a brand. So we took what they were already using, systematized it, redrew the mark, and built a system clean enough to ship today and loose enough to grow into.",
    sysStat: "5 colors. 40 tones. 1 sans.",
  },

  // Section 2: The mark (black card)
  mark: {
    label: "The mark",
    markSvg: "/Ayye_Wordmark_Black.svg",
    caption: "One mark. Redrawn in General Sans to do every job.",
  },

  // Section 3: 01 The palette (cream card)
  palette: {
    number: "01",
    label: "The palette",
    title: "Five primary. Forty tones. One gradient.",
    swatches: [
      { role: "The exclamation", name: "Ayye Amber", hex: "#FFBF00" },
      { role: "Gravity", name: "Brand Black", hex: "#141414" },
      { role: "The surface", name: "Receipt Cream", hex: "#FFF8E4" },
      { role: "Edge", name: "Signal Violet", hex: "#B14AFF" },
      { role: "Restraint", name: "White", hex: "#FFFFFF" },
    ] as AyyeSwatch[],
    dominanceHeading: "Dominance, enforced.",
    // 64 / 32 / 4 split. Cream is true Receipt Cream (#FFF8E4); a hairline
    // around the pie and each legend chip keeps it distinct on the cream card.
    dominance: [
      { label: "Cream", pct: 64, hex: "#FFF8E4" },
      { label: "Black", pct: 32, hex: "#141414" },
      { label: "Amber", pct: 4, hex: "#FFBF00" },
    ],
    dominanceCopy:
      "Cream and black do the work. Amber is punctuation, not paint. If something looks amber-branded, pull it back.",
    gradient:
      "linear-gradient(135deg,#FFF8E4 0%,#FFF3D1 22%,#FFEBB2 44%,#FFE187 64%,#FFD350 82%,#FFBF00 100%)",
    gradientLabel: "The Receipt gradient",
  },

  // Section 4: 02 The type (black card)
  type: {
    number: "02",
    label: "The type",
    title: "One sans. All the volume.",
    // Forced break (deviation from v15): line 1 "One sans.", line 2 the rest.
    titleLines: ["One sans.", "All the volume."],
    specimenLine: "They said the rate was eight hundred.",
    weights: [
      { label: "Regular", value: 400 },
      { label: "Medium", value: 500 },
      { label: "Semibold", value: 600 },
      { label: "Bold", value: 700 },
    ],
    bigSpecimen: "Receipts hit different.",
    copy: "Weight does the work. One face, drawn with enough personality to carry the wordmark, the display, the body, and the UI. The attitude comes from scale and tracking, not a second font.",
  },

  // Section 5: 03 The social system (cream card)
  social: {
    number: "03",
    label: "The social system",
    title: "One system, split into two ad sets.",
    // Forced break: line 1 "One system,", line 2 "split into two ad sets."
    titleLines: ["One system,", "split into two ad sets."],
    // The last-line widow ("pricing." alone) is handled in CSS via
    // text-wrap: pretty on .cardNote.
    note: "Same four templates, retargeted voice. The Creators set talks to the talent. The Early Adopters set talks to the founders racing for founding pricing.",
    accent: "#FFBF00",
    slides: [
      { src: "/ayye/cr-01.webp", alt: "Creators template: the payment chase" },
      { src: "/ayye/cr-02.webp", alt: "Creators template: the statement" },
      { src: "/ayye/cr-03.webp", alt: "Creators template: the testimonial" },
      { src: "/ayye/cr-04.webp", alt: "Creators template: the product shot" },
    ] as AyyeCarouselSlide[],
    carouselCaption:
      "The Creators set. Four templates: the payment chase, the statement, the testimonial, the product shot.",
    compare: {
      left: { src: "/ayye/cr-01.webp", alt: "Creators template: the payment chase", caption: "Creators" },
      right: { src: "/ayye/ea-01.webp", alt: "Early adopters template: the payment chase", caption: "Early adopters" },
      caption:
        "Same template, two voices. The frame holds; the angle and the call to action retarget per audience.",
    },
  },

  // Section 6: 04 UGC (cream card)
  ugc: {
    number: "04",
    label: "UGC, on brand",
    title: "Scripted in the Ayye voice.",
    videos: [
      {
        src: "/ayye/ayye-creator.mp4",
        poster: "/ayye/ayye-creator-poster.jpg",
        label: "Creators",
      },
      {
        src: "/ayye/ayye-early-adopter.mp4",
        poster: "/ayye/ayye-early-adopter-poster.jpg",
        label: "Early Adopters",
      },
    ],
    caption:
      "Two UGC spots, one per audience, scripted dry in the Ayye voice.",
  },

  // Section 7: 05 The landing pages (cream card)
  landing: {
    number: "05",
    label: "The landing pages",
    title: "One funnel, built to convert.",
    // Forced break: line 1 "One funnel,", line 2 "built to convert."
    titleLines: ["One funnel,", "built to convert."],
    chromeUrl: "ayye.app/creators",
    iframeSrc: "https://ayye-preview.netlify.app/ayye-creators",
    caption:
      "The set is practically identical across audiences, so here is one: the creators page. Stop chasing. Start sending.",
  },

  // Section 8: LC close (plum)
  close: {
    sideLabel: "What they left with",
    kicker: "What they left with",
    headline:
      "They came to us without a system. They left with one that scales.",
    linkText: "See the living brand guide",
    linkHref: "https://ayye-guidelines.netlify.app/",
  },
} as const;

export type AyyeContent = typeof ayyeContent;
