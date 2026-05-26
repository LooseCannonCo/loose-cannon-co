/**
 * Shared SVG halftone patterns referenced by the chart primitives via
 * url(#ht-p), url(#ht-v), url(#ht-p-sm), url(#ht-v-sm). Render once per page
 * (it lives inside <Page>). Colors are the locked plum (#270c1d) and violet
 * (#b14aff) inks; SVG pattern fills use the hex directly.
 */
export function HalftoneDefs() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute" }}
      aria-hidden="true"
    >
      <defs>
        <pattern id="ht-p" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="1.55" fill="#270c1d" />
        </pattern>
        <pattern id="ht-v" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="1.4" fill="#b14aff" fillOpacity="0.6" />
        </pattern>
        <pattern id="ht-p-sm" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.25" fill="#270c1d" />
        </pattern>
        <pattern id="ht-v-sm" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.1" fill="#b14aff" fillOpacity="0.6" />
        </pattern>
      </defs>
    </svg>
  );
}
