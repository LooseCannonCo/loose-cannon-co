import { Footer } from "@/components/Footer/Footer";
import { Nav } from "@/components/Nav/Nav";
import { Page } from "@/components/Page/Page";
import { Section } from "@/components/Section/Section";

import styles from "./page.module.css";

export default function Home() {
  return (
    <Page>
      <Nav />
      <main>
        <Section>
          <h1 className={styles.placeholder}>Phase B.1 foundation</h1>
        </Section>
      </main>
      <Footer />
    </Page>
  );
}
