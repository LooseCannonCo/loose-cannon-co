/**
 * Idempotent migration: seeds the FITAID and Smolotov case studies into Sanity.
 * Uses deterministic _ids (caseStudy.<slug>) + createOrReplace, so re-running
 * updates in place rather than creating duplicates.
 *
 * Run with: npm run migrate:case-studies
 */
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing Sanity env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const FITAID_ID = "caseStudy.fitaid";
const SMOLOTOV_ID = "caseStudy.smolotov";
const AYYE_ID = "caseStudy.ayye";

// Image asset references kept here as constants so re-running the seed binds
// the same uploaded assets back to each case. Without these, createOrReplace
// strips every image field on every run and leaves the assets orphaned.
//
// PARKED (intentionally unlinked, do not delete): the 3200x1344 landscape AI
// hero `Gemini_Generated_Image_7lesd17lesd17les.jpg`, asset _id
//   image-8deed11ffe01b11b8d495ceab7b848a065270ce4-3200x1344-jpg
// was the previous FITAID hero binding but the page copy is about Gollum, so
// the hero artifact now uses gollum.jpg (portrait). The landscape Gemini
// image stays in the dataset for future placement (no current field renders
// landscape well at hero scale). Re-link by adding `imageRef("<that _id>")`
// back to whichever field needs it.
const ASSETS = {
  // FITAID
  fitaidGollum: "image-3096b4bd3988b4cb5c44d270a15e062bddf53af1-1080x1350-jpg",
  fitaidHomer: "image-6b8c65da91cc09426a0c3ac4689dfad061313656-1080x1350-jpg",
  fitaidTerminator: "image-2214f045e6c8656fd2a8a15ffd041a6f19a6f512-1080x1350-jpg",
  fitaidMorph: "image-91431a811a53cbe4250829bfee75bdcd06ac4ae3-1080x1350-jpg",
  fitaidGym: "image-08968bdf7971e3e9ec4f26593c3f05803ba15866-1080x1350-jpg",
  fitaidGym1: "image-496c97304f8fe62ca1e08a2a7fe95a1fca0f8e7e-1080x1350-jpg",
  fitaidOverheard: "image-9f3419d730d994ca90852a47a53b6c94a4507d2d-1080x1350-jpg",
  fitaidReview: "image-aa7ffddd493f091a4f4e94255c7046b85cacc438-1080x1350-jpg",
  // Smolotov
  smolotovHero: "image-e0d58fc2dc3eb628e35ed2fa8db53dee8429361e-1080x1350-jpg",
  smolotov3monk: "image-6f9e8b4022d944dd1dcaffdc91038fb0d7525841-1080x1350-jpg",
  smolotov3sugar: "image-de4f786e62fdff3895dfd246afe22658142e63ae-1080x1350-jpg",
} as const;

/** Build a raw Sanity inline image value from an asset _id. */
const imageRef = (assetId: string) => ({
  _type: "image" as const,
  asset: { _type: "reference" as const, _ref: assetId },
});

type SeedDoc = { _id: string; _type: string; client: string; [key: string]: unknown };

const fitaid: SeedDoc = {
  _id: FITAID_ID,
  _type: "caseStudy",
  client: "FITAID",
  discipline: "Social-First Creative",
  year: "May 2026",
  caseNumber: "001",
  featured: true,
  slug: { _type: "slug", current: "fitaid" },
  // Hero artifact is the Gollum portrait (1080x1350). The hero img is
  // width: 100% with no fixed aspect-ratio or object-fit, so the .right
  // column inherits the asset's intrinsic ratio. Portrait renders portrait,
  // no crop. `align-items: center` on the .hero grid re-centers the +2,400%
  // column vertically against the taller artifact column.
  coverImage: imageRef(ASSETS.fitaidGollum),
  hero: {
    eyebrow: "Best post · May 2026 · Engagement vs brand baseline",
    prefix: "+",
    digits: "2,400",
    suffix: "%",
    heroSticker: { text: "Booyah!", angle: -11 },
    headline: "Hunkfruit, Gollum,\nand the gym crush.",
    subhead:
      "One AI-generated Gollum did more for the brand than a quarter of polished product shots.",
    meta: [
      "May 2026 monthly drop · Trailing 90-day brand average · FITAID 1st-party data",
    ],
    artifact: imageRef(ASSETS.fitaidGollum),
    artifactCaption: "AI Gollum clutching a FITAID Recovery can",
  },
  brief: {
    eyebrow: "The brief, decoded",
    headline: "Stop selling performance.\nStart being funny.",
    body: [
      'FITAID’s category is crowded with brands shouting about ingredients, electrolytes, and "elite performance." The actual person drinking the can doesn’t care. They’re scrolling between sets, looking for something funny.',
      "So we stopped writing copy that explained the product. We made jokes the product could sit inside of: AI-generated absurdity (Gollum, Homer, Terminator) alongside text-first editorial that reads like dictionary pages, fake Google reviews, and overheard gym dialogue.",
      'The unifying logic: every post had to make sense on its own. No caption-dependence. No "swipe to learn more." If the image and the joke didn’t land in 1.5 seconds of stopped-scroll, it didn’t ship.',
    ],
    breakdown: {
      type: "threeCol",
      items: [
        {
          _key: "b0",
          title: "Pop culture",
          sub: "Hyperreal AI · Image-first",
          body: "Gollum, Homer, Terminator: beloved characters caught in the act of being FITAID drinkers. No explanation given.",
        },
        {
          _key: "b1",
          title: "Gym myths",
          sub: "Editorial · Photo + tabloid type",
          body: 'Three-part myth series, each post a one-liner. "Originally called Hunkfruit." Most-screenshot series of the month.',
        },
        {
          _key: "b2",
          title: "Fake reviews",
          sub: "UI mock · Phil McCrackin et al.",
          body: "Five-star Google reviews from customers with bad-pun names. The format does the work. The names sell it.",
        },
      ],
    },
  },
  // Eight image posts from the May 2026 drop. The top-level `gallery` field
  // is what the route renders: 8 items routes through CaseGalleryDrag (the
  // horizontal drag scroller, FITAID pattern). The legacy `contentSection`
  // below is kept for historical record but is not rendered by the current
  // case study route.
  gallery: [
    {
      _key: "g0",
      image: imageRef(ASSETS.fitaidGollum),
      alt: "Gollum clutching a FITAID Recovery can",
      caption: "Gollum clutching a FITAID Recovery can.",
    },
    {
      _key: "g1",
      image: imageRef(ASSETS.fitaidHomer),
      alt: "Homer Simpson clutching a FITAID can",
      caption: "Homer Simpson clutching a FITAID can.",
    },
    {
      _key: "g2",
      image: imageRef(ASSETS.fitaidTerminator),
      alt: "Terminator emerging from flames with a FITAID",
      caption: "Terminator emerging from flames with a FITAID.",
    },
    {
      _key: "g3",
      image: imageRef(ASSETS.fitaidMorph),
      alt: "Hunkfruit, the original gym-crush morph",
      caption: "Hunkfruit. The original gym-crush morph.",
    },
    {
      _key: "g4",
      image: imageRef(ASSETS.fitaidGym),
      alt: "GYM, a place where you go to meet other people also named Jim",
      caption: "GYM. A place where you go to meet other people also named Jim.",
    },
    {
      _key: "g5",
      image: imageRef(ASSETS.fitaidGym1),
      alt: "Originally called Hunkfruit, one sip and your gym crush makes eye contact",
      caption: "Originally called Hunkfruit. One sip and your gym crush makes eye contact.",
    },
    {
      _key: "g6",
      image: imageRef(ASSETS.fitaidOverheard),
      alt: "Overheard at the gym",
      caption: "Overheard at the gym.",
    },
    {
      _key: "g7",
      image: imageRef(ASSETS.fitaidReview),
      alt: "Phil McCrackin, 5-star Google review",
      caption: "Phil McCrackin, 5-star Google review.",
    },
  ],
  contentSection: {
    type: "nineGrid",
    tiles: [
      { _key: "t0", label: "Homer Simpson clutching a FITAID can", kind: "image", tone: "pink" },
      { _key: "t1", label: "Terminator emerging from flames with a FITAID", kind: "image", tone: "dark" },
      { _key: "t2", label: "Originally called Hunkfruit. One sip and your gym crush makes eye contact.", kind: "image", tone: "dark" },
      { _key: "t3", label: "Stevia was invented by a guy named Steve.", kind: "editorial", tone: "cream" },
      { _key: "t4", label: "GYM: a place where you go to meet other people also named Jim.", kind: "editorial", tone: "cream" },
      { _key: "t5", label: "Overheard: Who are you flexing for? Your mom.", kind: "editorial", tone: "cream" },
      { _key: "t6", label: "Phil McCrackin, 5-star Google review", kind: "review", tone: "pink" },
      { _key: "t7", label: "Overheard: I'm just going to photoshop my legs as my arms.", kind: "editorial", tone: "cream" },
      { _key: "t8", label: "Mike Rotch, 5-star Yelp review", kind: "review", tone: "pink" },
    ],
  },
  statsTrio: {
    eyebrow: "30 days from first drop",
    title: "The receipts.",
    explanation:
      "First-party data, May 2026. Three metrics that moved the needle: engagement, follower growth, and DTC conversion lift.",
    cells: [
      {
        _key: "c0",
        chartType: "ringFill",
        config: {
          percent: 92,
          prefix: "+",
          digits: "218",
          unit: "%",
          caption: "Overall account engagement vs trailing 90 days",
          source: "Instagram, 1st-party",
        },
      },
      {
        _key: "c1",
        chartType: "barComparison",
        config: {
          prior: 1,
          current: 3.4,
          priorLabel: "PRIOR",
          currentLabel: "CURRENT",
          digits: "3.4",
          unit: "×",
          caption: "Follower growth rate vs prior month",
          source: "Net new follows",
        },
      },
      {
        _key: "c2",
        chartType: "ringFill",
        config: {
          percent: 47,
          prefix: "+",
          digits: "47",
          unit: "%",
          caption: "DTC conversion lift on social-attributed traffic",
          source: "Shopify · Meta attribution",
        },
      },
    ],
  },
  quote: {
    text: "First agency we've worked with that pitched us a Gollum and was right.",
    attribution: {
      name: "Placeholder, FITAID team",
      role: "Marketing Director, FITAID",
    },
  },
  credits: [
    { _key: "cr0", label: "Strategy + Concept", name: "Briana Brugh" },
    { _key: "cr1", label: "Creative Direction + Design", name: "Noah Charnow" },
    { _key: "cr2", label: "AI Image Generation", name: "Loose Cannon Co." },
    { _key: "cr3", label: "Client Team", name: "FITAID social" },
  ],
  upNext: {
    caseRef: { _type: "reference", _ref: SMOLOTOV_ID },
    descriptor: "Ads that get past the polite scroll",
  },
};

const smolotov: SeedDoc = {
  _id: SMOLOTOV_ID,
  _type: "caseStudy",
  client: "Smolotov",
  discipline: "Performance Creative",
  year: "2026",
  caseNumber: "002",
  featured: true,
  slug: { _type: "slug", current: "smolotov" },
  coverImage: imageRef(ASSETS.smolotovHero),
  hero: {
    eyebrow:
      "TOTAL CROSS-PLATFORM VIEWS. JAN-MAY 2026. FIRST-EVER PAID CAMPAIGN",
    prefix: "",
    digits: "6.35",
    suffix: "M",
    heroSticker: { text: "Booyah!", angle: -11 },
    headline: "From 27 likes to 6.35 million views. In five months.",
    subhead:
      "Smolotov had 27 likes and no ad account in January. By May the page was serving over 100K views a day to an audience of 2.25 million.",
    meta: [
      "FIRST-EVER META CAMPAIGN. 4.5M FB VIEWS. 1.85M IG VIEWS. 1ST-PARTY DATA.",
    ],
    artifact: imageRef(ASSETS.smolotovHero),
    artifactCaption: "Top performer · FB Enlist Ad V-2 (video)",
  },
  brief: {
    eyebrow: "The hot mess, decoded",
    headline: "27 likes.\nThat was it.",
    body: [
      "Smolotov has a product that slaps and a cultural lane wide open. Satirical poop bags. A loyal cult. Real demand. What they didn't have: a system to unlock any of it. No ad account. Repeated Meta denials. No retargeting. No discovery path.",
      "The brief was simple and unglamorous: survive Meta's approval gauntlet first, then build a discovery engine from scratch. Then make organic and paid talk to each other. Then scale only when the data said go.",
      "No clever hooks. No category-leading manifesto. Just a system that actually works, dressed in a brand that didn't ask permission.",
    ],
    breakdown: {
      type: "threeStep",
      items: [
        {
          _key: "b0",
          title: "Fix the Meta problem first.",
          body: "Repositioned the product as a satirical gag gift, removed any references to real people, aligned every line of ad copy with Meta policy. Account approved. Path cleared.",
          stat: "From denied to approved in 3 weeks.",
        },
        {
          _key: "b1",
          title: "Launch intentionally. Scale on signal.",
          body: "First Meta campaign live in January. Retargeting pools built across FB and IG. Distribution scaled only when the creative kept earning attention. Cold audiences stayed quiet; warm audiences carried the videos.",
          stat: "100K+ views a day at peak.",
        },
        {
          _key: "b2",
          title: "Build the funnel around the ads.",
          body: "Paid doesn't live in a vacuum. Organic social fed trust signals. Engagement data fed back into audience targeting. Owned channels kept the warm audiences returning. One closed loop.",
          stat: "47,500 interactions. +96,800% growth.",
        },
      ],
    },
  },
  contentSection: {
    type: "threeUpVideo",
    videos: [
      { _key: "v0", label: "2 Bags, 1 Movement", platform: "Instagram · Feed", aspect: "4x5" },
      { _key: "v1", label: "Enlist Ad V-2", platform: "Facebook · Feed", aspect: "4x5" },
      { _key: "v2", label: "Icon Animation, Orange", platform: "Meta · 1:1", aspect: "1x1" },
    ],
  },
  // Two product shots from the launch. Two items routes through the static
  // CaseGallery (3-col on desktop, stacks on mobile). Renders below the
  // ThreeUpVideo section above; the page ends up with both a video content
  // section and a product-shot gallery, in that order. galleryEyebrow is
  // explicit here ("The stills") so it doesn't stack a duplicate "The work"
  // eyebrow over the video block above (which now defaults to "The ads").
  galleryEyebrow: "The stills",
  gallery: [
    {
      _key: "g0",
      image: imageRef(ASSETS.smolotov3monk),
      alt: "Smolotov three-pack, monk variant",
      caption: "Three-pack. Monk variant.",
    },
    {
      _key: "g1",
      image: imageRef(ASSETS.smolotov3sugar),
      alt: "Smolotov three-pack, sugar variant",
      caption: "Three-pack. Sugar variant.",
    },
  ],
  statsTrio: {
    eyebrow: "CROSS-PLATFORM. JAN-MAY 2026",
    title: "The receipts.",
    explanation:
      "First-party data, May 2026. Three numbers that prove the engine works: reach, growth, and discovery.",
    cells: [
      {
        _key: "c0",
        chartType: "ringFill",
        config: {
          percent: 99,
          digits: "99",
          unit: "%",
          caption: "Views from non-followers",
          source: "Discovery, not engagement",
        },
      },
      {
        _key: "c1",
        chartType: "ringFill",
        config: {
          percent: 88,
          digits: "2.25",
          unit: "M+",
          caption: "Unique people reached",
          source: "Across Facebook and Instagram",
        },
      },
      {
        _key: "c2",
        chartType: "ringFill",
        config: {
          percent: 95,
          prefix: "+",
          digits: "176,700",
          unit: "%",
          caption: "Facebook view growth",
          source: "From 27 likes, Jan to May",
        },
      },
    ],
  },
  quote: {
    text: "The brand had momentum potential. It was missing the system to unlock it.",
    attribution: {
      name: "Briana Brugh",
      role: "Head of Strategies That Actually Work, Loose Cannon Co.",
    },
  },
  credits: [
    { _key: "cr0", label: "Paid Media + Strategy", name: "Briana Brugh" },
    { _key: "cr1", label: "Account + Funnel", name: "Loose Cannon Co." },
    { _key: "cr2", label: "Creative", name: "Smolotov, in-house" },
    { _key: "cr3", label: "Engagement", name: "Jan-May 2026" },
  ],
  upNext: {
    caseRef: { _type: "reference", _ref: FITAID_ID },
    descriptor: "Hunkfruit, Gollum, and the gym crush",
  },
};

// Case 003: Ayye. Stat-less craft case. Hero has no digits (uses the no-number
// hero), no statsTrio, deliverables live in the top-level gallery.
const ayye: SeedDoc = {
  _id: AYYE_ID,
  _type: "caseStudy",
  client: "Ayye",
  discipline: "Brand identity",
  year: "2026",
  caseNumber: "003",
  featured: true,
  slug: { _type: "slug", current: "ayye" },
  hero: {
    eyebrow: "Brand identity. Built from zero. 2026.",
    // No prefix / digits / suffix: renders the stat-less hero variant
    // (eyebrow + headline + subhead + meta + artifact only).
    headline: "A brand built on receipts.",
    subhead:
      "Ayye makes a receipt for every decision, so freelancers and creators stop losing arguments they already won. We built the whole identity from zero: the name treatment, the system, and a brand site that runs itself.",
    meta: ["Identity. Brand system. Guidelines site. Launch social."],
    artifactCaption: "Identity system (image pending)",
  },
  brief: {
    eyebrow: "The brief, decoded",
    headline: "Don't brand the feature.\nBrand the relief.",
    body: [
      "Ayye is a proof-of-agreement platform. It makes a clean receipt of what two people decided, so the freelancer who heard 'sure, we can do that' has something to point at when the client forgets. Good product. Real problem. No brand.",
      "The audience is the hard part. Freelancers and creators have seen every SaaS brand pretend to be their friend, and they can smell it from a mile off. So the brand had to be evidence-led, a little dry, and impossible to mistake for another founder-friend startup.",
      "We built the whole thing from the name treatment out. One wordmark, one system, one set of rules, and a brand site that hands itself to anyone who needs it without a meeting.",
    ],
    breakdown: {
      type: "threeStep",
      items: [
        {
          _key: "b0",
          title: "Name the feeling, not the feature.",
          body: "Led with proof and memory, the two things the audience actually wants. The wordmark is calm and certain, not loud.",
          stat: "One wordmark, set in Poppins.",
        },
        {
          _key: "b1",
          title: "Build a system, not a logo.",
          body: "Color, type, the Receipt gradient, voice, and tokens, all documented so the brand holds whether Ayye or a freelancer is applying it.",
          stat: "General Sans throughout.",
        },
        {
          _key: "b2",
          title: "Ship the rules, not a PDF.",
          body: "A live guidelines site that scales the brand without a gatekeeper.",
          stat: "brand.ayye.app. Self-serve.",
        },
      ],
    },
  },
  // Deliverables grid. Five items so the route dispatches to the static
  // 3-col CaseGallery (drag scroller kicks in at >=6). Images intentionally
  // left empty; CaseGallery now renders a cream placeholder tile with the
  // caption inside when item.image is absent, so deliverables can publish
  // before assets land.
  galleryEyebrow: "Everything, from zero",
  galleryTitle: "What we built.",
  galleryIntro:
    "Identity, system, site, and the launch creative. The whole brand in one place.",
  gallery: [
    {
      _key: "g0",
      alt: "Identity, the wordmark and logo system",
      caption: "Identity. The wordmark and logo system.",
    },
    {
      _key: "g1",
      alt: "Brand system, color, type, voice, and tokens",
      caption: "Brand system. Color, type, voice, and tokens.",
    },
    {
      _key: "g2",
      alt: "The Receipt gradient, the signature device",
      caption: "The Receipt gradient. The signature device. Proof you can see.",
    },
    {
      _key: "g3",
      alt: "Guidelines site, brand.ayye.app",
      caption: "Guidelines site. brand.ayye.app, the live system.",
    },
    {
      _key: "g4",
      alt: "Launch social, creator and freelancer campaigns",
      caption: "Launch social. Creator and freelancer campaigns. Staged for launch.",
    },
  ],
  // Ayye intentionally ships without a quote. The case-study template renders
  // the quote section only when quote.text exists, so omitting it here means
  // no band and no empty space. (Clear the quote field on the live Ayye doc in
  // Sanity Studio too; this seed only governs a fresh migration.)
  credits: [
    { _key: "cr0", label: "Strategy + concept", name: "Briana Brugh" },
    { _key: "cr1", label: "Identity + design", name: "Noah Charnow" },
    { _key: "cr2", label: "Guidelines system", name: "Loose Cannon Co." },
    { _key: "cr3", label: "Client", name: "Ayye" },
  ],
  upNext: {
    caseRef: { _type: "reference", _ref: FITAID_ID },
    descriptor: "Hunkfruit, Gollum, and the gym crush.",
  },
};

async function run() {
  // Both docs cross-reference each other via upNext, so seed them in a single
  // transaction: references are validated against the post-commit state, which
  // lets the forward/circular reference resolve.
  await client
    .transaction()
    .createOrReplace(fitaid)
    .createOrReplace(smolotov)
    .createOrReplace(ayye)
    .commit();
  console.log(
    `Migration complete: seeded ${fitaid.client} (${FITAID_ID}) + ${smolotov.client} (${SMOLOTOV_ID}) + ${ayye.client} (${AYYE_ID}).`,
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
