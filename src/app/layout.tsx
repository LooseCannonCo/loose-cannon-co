import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";

import { Flippy } from "@/components/Flippy/Flippy";
import { MetaPixelRouteTracker } from "@/components/MetaPixel/MetaPixelRouteTracker";

import "@/styles/globals.css";

// Drop the real ID into the NEXT_PUBLIC_META_PIXEL_ID env var in Netlify.
// Absent → no script, no init, no fire. Pixel cleanly no-ops.
const METAPIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// Self-hosted via next/font/google: no render-block, no layout shift, font
// files served from the same origin. display: swap = fallback shown until
// the font is ready, then a single swap.
// Weights trimmed to only what tokens.css actually consumes (Bricolage 700
// for display, DM Sans 400 for body + 600 for eyebrow/caption/source).
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Loose Cannon Co.",
  description: "Loose Cannon Co.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        {/* Meta Pixel base: standard fbevents.js bootstrap + initial PageView.
            Subsequent client-side route changes fire PageView via the tracker
            below. Gated on the env var so absent ID renders nothing. */}
        {METAPIXEL_ID ? (
          <>
            <Script id="meta-pixel-base" strategy="afterInteractive">
              {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${METAPIXEL_ID}');
fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${METAPIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
            <Suspense fallback={null}>
              <MetaPixelRouteTracker />
            </Suspense>
          </>
        ) : null}
        {children}
        {/* Flippy is mounted once at the root so he survives every route
            change. Position is fixed, pointer-events: none. */}
        <Flippy />
      </body>
    </html>
  );
}
