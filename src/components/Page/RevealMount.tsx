"use client";

import { useReveal } from "@/lib/useReveal";

/** Mounts the section reveal system once per page. Renders nothing. */
export function RevealMount() {
  useReveal();
  return null;
}
