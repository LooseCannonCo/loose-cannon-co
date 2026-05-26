import { Footer } from "@/components/Footer/Footer";
import { Hero } from "@/components/Hero/Hero";
import { Nav } from "@/components/Nav/Nav";
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

export default function Home() {
  return (
    <Page>
      <Nav />
      <main>
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
          artifact={<div style={artifactStyle}>Hero artifact placeholder</div>}
        />
      </main>
      <Footer />
    </Page>
  );
}
