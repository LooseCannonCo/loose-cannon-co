import { BarComparison } from "@/components/BarComparison/BarComparison";
import { Brief } from "@/components/Brief/Brief";
import { Credits } from "@/components/Credits/Credits";
import { Footer } from "@/components/Footer/Footer";
import { Hero } from "@/components/Hero/Hero";
import { MetaStrip } from "@/components/MetaStrip/MetaStrip";
import { Nav } from "@/components/Nav/Nav";
import { NineGrid, type NineTile } from "@/components/NineGrid/NineGrid";
import { Page } from "@/components/Page/Page";
import { QuoteBlock } from "@/components/QuoteBlock/QuoteBlock";
import { RingFill } from "@/components/RingFill/RingFill";
import { StatsTrio } from "@/components/StatsTrio/StatsTrio";
import { UpNext } from "@/components/UpNext/UpNext";

const heroArtifact = (
  <div
    style={{
      aspectRatio: "0.78 / 1",
      boxShadow: "8px 8px 0 var(--lc-plum)",
      border: "2px solid var(--lc-plum)",
      background: "linear-gradient(155deg, #0a0805 0%, #231a14 45%, #1a1410 100%)",
      color: "var(--lc-pink-1)",
      display: "grid",
      placeItems: "center",
      textAlign: "center",
      padding: "24px",
      fontSize: "13px",
      fontWeight: 600,
      letterSpacing: "0.04em",
      lineHeight: 1.5,
    }}
  >
    AI Gollum clutching a FITAID Recovery can
    <br />
    (image placeholder)
  </div>
);

const nineTiles: NineTile[] = [
  { label: "Homer Simpson clutching a FITAID can", kind: "image", tone: "pink" },
  { label: "Terminator emerging from flames with a FITAID", kind: "image", tone: "dark" },
  { label: "Originally called Hunkfruit. One sip and your gym crush makes eye contact.", kind: "image", tone: "dark" },
  { label: "Stevia was invented by a guy named Steve.", kind: "editorial", tone: "cream" },
  { label: "GYM: a place where you go to meet other people also named Jim.", kind: "editorial", tone: "cream" },
  { label: "Overheard: Who are you flexing for? Your mom.", kind: "editorial", tone: "cream" },
  { label: "Phil McCrackin, 5-star Google review", kind: "review", tone: "pink" },
  { label: "Overheard: I'm just going to photoshop my legs as my arms.", kind: "editorial", tone: "cream" },
  { label: "Mike Rotch, 5-star Yelp review", kind: "review", tone: "pink" },
];

export default function FitaidCaseStudy() {
  return (
    <Page>
      <Nav backHref="/work" />

      <MetaStrip
        client="FITAID"
        discipline="Social-First Creative"
        year="May 2026"
        caseLabel="Case 001"
        tag="Featured"
      />

      <Hero
        eyebrow="Best post · May 2026 · Engagement vs brand baseline"
        number={{
          prefix: "+",
          digits: "2,400",
          suffix: "%",
          sticker: { text: "Banger!", angle: -11 },
        }}
        headline={"Hunkfruit, Gollum,\nand the gym crush."}
        subhead="One AI-generated Gollum did more for the brand than a quarter of polished product shots."
        meta="May 2026 monthly drop · Trailing 90-day brand average · FITAID 1st-party data"
        artifact={heroArtifact}
      />

      <Brief
        eyebrow="The brief, decoded"
        headlineLines={["Stop selling performance.", "Start being funny."]}
        body={[
          <>
            FITAID&apos;s category is crowded with brands shouting about
            ingredients, electrolytes, and &ldquo;elite performance.&rdquo; The
            actual person drinking the can doesn&apos;t care. They&apos;re{" "}
            <u>scrolling between sets</u>, looking for something funny.
          </>,
          <>
            So we stopped writing copy that explained the product. We made jokes
            the product could sit inside of: AI-generated absurdity (Gollum,
            Homer, Terminator) alongside text-first editorial that reads like
            dictionary pages, fake Google reviews, and overheard gym dialogue.
          </>,
          <>
            The unifying logic:{" "}
            <strong>every post had to make sense on its own.</strong> No
            caption-dependence. No &ldquo;swipe to learn more.&rdquo; If the
            image and the joke didn&apos;t land in 1.5 seconds of stopped-scroll,
            it didn&apos;t ship.
          </>,
        ]}
        breakdown={[
          {
            title: "Pop culture",
            sub: "Hyperreal AI · Image-first",
            body: "Gollum, Homer, Terminator: beloved characters caught in the act of being FITAID drinkers. No explanation given.",
          },
          {
            title: "Gym myths",
            sub: "Editorial · Photo + tabloid type",
            body: "Three-part myth series, each post a one-liner. “Originally called Hunkfruit.” Most-screenshot series of the month.",
          },
          {
            title: "Fake reviews",
            sub: "UI mock · Phil McCrackin et al.",
            body: "Five-star Google reviews from customers with bad-pun names. The format does the work. The names sell it.",
          },
        ]}
      />

      <NineGrid
        tiles={nineTiles}
        footLeft="9 visual series · 9 selections · May 2026"
        footRight="All work made by Loose Cannon for FITAID, May 2026"
      />

      <StatsTrio
        eyebrow="30 days from first drop"
        title="The receipts."
        body="First-party data, May 2026. Three metrics that moved the needle: engagement, follower growth, and DTC conversion lift."
        cells={[
          {
            chart: <RingFill percent={92} />,
            number: { prefix: "+", digits: "218", unit: "%" },
            caption: "Overall account engagement vs trailing 90 days",
            source: "Instagram, 1st-party",
          },
          {
            chart: <BarComparison prior={1} current={3.4} />,
            number: { digits: "3.4", unit: "×" },
            caption: "Follower growth rate vs prior month",
            source: "Net new follows",
          },
          {
            chart: <RingFill percent={47} />,
            number: { prefix: "+", digits: "47", unit: "%" },
            caption: "DTC conversion lift on social-attributed traffic",
            source: "Shopify · Meta attribution",
          },
        ]}
      />

      <QuoteBlock
        quote="First agency we've worked with that pitched us a Gollum and was right."
        attribution="Placeholder, FITAID team"
        role="Marketing Director, FITAID"
        stickerText="Mic drop!"
        stickerAngle={8}
      />

      <Credits
        credits={[
          { label: "Strategy + Concept", name: "Briana Brugh" },
          { label: "Creative Direction + Design", name: "Noah Charnow" },
          { label: "AI Image Generation", name: "Loose Cannon Co." },
          { label: "Client Team", name: "FITAID social" },
        ]}
      />

      <UpNext
        title="Smolotov."
        href="/work/smolotov"
        caseLabel="Case 002 · Performance Creative"
        descriptor="Ads that get past the polite scroll"
      />

      <Footer />
    </Page>
  );
}
