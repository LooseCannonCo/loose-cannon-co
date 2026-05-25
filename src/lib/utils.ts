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
