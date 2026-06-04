"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/Button/Button";
import { Footer } from "@/components/Footer/Footer";
import { Nav } from "@/components/Nav/Nav";
import { Page } from "@/components/Page/Page";
import { PrintHeadline } from "@/components/PrintHeadline/PrintHeadline";
import { SectionEyebrow } from "@/components/SectionEyebrow/SectionEyebrow";

import styles from "./page.module.css";

const FORM_NAME = "contact-intake";

const PROJECT_TYPES = [
  "Paid social",
  "Brand systems",
  "Social-first creative",
  "Campaigns",
  "Not sure yet",
];

const BUDGETS = [
  "Under $10k",
  "$10k to $25k",
  "$25k to $50k",
  "$50k to $100k",
  "$100k+",
  "Tell you in the form",
];

const REASSURANCE = [
  {
    num: "01",
    title: "Reply within a day.",
    desc: "Two of the good ones, anyway. The bad ones get two days.",
  },
  {
    num: "02",
    title: "Senior creatives on the call.",
    desc: "You'll talk to Noah or Briana. The same people who do the work.",
  },
  {
    num: "03",
    title: "No middle layer.",
    desc: "Zero account managers. Zero handoffs.",
  },
];

// Netlify Forms accepts URL-encoded POSTs with form-name in the body. We post
// to the static mirror at /__forms.html (not /) so the @netlify/plugin-nextjs
// runtime doesn't intercept the request and route it to Next before Netlify's
// form processor sees it.
const NETLIFY_FORM_ENDPOINT = "/__forms.html";

function encode(data: Record<string, string>): string {
  return Object.entries(data)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}

type Status = "idle" | "submitting" | "sent" | "error";

export default function ContactPage() {
  const [status, setStatus] = useState<Status>("idle");

  const reset = () => setStatus("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload: Record<string, string> = { "form-name": FORM_NAME };
    fd.forEach((value, key) => {
      payload[key] = typeof value === "string" ? value : "";
    });

    try {
      const res = await fetch(NETLIFY_FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(payload),
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }

      // Meta Pixel Lead event. Guarded so SSR and pixel-not-loaded both no-op.
      // Only fires after Netlify accepted the submission.
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "Lead", {
          content_name: "Contact intake",
          value: 0,
          currency: "USD",
        });
      }

      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <Page>
      <Nav />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <SectionEyebrow>Contact</SectionEyebrow>
          <div className={styles.heroHeadlineWrap}>
            <PrintHeadline as="h1" className={styles.heroHeadline}>
              Tell us what you&apos;re working&nbsp;on.
            </PrintHeadline>
            <PrintHeadline as="span" className={styles.heroHeadline}>
              We&apos;ll write back&nbsp;fast.
            </PrintHeadline>
          </div>
          <p className={styles.subhead}>
            We read every one. The good ones get a reply within a day. The bad
            ones get a reply within two.
          </p>
        </div>
      </section>

      {/* THE FORM (or confirmation after success) */}
      <section className={styles.section}>
        <SectionEyebrow>
          {status === "sent" ? "Received" : "The form"}
        </SectionEyebrow>

        {status === "sent" ? (
          <div className={styles.confirm}>
            <PrintHeadline as="h2" className={styles.confirmHeadline}>
              Got it.
            </PrintHeadline>
            <p className={styles.confirmBody}>
              We read every one. The good ones get a reply within a day. Yours
              just landed on top of the stack.
            </p>
            <button
              type="button"
              onClick={reset}
              className={styles.confirmLink}
            >
              Send another <span aria-hidden="true">→</span>
            </button>
          </div>
        ) : (
          <>
            <h2 className={styles.sectionTitle}>Five questions.</h2>

            <form
              name={FORM_NAME}
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              className={styles.form}
              noValidate
            >
              {/* Netlify needs form-name in the POST body so it can route the
                  submission to the right form. */}
              <input type="hidden" name="form-name" value={FORM_NAME} />
              {/* Honeypot field. Hidden from humans, filled by bots, dropped by Netlify. */}
              <p className={styles.honey}>
                <label>
                  Don&apos;t fill this out if you&apos;re human:{" "}
                  <input name="bot-field" tabIndex={-1} autoComplete="off" />
                </label>
              </p>

              <div className={styles.fieldGrid}>
                <div className={styles.field}>
                  <label htmlFor="name" className={styles.label}>
                    Name
                    <span className={styles.req} aria-hidden="true" />
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="email" className={styles.label}>
                    Email
                    <span className={styles.req} aria-hidden="true" />
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@somewhere.com"
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="projectType" className={styles.label}>
                    Project type
                    <span className={styles.req} aria-hidden="true" />
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    required
                    defaultValue=""
                    className={styles.input}
                  >
                    <option value="" disabled>
                      Pick one
                    </option>
                    {PROJECT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label htmlFor="budget" className={styles.label}>
                    Budget
                    <span className={styles.req} aria-hidden="true" />
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    required
                    defaultValue=""
                    className={styles.input}
                  >
                    <option value="" disabled>
                      Pick one
                    </option>
                    {BUDGETS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={`${styles.field} ${styles.full}`}>
                  <label htmlFor="message" className={styles.label}>
                    Tell us about it
                    <span className={styles.req} aria-hidden="true" />
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    placeholder="Brief, audience, what you're trying to do, deadline. The more specific, the faster we can be useful."
                    className={`${styles.input} ${styles.textarea}`}
                  />
                </div>
              </div>

              <div className={styles.submitRow}>
                <Button type="submit">
                  {status === "submitting" ? "Sending." : "Send it."}
                </Button>
                {status === "error" ? (
                  <span className={styles.errMsg}>
                    Something went sideways. Try again in a sec.
                  </span>
                ) : null}
              </div>
            </form>
          </>
        )}
      </section>

      {/* REASSURANCE STRIP */}
      <section className={styles.section}>
        <div className={styles.strip}>
          {REASSURANCE.map((r) => (
            <div key={r.num} className={styles.stripCell}>
              <div className={styles.stripNum}>{r.num}</div>
              <h3 className={styles.stripTitle}>{r.title}</h3>
              <p className={styles.stripDesc}>{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </Page>
  );
}
