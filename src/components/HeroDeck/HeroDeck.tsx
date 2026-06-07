'use client';

// HeroDeck.tsx — Loose Cannon homepage hero (living press sheet).
// Imperative deal/animation ported from the approved prototype.
// Data-driven: pass the curated `cards` array (from Sanity). Copy props have defaults.
//
// The prototype's built-in single-layer Flippy was removed on integration: the
// site already mounts the global cursor-follower Flippy once in app/layout.tsx,
// so rendering a second one here would double him up.

import { useCallback, useEffect, useRef } from 'react';

import { PrintHeadline } from '@/components/PrintHeadline/PrintHeadline';

import type { HeroCard } from './heroDeck.types';
import './HeroDeck.css';

type Props = {
  cards: HeroCard[];
  eyebrow?: string;
  headline?: React.ReactNode;
  subhead?: React.ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
};

function CardFace({ c }: { c: HeroCard }) {
  switch (c.cardType) {
    case 'post': {
      // A finished post graphic, uploaded as an image, filling the card.
      // object-fit: cover + the Sanity hotspot as object-position. Wrapped in a
      // link when one is set. Bleed/offset/motion live on the card wrapper.
      const img = (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="post-img"
          src={c.imageUrl}
          alt={c.alt ?? ''}
          style={
            c.hotspot
              ? { objectPosition: `${c.hotspot.x * 100}% ${c.hotspot.y * 100}%` }
              : undefined
          }
        />
      );
      return (
        <div className="card__face face-post">
          {c.linkUrl ? (
            <a className="post-link" href={c.linkUrl}>{img}</a>
          ) : (
            img
          )}
        </div>
      );
    }
    case 'poster':
      return (
        <div
          className="card__face face-poster"
          style={c.imageUrl ? { backgroundImage: `url(${c.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
        >
          <svg className="ht" viewBox="0 0 100 100" preserveAspectRatio="none">
            <rect width="100" height="100" fill="url(#lc-ht)" />
          </svg>
          <div className="topbar" />
          <div className="bignum">{c.num}</div>
          <div className="ptitle">{c.title}</div>
        </div>
      );
    case 'quote':
      return (
        <div className="card__face face-quote">
          <div className="topbar" />
          <div className="qeyebrow">{c.eyebrow}</div>
          <div className="qmark">&ldquo;</div>
          <div className="qtext">{c.text}</div>
        </div>
      );
    case 'review':
      return (
        <div className="card__face face-review">
          <div className="topbar" />
          <div className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
          <div className="who">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {c.avatarUrl ? <img className="av" src={c.avatarUrl} alt="" /> : <div className="av" />}
            <div>
              <div className="nm">{c.name}</div>
              <div className="role">{c.role}</div>
            </div>
          </div>
          <div className="rtext">
            {c.text} <span className="more">Read more</span>
          </div>
          <div className="foot">
            <div className="pg">Posted on</div>
            <div className="gg"><b>G</b><b>o</b><b>o</b><b>g</b><b>l</b><b>e</b></div>
          </div>
          {c.helpful && <div className="help">{c.helpful} people found this helpful</div>}
        </div>
      );
    case 'ayyeStatement': {
      let body: React.ReactNode = c.text;
      if (c.accentText && c.text.includes(c.accentText)) {
        const [before, after] = c.text.split(c.accentText);
        body = (<>{before}<em>{c.accentText}</em>{after}</>);
      }
      return (
        <div className="card__face face-ay face-ay-stmt">
          <div className="abar" />
          <div className="astmt">{body}</div>
          <div className="awm">Ayye</div>
          <div className="atag">Decisions. Remembered.</div>
        </div>
      );
    }
    case 'ayyeReceipt':
      return (
        <div className="card__face face-ay face-ay-rcpt">
          <div className="rhead">{c.head}</div>
          <div className="rsub">{c.sub}</div>
          {c.lines.map((l, i) => (
            <div className="rline" key={i}><span>{l.label}</span><span>{l.value}</span></div>
          ))}
          <div className="rrule" />
          <div className="rline rtot"><span>{c.totalLabel}</span><span>{c.totalValue}</span></div>
          <div className="rfoot">Decisions. Remembered.</div>
        </div>
      );
    case 'ayyeReview':
      return (
        <div className="card__face face-ay face-ay-rev">
          <div className="abar" />
          <div className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
          <div className="who">
            <div className="nm">{c.name}</div>
            <div className="role">{c.role}</div>
          </div>
          <div className="rtext">{c.text}</div>
          <div className="store">Reviewed on the <b>App&nbsp;Store</b></div>
        </div>
      );
    default:
      return null;
  }
}

export default function HeroDeck({
  cards,
  eyebrow = 'Social-first creative studio',
  headline = (<>Social that<br />doesn&apos;t suck.</>),
  subhead = (<>Social-first creative for brands tired of looking like everyone&nbsp;else.</>),
  ctaLabel = 'See the work',
  ctaHref = '/work',
}: Props) {
  const heroRef = useRef<HTMLElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const frontRef = useRef(0);
  const reduceRef = useRef(false);

  const rand = (a: number, b: number) => a + Math.random() * (b - a);

  const deal = useCallback(() => {
    const els = cardRefs.current;
    const N = els.length;
    if (!N) return;
    const reduce = reduceRef.current;
    // Offsets scale with the responsive card width; mobile uses a centred stack.
    const cardW = els.find(Boolean)?.offsetWidth || 285;
    const cardH = cardW * 1.435;
    const mobile = typeof window !== 'undefined' && window.innerWidth <= 900;
    for (let i = 0; i < N; i++) {
      const rel = (i - frontRef.current + N) % N;
      const el = els[i];
      if (!el) continue;
      if (rel < 3) {
        let x: number, y: number, r: number, s: number, z: number;
        if (reduce) {
          x = mobile ? [0, -24, 20][rel] : [0, -0.3 * cardW, -0.4 * cardW][rel];
          y = mobile ? [6, -18, 20][rel] : [0, -0.12 * cardH, -0.22 * cardH][rel];
          r = [-3, 13, -17][rel]; s = rel === 0 ? 1 : 0.92; z = [30, 20, 10][rel];
        } else if (rel === 0) {
          // FRONT card = the right anchor. Desktop: fixed at x:0 so it alone
          // defines the right boundary. Small tilt only. (Mobile: centred.)
          x = mobile ? rand(-10, 10) : 0;
          y = mobile ? rand(-8, 12) : 0;
          r = rand(-5, 5); s = 1; z = 30;
        } else {
          // Every other visible card sits BEHIND and to the LEFT of the front,
          // fanning up-and-left — never further right than the front. Offsets are
          // fractions of card width (>=0.25w) so even a fully-tilted back card's
          // right corner stays left of the front's, at any card size or cycle.
          // Mobile (single column, centred): a small symmetric jitter instead.
          if (mobile) {
            x = rel === 1 ? rand(-22, 16) : rand(-30, 22);
            y = rel === 1 ? rand(-22, 22) : rand(-26, 26);
          } else {
            x = -(rel === 1 ? rand(0.25, 0.34) : rand(0.34, 0.46)) * cardW;
            y = -(rel === 1 ? rand(0.06, 0.16) : rand(0.14, 0.26)) * cardH;
          }
          r = rel === 1 ? rand(-20, 20) : rand(-22, 22);
          s = rand(0.88, 0.95); z = rel === 1 ? 20 : 10;
        }
        el.style.zIndex = String(z);
        el.style.opacity = '1';
        el.style.transform = `translate(${x}px,${y}px) rotate(${r}deg) scale(${s})`;
      } else {
        el.style.zIndex = '0';
        el.style.opacity = '0';
        el.style.transform = `translate(0,10px) rotate(${rand(-3, 3)}deg) scale(.86)`;
      }
    }
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    reduceRef.current = reduce;
    const els = cardRefs.current;
    const N = els.length;
    if (!N) return;

    frontRef.current = Math.floor(Math.random() * N);
    deal();

    // print-in reveal (violet bleed lands, ink chases 220ms behind via CSS)
    if (reduce) {
      els.forEach((el) => el && el.classList.add('in', 'settled'));
    } else {
      els.forEach((el, i) => {
        const rel = (i - frontRef.current + N) % N;
        if (rel < 3) {
          window.setTimeout(() => {
            el.classList.add('in');
            window.setTimeout(() => el.classList.add('settled'), 900);
          }, 180 + rel * 120);
        } else {
          el.classList.add('in', 'settled');
        }
      });
    }

    let timer: number | undefined;
    const start = () => {
      if (reduce) return;
      timer = window.setInterval(() => {
        frontRef.current = (frontRef.current + 1) % N;
        deal();
      }, 5200);
    };
    start();
    const onVis = () => {
      if (document.hidden) { if (timer) clearInterval(timer); }
      else start();
    };
    document.addEventListener('visibilitychange', onVis);

    let raf = 0;
    const hero = heroRef.current;
    const wrap = wrapRef.current;
    const onMove = (e: MouseEvent) => {
      if (!hero || !wrap) return;
      const b = hero.getBoundingClientRect();
      const nx = ((e.clientX - b.left) / b.width - 0.5) * 2;
      const ny = ((e.clientY - b.top) / b.height - 0.5) * 2;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        wrap.style.transform = `rotateY(${nx * 6}deg) rotateX(${-ny * 5}deg) translate(${nx * 7}px,${ny * 5}px)`;
      });
    };
    const onLeave = () => { if (wrap) wrap.style.transform = 'rotateY(0) rotateX(0) translate(0,0)'; };
    if (!reduce && hero) {
      hero.addEventListener('mousemove', onMove);
      hero.addEventListener('mouseleave', onLeave);
    }

    return () => {
      if (timer) clearInterval(timer);
      document.removeEventListener('visibilitychange', onVis);
      if (hero) { hero.removeEventListener('mousemove', onMove); hero.removeEventListener('mouseleave', onLeave); }
      if (raf) cancelAnimationFrame(raf);
    };
  }, [cards, deal]);

  return (
    <div className="lc-hero">
      {/* shared halftone pattern for poster faces */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
        <defs>
          <pattern id="lc-ht" width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.7" fill="#fff" />
          </pattern>
        </defs>
      </svg>

      <section className="hero" ref={heroRef}>
        <div className="hero-left">
          <div className="eyebrow">{eyebrow}</div>
          {/* Site-consistent display headline: PrintHeadline supplies the violet
              registration bleed (same as About's hero). The .headwrap right-
              anchors it (justify-content:flex-end) so the long line bleeds off
              the LEFT edge only and its right edge stays left of center, clear
              of the deck. */}
          <div className="headwrap">
            <PrintHeadline as="h1" bleed className="headline">{headline}</PrintHeadline>
          </div>
          <p className="subhead">{subhead}</p>
          <a className="cta" href={ctaHref}>
            {ctaLabel} <span className="arr">&rarr;</span>
          </a>
        </div>

        <div className="hero-right">
          <div className="deck-wrap" ref={wrapRef}>
            <div className="deck">
              {cards.map((c, i) => {
                // Post cards take their image's own aspect ratio (--ch derived
                // from the fetched ratio, default 4:5) so the uploaded artifact
                // fills the card uncropped. Other card types keep the deck's
                // default card height. Width (--cw) + the deal are unchanged.
                const style =
                  c.cardType === 'post'
                    ? ({ ['--ch']: `calc(var(--cw) / ${c.ratio || 0.8})` } as React.CSSProperties)
                    : undefined;
                return (
                  <div
                    className="card"
                    key={c._key ?? i}
                    ref={(el) => { if (el) cardRefs.current[i] = el; }}
                    onClick={() => { frontRef.current = i; deal(); }}
                    style={style}
                  >
                    <div className="card__bleed" />
                    <CardFace c={c} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
