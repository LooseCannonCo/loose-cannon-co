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
  hero: {
    eyebrow: "Best post · May 2026 · Engagement vs brand baseline",
    prefix: "+",
    digits: "2,400",
    suffix: "%",
    heroSticker: { text: "Banger!", angle: -11 },
    headline: "Hunkfruit, Gollum,\nand the gym crush.",
    subhead:
      "One AI-generated Gollum did more for the brand than a quarter of polished product shots.",
    meta: [
      "May 2026 monthly drop · Trailing 90-day brand average · FITAID 1st-party data",
    ],
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
  hero: {
    eyebrow:
      "Total Meta-attributed revenue · Jan-May 2026 · First-ever paid campaign",
    prefix: "$",
    digits: "332",
    suffix: "K",
    heroSticker: { text: "Banger!", angle: -11 },
    headline: "From zero paid history to $332K.\nIn five months.",
    subhead:
      "Smolotov hadn't run a single ad before January. By May they were doing $112K a month at a 3.40× blended ROAS.",
    meta: [
      "First-ever Meta campaign · 4.18M impressions · 4,884 transactions · 1st-party data",
    ],
    artifactCaption: "Top performer · FB Enlist Ad V-2 (video)",
    artifactSticker: { text: "Paid + Organic", angle: -2, position: "bottom-right" },
  },
  brief: {
    eyebrow: "The hot mess, decoded",
    headline: "27 likes.\nZero paid history.\nOne ghost town.",
    body: [
      "Smolotov has a product that slaps and a cultural lane wide open. Satirical poop bags. A loyal cult. Real demand. What they didn't have: a system to unlock any of it. No paid media history. Repeated Meta denials. No retargeting. No conversion path.",
      "The brief was simple and unglamorous: survive Meta's approval gauntlet first, then build a paid acquisition engine from scratch. Then make organic and paid talk to each other. Then scale only when the data said go.",
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
          body: "First Meta campaign live in January. Retargeting pools built across FB and IG. Spend scaled only when efficiency held. Cold spend stayed disciplined; warm spend did the heavy lifting.",
          stat: "3.40× blended ROAS. $10 CPA.",
        },
        {
          _key: "b2",
          title: "Build the funnel around the ads.",
          body: "Paid doesn't live in a vacuum. Organic social fed trust signals. Email kept warm traffic returning. Shopify data fed back into audience targeting. One closed loop.",
          stat: "+460% revenue growth, Feb to May.",
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
  statsTrio: {
    eyebrow: "Meta-attributed · Jan-May 2026",
    title: "The receipts.",
    explanation:
      "First-party data, May 22 2026. Three numbers that prove the engine works: revenue, efficiency, and unit volume.",
    cells: [
      {
        _key: "c0",
        chartType: "ringFill",
        config: {
          percent: 88,
          prefix: "$",
          digits: "332",
          unit: "K",
          caption: "Total revenue, Jan to May",
          source: "Shopify · $48.9K Meta spend",
        },
      },
      {
        _key: "c1",
        chartType: "barComparison",
        config: {
          prior: 1,
          current: 3.4,
          priorLabel: "SPEND",
          currentLabel: "RETURN",
          digits: "3.40",
          unit: "×",
          caption: "Blended return on ad spend",
          source: "$166K revenue / $48.9K spend",
        },
      },
      {
        _key: "c2",
        chartType: "ringFill",
        config: {
          percent: 80,
          digits: "4,884",
          caption: "Total transactions, Jan to May",
          source: "Meta · $10.01 avg CPA",
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

async function run() {
  // Both docs cross-reference each other via upNext, so seed them in a single
  // transaction: references are validated against the post-commit state, which
  // lets the forward/circular reference resolve.
  await client
    .transaction()
    .createOrReplace(fitaid)
    .createOrReplace(smolotov)
    .commit();
  console.log(
    `Migration complete: seeded ${fitaid.client} (${FITAID_ID}) + ${smolotov.client} (${SMOLOTOV_ID}), cross-linked.`,
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
