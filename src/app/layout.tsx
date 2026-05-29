import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";

import { Flippy } from "@/components/Flippy/Flippy";
import { MetaPixelRouteTracker } from "@/components/MetaPixel/MetaPixelRouteTracker";

import "@/styles/globals.css";

// TODO: replace with real Meta Pixel ID before launch (Noah).
const METAPIXEL_ID = "XXXXXXXXXXXXXXX";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
            below. */}
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
        {children}
        {/* Flippy is mounted once at the root so he survives every route
            change. Position is fixed, pointer-events: none. */}
        <Flippy />
      </body>
    </html>
  );
}
