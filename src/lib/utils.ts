/**
 * Join class names, dropping falsy values.
 *
 *   cn("btn", isActive && "btn--active") // "btn btn--active"
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format a Sanity datetime string as a display date, e.g. "July 13, 2026".
 * Rendered in UTC so server and client agree and the date never slips a day.
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
