"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/Button/Button";
import { Footer } from "@/components/Footer/Footer";
import { Nav } from "@/components/Nav/Nav";
import { Page } from "@/components/Page/Page";
import { SectionEyebrow } from "@/components/SectionEyebrow/SectionEyebrow";
import { cn } from "@/lib/utils";

import styles from "./page.module.css";

const FORM_NAME = "contact-intake";

const PROJECT_TYPES = [
  "Paid social",
  "Social-first creative",
  "Brand systems",
  "All of it",
  "Honestly, not sure",
];

const BUDGETS = [
  "Under $10k",
  "$10k to $50k",
  "$50k to $100k",
  "$100k+",
  "I'll know it when I see it",
];

const POINTS = [
  {
    num: "01",
    numRot: "rotate(-3deg)",
    title: "Reply within a day.",
    titleRot: "rotate(-1.4deg)",
    desc: (
      <>
        Two of the good ones, anyway.
        <br />
        The bad ones get two days.
      </>
    ),
  },
  {
    num: "02",
    numRot: "rotate(2.5deg)",
    title: (
      <>
        Senior creatives
        <br />
        on the call.
      </>
    ),
    titleRot: "rotate(1.2deg)",
    desc: (
      <>
        You&apos;ll talk to Noah or Briana.
        <br />
        The same people who do the work.
      </>
    ),
  },
  {
    num: "03",
    numRot: "rotate(-2deg)",
    title: "No middle layer.",
    titleRot: "rotate(-1deg)",
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "sent" | "error";
type FieldErrors = { name?: string; email?: string; message?: string };

export default function ContactPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  // The one-shot "you sent us nothing" summary near the button.
  const [formError, setFormError] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // Scroll reveals: toggle [data-in] on .rv / .rvf as they enter the viewport.
  // Mirrors the Services choreography; lives here since the page is already a
  // client component. Reduced motion lands everything at its final state.
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const reveals = Array.from(
      document.querySelectorAll<HTMLElement>(`.${styles.rv}, .${styles.rvf}`),
    );

    if (reduce || !("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.setAttribute("data-in", ""));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.setAttribute("data-in", "");
          io.unobserve(en.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -10% 0px" },
    );
    reveals.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  // Clear a field's error the moment they fix it (and drop the summary once any
  // required field is no longer empty).
  const clearIfValid = (field: keyof FieldErrors, valid: boolean) => {
    if (!valid) return;
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setFormError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    const get = (k: string) => (fd.get(k) ?? "").toString();

    const name = get("name").trim();
    const email = get("email").trim();
    const message = get("message").trim();

    // Validation with attitude. Deadpan, still informative.
    const nextErrors: FieldErrors = {};
    if (!name) nextErrors.name = "We need a name. Even a fake one.";
    if (!email) nextErrors.email = "An email helps. We can't reply to a vibe.";
    else if (!EMAIL_RE.test(email)) nextErrors.email = "That's not an email.";
    if (!message) nextErrors.message = "Tell us something. A sentence. Anything.";

    if (Object.keys(nextErrors).length > 0) {
      const allEmpty = !name && !email && !message;
      setErrors(nextErrors);
      setFormError(allEmpty ? "You sent us nothing. Bold." : null);
      // Move focus to the first invalid field, in document order.
      if (nextErrors.name) nameRef.current?.focus();
      else if (nextErrors.email) emailRef.current?.focus();
      else if (nextErrors.message) messageRef.current?.focus();
      return;
    }

    setErrors({});
    setFormError(null);
    setStatus("submitting");

    // ── Submit wiring below is unchanged: same Netlify endpoint, same payload,
    //    same honeypot, same Meta Pixel Lead event. ───────────────────────────
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

  const sent = status === "sent";

  return (
    <Page>
      <Nav />

      {/* MASTHEAD */}
      <div className={styles.masthead}>
        <span className={styles.fur}>Contact // No. 003</span>
        <span className={cn(styles.fur, styles.furR)}>
          Loose Cannon Co. // Where to send it
        </span>
      </div>

      {/* HERO */}
      <section className={styles.hero}>
        <SectionEyebrow className={styles.heroEyebrow}>Contact</SectionEyebrow>
        <h1 className={styles.heroH1}>
          <span className={styles.hl1}>Show us yours.</span>
          <span className={styles.hl2}>We&apos;ll show ours.</span>
        </h1>
        <p className={cn(styles.sub, styles.rv)}>
          We read every one. The good ones get a reply within a day.
          <br />
          The bad ones get a reply within two.
        </p>
      </section>

      {/* THE FORM (or success state) */}
      <section className={styles.section}>
        <SectionEyebrow className={styles.formEyebrow}>
          {sent ? "Sent" : "The form"}
        </SectionEyebrow>

        {sent ? (
          <div className={styles.success}>
            <h2 className={styles.successHead}>
              <span className={styles.scl1}>Got it.</span>
              <span className={styles.scl2}>We&apos;ll write back. Probably.</span>
            </h2>
            <p className={styles.successSub}>
              A day for the good ones. Two for everyone else.
            </p>
            {/* Local Flippy artwork + bubble. The global cursor Flippy is
                untouched. */}
            <div className={styles.flippyWrap} aria-hidden="true">
              <div className={styles.flippyBubble}>nice.</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.flippyImg}
                src="/flippy.svg"
                alt=""
                width={230}
                height={381}
                draggable={false}
              />
            </div>
          </div>
        ) : (
          <>
            <h2 className={styles.formHeading}>Five questions.</h2>

            {/* Hecklers down the side of the form. */}
            <span className={cn(styles.heckler, styles.heckler1)} aria-hidden="true">
              the easy one
            </span>
            <span className={cn(styles.heckler, styles.heckler2)} aria-hidden="true">
              be honest
            </span>
            <span className={cn(styles.heckler, styles.heckler3)} aria-hidden="true">
              this is the one that matters
            </span>

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
                    ref={nameRef}
                    name="name"
                    type="text"
                    placeholder="Your name. A real one helps."
                    className={cn(styles.input, styles.tiltA)}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    onChange={(e) =>
                      clearIfValid("name", e.target.value.trim().length > 0)
                    }
                  />
                  <span id="name-error" className={styles.error} aria-live="polite">
                    {errors.name}
                  </span>
                </div>

                <div className={styles.field}>
                  <label htmlFor="email" className={styles.label}>
                    Email
                    <span className={styles.req} aria-hidden="true" />
                  </label>
                  <input
                    id="email"
                    ref={emailRef}
                    name="email"
                    type="email"
                    placeholder="you@wherever.com"
                    className={cn(styles.input, styles.tiltB)}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    onChange={(e) =>
                      clearIfValid("email", EMAIL_RE.test(e.target.value.trim()))
                    }
                  />
                  <span id="email-error" className={styles.error} aria-live="polite">
                    {errors.email}
                  </span>
                </div>

                <div className={styles.field}>
                  <label htmlFor="projectType" className={styles.label}>
                    Project type
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    defaultValue=""
                    className={cn(styles.input, styles.tiltC)}
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
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    defaultValue=""
                    className={cn(styles.input, styles.tiltD)}
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

                <div className={cn(styles.field, styles.full)}>
                  <label htmlFor="message" className={styles.label}>
                    Tell us about it
                    <span className={styles.req} aria-hidden="true" />
                  </label>
                  <textarea
                    id="message"
                    ref={messageRef}
                    name="message"
                    placeholder={
                      "Brief, audience, what you're trying to do, deadline. The more specific, the faster we can be\u00A0useful."
                    }
                    className={cn(styles.input, styles.textarea, styles.tiltE)}
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    onChange={(e) =>
                      clearIfValid("message", e.target.value.trim().length > 0)
                    }
                  />
                  <span
                    id="message-error"
                    className={styles.error}
                    aria-live="polite"
                  >
                    {errors.message}
                  </span>
                </div>
              </div>

              <div className={styles.submitRow}>
                <span className={styles.sendTilt}>
                  <Button type="submit">
                    {status === "submitting" ? "Sending..." : "Send it."}
                  </Button>
                </span>
                {/* Live region for the all-empty summary + network error. */}
                <span className={styles.formError} aria-live="polite">
                  {formError}
                </span>
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

      {/* THE THREE POINTS */}
      <section className={cn(styles.section, styles.tail)}>
        <div className={styles.points}>
          {POINTS.map((p) => (
            <div key={p.num} className={styles.rv}>
              <div className={styles.pointNum} style={{ transform: p.numRot }}>
                {p.num}
              </div>
              <h3
                className={styles.pointTitle}
                style={{ transform: p.titleRot }}
              >
                {p.title}
              </h3>
              <p className={styles.pointDesc}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </Page>
  );
}
