import { Hero } from "@/components/Hero/Hero";
import { Page } from "@/components/Page/Page";

const artifactStyle: React.CSSProperties = {
  aspectRatio: "4 / 5",
  boxShadow: "8px 8px 0 var(--lc-plum)",
  border: "2px solid var(--lc-plum)",
  background: "var(--lc-cream)",
  display: "grid",
  placeItems: "center",
  textAlign: "center",
  padding: "24px",
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "var(--lc-plum)",
};

const artifact = <div style={artifactStyle}>Hero artifact placeholder</div>;

/** QA harness for <Hero> / <HeroNumber>: three configs covering 4-, 3-, and
 *  6-digit slot-roll timing. */
export default function HeroTestPage() {
  return (
    <Page>
      <Hero
        eyebrow="What happened."
        number={{
          prefix: "+",
          digits: "2,400",
          suffix: "%",
          sticker: { text: "Banger!", angle: -11 },
        }}
        headline={"Hunkfruit, Gollum,\nand the gym crush."}
        subhead="Engagement went vertical in 90 days."
        meta="Client: FITAID · Discipline: Social-First Creative"
        artifact={artifact}
      />
      <Hero
        eyebrow="The number."
        number={{
          prefix: "$",
          digits: "332",
          suffix: "K",
          sticker: { text: "Off the charts!", angle: 4 },
        }}
        headline={"Smolotov made these.\nWe made them perform."}
        subhead="$332K in five months from a brand that had never sold direct."
        meta="Client: Smolotov · Discipline: Performance Creative"
        artifact={artifact}
      />
      <Hero
        eyebrow="Test."
        number={{ digits: "100,000", sticker: { text: "Next level!", angle: 6 } }}
        headline="Testing six-digit slot-roll."
        subhead="Verifying timing scales with digit count."
        meta="QA · 2025"
        artifact={artifact}
      />
    </Page>
  );
}
