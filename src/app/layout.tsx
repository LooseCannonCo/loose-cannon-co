import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Bricolage_Grotesque, DM_Sans, Poppins } from "next/font/google";
import Script from "next/script";
import { VisualEditing } from "next-sanity";
import { Suspense } from "react";

import { CartDrawer } from "@/components/Cart/CartDrawer";
import { CartProvider } from "@/components/Cart/CartProvider";
import { Flippy } from "@/components/Flippy/Flippy";
import { MetaPixelRouteTracker } from "@/components/MetaPixel/MetaPixelRouteTracker";
import { DisableDraftMode } from "@/components/Preview/DisableDraftMode";

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
  // 400 body + 600 eyebrow/caption (site), plus 500 + 700 the HeroDeck uses.
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

// Ayye wordmark + receipt header on the HeroDeck's Ayye cards. Self-hosted via
// next/font/google (no render-block), exposed as --font-poppins and consumed by
// the hero's --ay-wm token.
const wordmark = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins",
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
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${wordmark.variable}`}
    >
      <head>
        {/* General Sans (Fontshare) — Ayye body font on the HeroDeck cards.
            Loaded by literal family name so the hero CSS --ay-font resolves. */}
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
        />
      </head>
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
        {/* Cart state lives at the root so the nav count, product pages and
            the drawer share one Shopify cart across route changes. */}
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
        {/* Flippy is mounted once at the root so he survives every route
            change. Position is fixed, pointer-events: none. */}
        <Flippy />
        {/* Presentation-tool preview plumbing. Renders nothing for normal
            visitors; in draft mode it draws click-to-edit overlays and
            refreshes the page as edits stream in from the Studio. */}
        {draftMode().isEnabled ? (
          <>
            <VisualEditing />
            <DisableDraftMode />
          </>
        ) : null}
      </body>
    </html>
  );
}
