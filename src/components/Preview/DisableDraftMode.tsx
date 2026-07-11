"use client";

import { useDraftModeEnvironment } from "next-sanity/hooks";

/**
 * Fixed "Exit preview" pill shown while draft mode is on. Hidden inside the
 * Presentation tool (the Studio already frames the preview there); it only
 * appears when someone opens the site in a normal tab while the draft cookie
 * is still set, so they can't get stuck seeing unpublished content.
 */
export function DisableDraftMode() {
  const environment = useDraftModeEnvironment();
  if (environment !== "live" && environment !== "unknown") return null;

  return (
    <a
      href="/api/draft-mode/disable"
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 9999,
        padding: "10px 16px",
        background: "#1a1023",
        color: "#fff7ec",
        font: "600 13px/1 var(--font-body, sans-serif)",
        letterSpacing: "0.02em",
        borderRadius: 999,
        boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
        textDecoration: "none",
      }}
    >
      Previewing drafts. Click to exit
    </a>
  );
}
