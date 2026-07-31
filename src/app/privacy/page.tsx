import type { Metadata } from "next";

import { Footer } from "@/components/Footer/Footer";
import { Nav } from "@/components/Nav/Nav";
import { Page } from "@/components/Page/Page";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Privacy policy | Loose Cannon Co.",
  description:
    "How Loose Cannon Co. collects, uses, and protects your information.",
};

/**
 * /privacy: the quiet legal page. Uses the existing design system but none of
 * the loud parts. No stickers, no halftone, no misregistration, no reveals.
 */
export default function PrivacyPage() {
  return (
    <Page>
      <Nav />

      <header className={styles.header}>
        <span className={styles.eyebrow}>Legal</span>
        <h1 className={styles.headline}>Privacy policy.</h1>
        <p className={styles.effective}>Effective July 31, 2026</p>
      </header>

      <div className={styles.body}>
        <p>
          Welcome to Loose Cannon Co. (&quot;Loose Cannon,&quot; &quot;we,&quot;
          &quot;our,&quot; or &quot;us&quot;). Your privacy matters to us. This
          Privacy Policy explains how we collect, use, store, and protect your
          information when you visit our website, submit your information,
          participate in our live broadcasts, call into our shows, or otherwise
          interact with our services.
        </p>
        <p>
          By using our website or participating in our programming, you agree to
          the practices described in this Privacy Policy.
        </p>

        <h2>Information we collect</h2>
        <p>
          Depending on how you interact with us, we may collect the following
          information.
        </p>

        <h3>Information you provide</h3>
        <p>You may voluntarily provide information including:</p>
        <ul>
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Company or business name</li>
          <li>Website URL</li>
          <li>Social media profiles</li>
          <li>Business information</li>
          <li>Marketing materials</li>
          <li>Questions submitted for the show</li>
          <li>Files or documents you upload</li>
          <li>Any other information you choose to provide</li>
        </ul>

        <h3>Information collected automatically</h3>
        <p>When you visit our website, we may automatically collect:</p>
        <ul>
          <li>IP address</li>
          <li>Browser type</li>
          <li>Device information</li>
          <li>Operating system</li>
          <li>Pages visited</li>
          <li>Referring website</li>
          <li>Time spent on pages</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>

        <h2>Live call-in shows</h2>
        <p>
          Loose Cannon produces live and recorded broadcasts where viewers may
          call in to discuss topics including, but not limited to:
        </p>
        <ul>
          <li>Website reviews</li>
          <li>Marketing advice</li>
          <li>Branding</li>
          <li>Business ideas</li>
          <li>Sales strategies</li>
          <li>Entrepreneurship</li>
          <li>Audience Q&amp;A</li>
        </ul>
        <p>
          By participating in a live call, video call, voicemail, or recorded
          submission, you acknowledge and agree that:
        </p>
        <ul>
          <li>
            Your voice, image, likeness, business name, website, and submitted
            materials may be broadcast live.
          </li>
          <li>Calls may be recorded.</li>
          <li>Recordings may be edited.</li>
          <li>
            Recordings may be redistributed across social media, podcasts,
            streaming platforms, newsletters, promotional materials, and future
            content.
          </li>
          <li>
            We are under no obligation to remove published content unless
            required by law.
          </li>
          <li>Participation is entirely voluntary.</li>
        </ul>

        <h2>Website roast and business review disclaimer</h2>
        <p>Our show is designed for educational and entertainment purposes.</p>
        <p>
          Any feedback, critiques, or opinions expressed by our hosts or guests
          are opinions only and should not be considered legal, financial,
          accounting, investment, or professional advice.
        </p>
        <p>
          Participants understand that business reviews, website critiques, and
          marketing feedback may include candid commentary intended to educate
          both the participant and the audience.
        </p>

        <h2>How we use your information</h2>
        <p>We may use your information to:</p>
        <ul>
          <li>Respond to inquiries</li>
          <li>Schedule appearances</li>
          <li>Verify callers</li>
          <li>Produce live broadcasts</li>
          <li>Publish submitted content</li>
          <li>Improve our services</li>
          <li>Send newsletters (if you opt in)</li>
          <li>Communicate regarding future appearances</li>
          <li>Analyze website traffic</li>
          <li>Prevent fraud or abuse</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>Cookies</h2>
        <p>
          Our website may use cookies and similar technologies to improve user
          experience, analyze traffic, remember preferences, and measure
          marketing effectiveness.
        </p>
        <p>
          Most browsers allow you to disable cookies through your browser
          settings.
        </p>

        <h2>Email communications</h2>
        <p>
          If you subscribe to our newsletter or provide your email address, we
          may occasionally send updates regarding:
        </p>
        <ul>
          <li>New episodes</li>
          <li>Live shows</li>
          <li>Events</li>
          <li>Business announcements</li>
          <li>Promotions</li>
        </ul>
        <p>
          You may unsubscribe at any time using the unsubscribe link included in
          our emails.
        </p>

        <h2>Sharing information</h2>
        <p>We do not sell your personal information.</p>
        <p>
          We may share information with trusted service providers who assist
          with operating our business, including website hosting, email
          delivery, analytics, customer support, payment processing, and
          streaming services.
        </p>
        <p>
          We may also disclose information if required by law or to protect our
          legal rights.
        </p>

        <h2>Third-party services</h2>
        <p>
          Our website may link to third-party websites or use third-party
          platforms including social media, livestreaming services, analytics
          providers, scheduling tools, and payment processors.
        </p>
        <p>
          We are not responsible for the privacy practices of those third
          parties.
        </p>

        <h2>Data security</h2>
        <p>
          We implement reasonable administrative, technical, and physical
          safeguards designed to protect your information. However, no method
          of transmission over the Internet or electronic storage is completely
          secure, and we cannot guarantee absolute security.
        </p>

        <h2>Data retention</h2>
        <p>
          We retain personal information only as long as reasonably necessary
          to fulfill the purposes described in this Privacy Policy, comply with
          legal obligations, resolve disputes, or enforce our agreements.
        </p>
        <p>
          Broadcast recordings and published content may be retained
          indefinitely unless otherwise required by law.
        </p>

        <h2>Children&apos;s privacy</h2>
        <p>
          Our website and programming are not directed toward children under
          the age of 13. We do not knowingly collect personal information from
          children under 13.
        </p>
        <p>
          If we learn that we have collected such information, we will take
          reasonable steps to delete it.
        </p>

        <h2>Your rights</h2>
        <p>
          Depending on where you live, you may have rights regarding your
          personal information, including the right to:
        </p>
        <ul>
          <li>Request access to your personal information</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of certain information</li>
          <li>Request a copy of your personal information</li>
          <li>Object to certain processing activities</li>
          <li>Withdraw consent where applicable</li>
        </ul>
        <p>
          To exercise these rights, please contact us using the information
          below.
        </p>

        <h2>California privacy rights</h2>
        <p>
          If you are a California resident, you may have additional rights
          under applicable California privacy laws regarding access to,
          deletion of, and correction of your personal information.
        </p>

        <h2>Changes to this privacy policy</h2>
        <p>We may update this Privacy Policy from time to time.</p>
        <p>
          The updated version will be posted on this page with a revised
          effective date. Continued use of our website or participation in our
          services constitutes acceptance of the updated policy.
        </p>

        <h2>Contact us</h2>
        <p>
          If you have questions regarding this Privacy Policy or our privacy
          practices, please contact us at:
        </p>
        <p>
          Loose Cannon Co.
          <br />
          Email:{" "}
          <a href="mailto:seymourbuttz@loosecannon.co">
            seymourbuttz@loosecannon.co
          </a>
          <br />
          Website: loosecannon.co
        </p>
      </div>

      <Footer />
    </Page>
  );
}
