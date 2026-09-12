"use client";

/**
 * AM AUTOMOTIVE — the page.
 *
 * The argument is the spread. Nine reachable listings run 9,000 → 175,000 km
 * across nineteen model years, every one of them publishing an odometer, one
 * of them carrying a price, one of them marked sold. There is no type of car
 * here, so there is no marque colour: the ground is the cognac leather that
 * recurs through their cabins, gold is their own shield and nothing else, and
 * --sold red belongs to the single E200 they bannered themselves.
 *
 * Arrival is "the ledger": a hairline rule is drawn first, and only once it
 * has finished does the entry get written onto it. [data-ledger] is observed,
 * [data-ledger-item] children carry a deterministic --led-i index.
 */

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { LocaleProvider, useLocale } from "@/i18n/locale-provider";
import { Spread } from "@/components/webgl/spread";
import { en } from "@/content/en";
import { ar } from "@/content/ar";
import type { SiteContentExt } from "@/content/schema-ext";
import {
  ADDRESS_AR,
  BANNER_MARQUES,
  CARS,
  FB_URL,
  FLOOR_MARQUES,
  FOLLOWERS,
  HIGHLIGHTS,
  HOST_BUSINESS,
  IG_URL,
  KM_MAX,
  KM_MIN,
  MAPS_LINKS,
  NOT_ON_BANNER,
  PHONES,
  POSTS_REACHABLE,
  POSTS_STATED,
  PRICED,
  SOLD,
  TAGLINE,
  YEAR_MAX,
  YEAR_MIN,
  YEAR_SPAN,
  type Car,
} from "@/content/media";

/* --------------------------------------------------------------- figures */

const NUM = new Intl.NumberFormat("en-US");

/** The bio exactly as the profile prints it, sparkle and all. */
const BIO = `${TAGLINE}✨`;

/** Odometer order — the order this page reads the floor in, throughout. */
const BY_KM: Car[] = [...CARS].sort((a, b) => a.km - b.km);

/** Alt text and captions live in the copy files, keyed by the CARS order. */
const CAR_INDEX: Record<string, number> = Object.fromEntries(
  CARS.map((car, i) => [car.id, i])
);

/** What the WebGL piece needs, and nothing more. */
const SPREAD_CARS = CARS.map((car) => ({
  id: car.id,
  label: car.model,
  km: car.km,
  year: car.year,
  sold: car.sold,
  priced: car.price !== null,
}));

const TOKENS: Record<string, string> = {
  brand: "AM Automotive",
  tagline: TAGLINE,
  host: HOST_BUSINESS,
  stated: String(POSTS_STATED),
  reachable: String(POSTS_REACHABLE),
  cars: String(CARS.length),
  kmMin: NUM.format(KM_MIN),
  kmMax: NUM.format(KM_MAX),
  yearMin: String(YEAR_MIN),
  yearMax: String(YEAR_MAX),
  yearSpan: String(YEAR_SPAN),
  priced: String(PRICED.length),
  sold: String(SOLD.length),
  followers: FOLLOWERS,
};

/* ------------------------------------------------------------------ bidi */

/** Latin/numeric runs of two characters or more, as they sit inside copy. */
const LATIN_RUN = /([A-Za-z0-9][A-Za-z0-9.,'’\-/ ]*[A-Za-z0-9])/g;

/**
 * Splits a string so every Latin/numeric run is isolated in `.latin`. A bare
 * digit run — 170,000, 2,850,000, 01100449583 — carries no strong direction of
 * its own and reorders itself between an Arabic word and a Latin unit; a model
 * name sitting beside Arabic guillemets does the same to the guillemets.
 */
function isolate(s: string, keyBase: string) {
  return s.split(LATIN_RUN).map((p, i) =>
    i % 2 === 1 ? (
      <span key={`${keyBase}-${i}`} className="latin">
        {p}
      </span>
    ) : (
      <span key={`${keyBase}-${i}`}>{p}</span>
    )
  );
}

/**
 * Substitutes {token}s, isolating every substituted value — and, under RTL,
 * every Latin run the sentence itself contains. Used for ALL rendered copy,
 * token-bearing or not, so one path serves both locales.
 */
function T({ s, v }: { s: string; v?: Record<string, string | number> }) {
  const { locale } = useLocale();
  const map: Record<string, string> = { ...TOKENS };
  if (v) for (const k of Object.keys(v)) map[k] = String(v[k]);
  return (
    <>
      {s.split(/(\{[a-zA-Z]+\})/g).map((p, i) => {
        const m = /^\{([a-zA-Z]+)\}$/.exec(p);
        if (m && map[m[1]] !== undefined) {
          return (
            <span key={i} className="latin">
              {map[m[1]]}
            </span>
          );
        }
        if (locale === "ar") return <span key={i}>{isolate(p, String(i))}</span>;
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

/** A Latin/numeric fragment sitting inside copy of either locale. */
function L({ children }: { children: ReactNode }) {
  return <span className="latin">{children}</span>;
}

/**
 * Their own Arabic address line is quoted verbatim in BOTH locales, so the
 * Latin runs embedded in it — "chillout auto service", "AM Automotive" — need
 * isolating even when the page around them is English.
 */
function Verbatim({ s }: { s: string }) {
  return <>{isolate(s, "v")}</>;
}

/* ---------------------------------------------------------- "the ledger" */

/**
 * The block is observed and gains `data-seen`; the attribute is written from
 * the effect rather than pushed through state, because an attribute is all the
 * CSS wants and the kit's lint rejects set-state-in-effect. `--led-i` is the
 * item's position within this block, counted here — deterministic, never
 * random, so server and client agree on the markup and the effect only adds
 * the index.
 *
 * A nested block owns its own items: the index is written only where the
 * nearest [data-ledger] ancestor is this element.
 *
 * Nothing animates clip-path on the observed element — clipping it collapses
 * the intersection rect and the reveal then silently never fires.
 */
function Ledger({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let i = 0;
    el.querySelectorAll<HTMLElement>("[data-ledger-item]").forEach((item) => {
      if (item.closest("[data-ledger]") !== el) return;
      item.style.setProperty("--led-i", String(i));
      i += 1;
    });
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-seen", "");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} id={id} data-ledger="" className={className}>
      {children}
    </div>
  );
}

/**
 * One ruled line of the ledger. Children must be ELEMENTS — the rule is a
 * pseudo-element on this node and the fade is applied to its element children,
 * so a bare text node would appear before its own rule had been drawn.
 */
function Line({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div data-ledger-item="" className={className}>
      {children}
    </div>
  );
}

/* ----------------------------------------------------------------- parts */

/**
 * Every frame carries its own definite box: the aspect ratio and object-cover
 * sit on the image itself, inside an overflow-hidden bed. An <img> stretched
 * with height:100% against an auto-height parent renders at 0×0 until it is
 * scrolled into view.
 */
function Shot({
  src,
  alt,
  ratio = "aspect-[4/3]",
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 33vw",
}: {
  src: string;
  alt: string;
  ratio?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={`overflow-hidden border border-ink/12 bg-panel ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={1400}
        height={1050}
        priority={priority}
        sizes={sizes}
        className={`${ratio} w-full object-cover`}
      />
    </div>
  );
}

function Head({ eyebrow, children }: { eyebrow?: string; children: ReactNode }) {
  return (
    <div>
      {eyebrow ? (
        <p className="fine mb-4 text-gold">
          <T s={eyebrow} />
        </p>
      ) : null}
      <h2 className="display text-[clamp(1.85rem,4.6vw,3.1rem)] text-ink">{children}</h2>
      <span className="rule-gold mt-5 block max-w-[14rem]" />
    </div>
  );
}

/** A figure over its label, the way the account states one. */
function Datum({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="fine text-gold">
        <T s={label} />
      </p>
      <p className="display mt-2.5 text-[clamp(1.15rem,2.4vw,1.7rem)] leading-tight text-ink">
        {children}
      </p>
    </div>
  );
}

/** Their shield, drawn as a mark rather than fetched as a logo. */
function Mark() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center bg-gold pb-1.5 text-[0.7rem] font-bold tracking-[0.04em] text-panel"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 66%, 50% 100%, 0 66%)" }}
    >
      AM
    </span>
  );
}

/* ---------------------------------------------------------------- header */

function Header() {
  const { content, locale, toggleLocale } = useLocale();
  const c = content as SiteContentExt;
  return (
    <header className="sticky top-0 z-40 border-b border-ink/15 bg-ground/92 backdrop-blur-md">
      <div className="mx-auto max-w-[80rem] px-5 sm:px-8">
        <div className="flex items-center gap-4 py-3">
          <a href="#top" className="flex items-center gap-3">
            <Mark />
            <span className="display text-[1.1rem] text-ink">
              <L>{c.brand.name}</L>
            </span>
          </a>
          <nav className="ms-auto hidden items-center gap-6 xl:flex">
            {c.nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="fine text-muted transition-colors hover:text-ink"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={toggleLocale}
            className="chip ms-auto border-gold text-ink transition-colors hover:bg-panel xl:ms-0"
            aria-label={c.a11y.toggleLanguage}
          >
            {locale === "ar" ? "EN" : "ع"}
          </button>
        </div>
        <nav className="-mx-5 flex gap-6 overflow-x-auto px-5 pb-2.5 xl:hidden">
          {c.nav.map((n) => (
            <a key={n.href} href={n.href} className="fine shrink-0 text-muted">
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ hero */

function EndCard({
  car,
  label,
  priority = false,
}: {
  car: Car;
  label: string;
  priority?: boolean;
}) {
  const c = useLocale().content as SiteContentExt;
  const alt = c.gallery.items[CAR_INDEX[car.id]]?.alt ?? car.model;
  return (
    <figure className="min-w-0">
      <Shot
        src={car.images[0]}
        alt={alt}
        ratio="aspect-[16/10]"
        priority={priority}
        sizes="(max-width: 1024px) 50vw, 26vw"
      />
      <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-ink/15 pt-2.5">
        <span className="fine text-gold">
          <T s={label} />
        </span>
        <span className="text-[0.85rem] text-ink">
          <L>
            {NUM.format(car.km)} {c.spread.kmUnit}
          </L>
        </span>
      </figcaption>
      <p className="mt-1.5 text-[0.78rem] text-muted">
        <L>
          {car.year} · {car.model}
        </L>
      </p>
    </figure>
  );
}

function Hero() {
  const c = useLocale().content as SiteContentExt;
  const lowest = BY_KM[0];
  const highest = BY_KM[BY_KM.length - 1];
  return (
    <section id="top" className="mx-auto max-w-[80rem] px-5 pt-12 pb-16 sm:px-8 sm:pt-16 sm:pb-24">
      <Ledger className="grid gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14">
        <div className="flex min-w-0 flex-col justify-center">
          <Line>
            <p className="fine text-gold">
              <T s={c.hero.eyebrow ?? ""} />
            </p>
          </Line>
          <Line className="mt-6">
            <h1 className="display text-[clamp(2.2rem,6.2vw,4.4rem)] text-ink">
              <T s={c.hero.headline} />
            </h1>
          </Line>
          <Line className="mt-6">
            {/* The bio, verbatim, sparkle included. */}
            <p className="text-[0.98rem] text-ink">
              «<L>{BIO}</L>»
            </p>
          </Line>
          <Line className="mt-6">
            <p className="max-w-[54ch] text-[0.97rem] leading-relaxed text-muted">
              <T s={c.hero.sub} />
            </p>
          </Line>
          <Line className="mt-8">
            <div className="flex flex-wrap gap-3">
              <a
                href="#roster"
                className="chip border-gold text-ink transition-colors hover:bg-panel"
              >
                {c.hero.primaryCta}
              </a>
              <a
                href="#contact"
                className="chip border-ink/45 text-ink transition-colors hover:bg-panel"
              >
                {c.hero.secondaryCta}
              </a>
            </div>
          </Line>
        </div>

        <div className="grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:gap-7">
          <Line>
            <EndCard car={lowest} label={c.spread.lowestLabel} priority />
          </Line>
          <Line>
            <EndCard car={highest} label={c.spread.highestLabel} />
          </Line>
        </div>
      </Ledger>

      <Ledger className="mt-14 grid gap-x-8 gap-y-6 sm:grid-cols-3">
        <Line>
          <Datum label={c.roster.heading}>
            <L>{CARS.length}</L>
          </Datum>
        </Line>
        <Line>
          <Datum label={c.spread.yearLabel}>
            <L>
              {YEAR_MIN}–{YEAR_MAX}
            </L>
          </Datum>
        </Line>
        <Line>
          <Datum label={c.spread.kmLabel}>
            <L>
              {NUM.format(KM_MIN)}–{NUM.format(KM_MAX)} {c.spread.kmUnit}
            </L>
          </Datum>
        </Line>
      </Ledger>
    </section>
  );
}

/* ----------------------------------------------------------------- about */

function About() {
  const c = useLocale().content as SiteContentExt;
  return (
    <section id="about" className="border-y border-ink/12 bg-ground-2">
      <div className="mx-auto max-w-[80rem] px-5 py-18 sm:px-8 sm:py-24">
        <Ledger className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Line>
            <Head>
              <T s={c.about.heading} />
            </Head>
          </Line>
          <div className="min-w-0">
            {c.about.body.map((p, i) => (
              <Line key={i} className={i === 0 ? undefined : "mt-6"}>
                <p className="max-w-[64ch] text-[0.95rem] leading-relaxed text-muted">
                  <T s={p} />
                </p>
              </Line>
            ))}
          </div>
        </Ledger>

        <Ledger className="mt-12 grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-4">
          {(c.about.stats ?? []).map((s, i) => (
            <Line key={i} className="min-w-0">
              <p className="display text-[clamp(1.7rem,4.4vw,2.7rem)] leading-none text-ink">
                <T s={s.value} />
              </p>
              <p className="mt-3 text-[0.78rem] leading-snug text-muted">
                <T s={s.label} />
              </p>
            </Line>
          ))}
        </Ledger>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- spread */

function SpreadSection() {
  const c = useLocale().content as SiteContentExt;
  const [selected, setSelected] = useState(BY_KM[0].id);
  const car = CARS.find((x) => x.id === selected) ?? CARS[0];
  const alt = c.gallery.items[CAR_INDEX[car.id]]?.alt ?? car.model;

  return (
    <section id="spread" className="border-y border-panel-2 bg-panel">
      <div className="mx-auto max-w-[80rem] px-5 py-18 sm:px-8 sm:py-24">
        <Ledger>
          <Line>
            <Head eyebrow={c.spread.kmLabel}>
              <T s={c.spread.heading} />
            </Head>
          </Line>
          <Line className="mt-8">
            <p className="max-w-[64ch] text-[0.97rem] leading-relaxed text-muted">
              <T s={c.spread.intro} />
            </p>
          </Line>
          <Line className="mt-10">
            <div className="min-w-0">
              <Spread
                cars={SPREAD_CARS}
                selected={selected}
                onSelect={setSelected}
                hint={c.spread.hint}
              />
            </div>
          </Line>

          <Line className="mt-10">
            <div className="grid gap-6 border border-ink/12 bg-panel-2 p-5 sm:grid-cols-[minmax(0,15rem)_1fr] sm:p-6">
              <div className="min-w-0">
                <Shot
                  src={car.images[0]}
                  alt={alt}
                  ratio="aspect-[4/3]"
                  className="border-ink/15"
                  sizes="(max-width: 640px) 100vw, 15rem"
                />
              </div>
              <div className="min-w-0">
                <p className="fine text-gold">
                  <L>{car.marque}</L>
                </p>
                <p className="display mt-2 text-[clamp(1.2rem,2.6vw,1.8rem)] text-ink">
                  <L>{car.model}</L>
                </p>
                <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-4">
                  <div>
                    <dt className="fine text-muted">
                      <T s={c.spread.yearLabel} />
                    </dt>
                    <dd className="mt-1.5 text-[0.95rem] text-ink">
                      <L>{car.year}</L>
                    </dd>
                  </div>
                  <div>
                    <dt className="fine text-muted">
                      <T s={c.spread.kmLabel} />
                    </dt>
                    <dd className="mt-1.5 text-[0.95rem] text-ink">
                      <L>
                        {NUM.format(car.km)} {c.spread.kmUnit}
                      </L>
                    </dd>
                  </div>
                  <div>
                    <dt className="fine text-muted">
                      <T s={c.roster.priceLabel} />
                    </dt>
                    <dd className="mt-1.5 text-[0.95rem] text-ink">
                      {car.price !== null ? (
                        <L>
                          {NUM.format(car.price)} {c.roster.priceUnit}
                        </L>
                      ) : (
                        <span className="text-muted">
                          <T s={c.roster.noPrice} />
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
                <div className="mt-5 flex flex-wrap gap-2">
                  {/* --sold red is reserved for the single bannered E200. */}
                  {car.sold ? <span className="sold-mark">{c.spread.soldLabel}</span> : null}
                  {car.price !== null ? (
                    <span className="chip border-gold text-gold">{c.spread.pricedLabel}</span>
                  ) : null}
                </div>
              </div>
            </div>
          </Line>

          <div className="mt-12 grid gap-x-10 gap-y-6 md:grid-cols-3">
            {c.spread.body.map((p, i) => (
              <Line key={i} className="min-w-0">
                <p className="text-[0.92rem] leading-relaxed text-muted">
                  <T s={p} />
                </p>
              </Line>
            ))}
          </div>

          <Line className="mt-10">
            <p className="max-w-[70ch] border-s-2 border-gold/60 ps-5 text-[0.85rem] leading-relaxed text-muted">
              <T s={c.spread.note} />
            </p>
          </Line>
        </Ledger>
      </div>
    </section>
  );
}

/* --------------------------------------------- inside another business */

function MapsCard({
  href,
  badge,
  resolvesLabel,
  resolves,
  arabic,
}: {
  href: string;
  badge: string;
  resolvesLabel: string;
  resolves: string;
  arabic: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border border-ink/15 bg-ground-2 p-5 transition-colors hover:border-gold"
    >
      <span className="fine block text-gold">{badge}</span>
      <span className="fine mt-4 block text-muted">{resolvesLabel}</span>
      {arabic ? (
        <span
          dir="rtl"
          lang="ar"
          className="font-ar mt-2 block text-[0.88rem] leading-relaxed text-ink"
        >
          <Verbatim s={resolves} />
        </span>
      ) : (
        <span className="mt-2 block text-[0.88rem] leading-relaxed text-ink">
          <L>{resolves}</L>
        </span>
      )}
      <span className="fine mt-4 block text-muted transition-colors group-hover:text-ink">
        maps.app.goo.gl
      </span>
    </a>
  );
}

function Inside() {
  const c = useLocale().content as SiteContentExt;
  return (
    <section id="inside" className="mx-auto max-w-[80rem] px-5 py-18 sm:px-8 sm:py-24">
      <Ledger className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div className="min-w-0">
          <Line>
            <Head eyebrow={c.inside.hostLabel}>
              <T s={c.inside.heading} />
            </Head>
          </Line>
          {c.inside.body.map((p, i) => (
            <Line key={i} className="mt-6">
              <p className="max-w-[60ch] text-[0.95rem] leading-relaxed text-muted">
                <T s={p} />
              </p>
            </Line>
          ))}
          <Line className="mt-8">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <span className="fine text-gold">
                <T s={c.inside.hostLabel} />
              </span>
              <span className="display text-[clamp(1.1rem,2.4vw,1.6rem)] text-ink">
                <L>{HOST_BUSINESS}</L>
              </span>
            </div>
          </Line>
        </div>

        <div className="min-w-0">
          <Line>
            <div className="border border-ink/15 bg-panel p-5 sm:p-7">
              <p className="fine text-gold">
                <T s={c.inside.verbatimLabel} />
              </p>
              {/* Their own Arabic line, quoted verbatim in BOTH locales — so it
                  is forced RTL even when the page around it is English. */}
              <p
                dir="rtl"
                lang="ar"
                className="font-ar-display mt-4 text-[clamp(1.15rem,2.8vw,1.55rem)] leading-[1.75] text-ink"
              >
                <Verbatim s={ADDRESS_AR} />
              </p>
              <p className="fine mt-7 text-muted">
                <T s={c.inside.glossLabel} />
              </p>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">
                <T s={c.inside.gloss} />
              </p>
            </div>
          </Line>

          <Line className="mt-8">
            <p className="fine text-gold">
              <T s={c.inside.addressLabel} />
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <MapsCard
                href={MAPS_LINKS[0].url}
                badge={c.inside.placeEntryLabel}
                resolvesLabel={c.inside.resolvesLabel}
                resolves={MAPS_LINKS[0].resolves}
                arabic={false}
              />
              <MapsCard
                href={MAPS_LINKS[1].url}
                badge={c.inside.textQueryLabel}
                resolvesLabel={c.inside.resolvesLabel}
                resolves={MAPS_LINKS[1].resolves}
                arabic
              />
            </div>
          </Line>

          <Line className="mt-8">
            <p className="max-w-[62ch] border-s-2 border-gold/60 ps-5 text-[0.88rem] leading-relaxed text-muted">
              <T s={c.inside.mapsNote} />
            </p>
          </Line>
        </div>
      </Ledger>
    </section>
  );
}

/* ---------------------------------------------------------------- roster */

function CarEntry({ car, n }: { car: Car; n: number }) {
  const c = useLocale().content as SiteContentExt;
  const item = c.gallery.items[CAR_INDEX[car.id]];
  const alt = item?.alt ?? car.model;
  const glossed = car.claims.filter((claim) => c.roster.claimGloss[claim]);

  return (
    <Ledger className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
      <div className="min-w-0">
        <Line>
          <Shot
            src={car.images[0]}
            alt={alt}
            ratio="aspect-[4/3]"
            sizes="(max-width: 1024px) 100vw, 44vw"
          />
        </Line>
        <Line className="mt-3">
          <div className="grid grid-cols-3 gap-3">
            {car.images.slice(1, 4).map((src, i) => (
              <Shot
                key={src}
                src={src}
                alt={`${alt} (${i + 2})`}
                ratio="aspect-square"
                sizes="(max-width: 1024px) 30vw, 14vw"
              />
            ))}
          </div>
        </Line>
        {item?.caption ? (
          <Line className="mt-3">
            <p className="text-[0.82rem] leading-relaxed text-muted">
              <T s={item.caption} />
            </p>
          </Line>
        ) : null}
      </div>

      <div className="min-w-0">
        <Line>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span className="display text-[1.05rem] tabular-nums text-gold">
              <L>{String(n).padStart(2, "0")}</L>
            </span>
            <span className="fine text-muted">
              <L>{car.marque}</L>
            </span>
            {/* The one car they bannered themselves — the only red on the page. */}
            {car.sold ? <span className="sold-mark ms-auto">{c.roster.soldBadge}</span> : null}
          </div>
          <h3 className="display mt-3 text-[clamp(1.45rem,3.1vw,2.2rem)] text-ink">
            <L>{car.model}</L>
          </h3>
        </Line>

        <Line className="mt-6">
          <p className="max-w-[56ch] text-[0.92rem] leading-relaxed text-muted">
            <T s={c.roster.carNotes[car.id] ?? ""} />
          </p>
        </Line>

        <Line className="mt-6">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
            <div>
              <dt className="fine text-muted">
                <T s={c.roster.yearLabel} />
              </dt>
              <dd className="mt-1.5 text-[0.95rem] text-ink">
                <L>{car.year}</L>
              </dd>
            </div>
            <div>
              <dt className="fine text-muted">
                <T s={c.roster.kmLabel} />
              </dt>
              <dd className="mt-1.5 text-[0.95rem] text-ink">
                <L>
                  {NUM.format(car.km)} {c.roster.kmUnit}
                </L>
              </dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="fine text-muted">
                <T s={c.roster.priceLabel} />
              </dt>
              <dd className="mt-1.5 text-[0.95rem] text-ink">
                {car.price !== null ? (
                  <L>
                    {NUM.format(car.price)} {c.roster.priceUnit}
                  </L>
                ) : (
                  <span className="text-muted">
                    <T s={c.roster.noPrice} />
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </Line>

        {car.claims.length ? (
          <Line className="mt-6">
            <p className="fine text-gold">
              <T s={c.roster.claimsLabel} />
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {car.claims.map((claim) => (
                <span key={claim} className="chip text-ink">
                  <L>{claim}</L>
                </span>
              ))}
            </div>
            {glossed.length ? (
              <ul className="mt-4 space-y-2">
                {glossed.map((claim) => (
                  <li key={claim} className="text-[0.8rem] leading-relaxed text-muted">
                    <L>{claim}</L>
                    {" — "}
                    <T s={c.roster.claimGloss[claim]} />
                  </li>
                ))}
              </ul>
            ) : null}
          </Line>
        ) : null}

        {car.specs && car.specs.length ? (
          <Line className="mt-6">
            <p className="fine text-gold">
              <T s={c.roster.specsLabel} />
            </p>
            <dl className="mt-3 grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] gap-x-5">
              {car.specs.map((s) => (
                <div key={s.label} className="contents">
                  <dt className="border-t border-ink/12 py-2 text-[0.74rem] leading-snug text-muted">
                    <L>{s.label}</L>
                  </dt>
                  <dd className="border-t border-ink/12 py-2 text-[0.82rem] leading-snug text-ink">
                    <L>{s.value}</L>
                  </dd>
                </div>
              ))}
            </dl>
          </Line>
        ) : null}
      </div>
    </Ledger>
  );
}

function Roster() {
  const c = useLocale().content as SiteContentExt;
  return (
    <section id="roster" className="border-y border-ink/12 bg-ground-2">
      <div className="mx-auto max-w-[80rem] px-5 py-18 sm:px-8 sm:py-24">
        <Ledger>
          <Line>
            <Head eyebrow={c.roster.kmLabel}>
              <T s={c.roster.heading} />
            </Head>
          </Line>
          <Line className="mt-8">
            <p className="max-w-[64ch] text-[0.97rem] leading-relaxed text-muted">
              <T s={c.roster.intro} />
            </p>
          </Line>
        </Ledger>

        <div className="mt-16 flex flex-col gap-20 sm:gap-24">
          {BY_KM.map((car, i) => (
            <CarEntry key={car.id} car={car} n={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- vocabulary */

function Vocabulary() {
  const c = useLocale().content as SiteContentExt;
  return (
    <section id="vocabulary" className="mx-auto max-w-[80rem] px-5 py-18 sm:px-8 sm:py-24">
      <Ledger>
        <Line>
          <Head eyebrow={c.roster.glossLabel}>
            <T s={c.services.heading} />
          </Head>
        </Line>
        <Line className="mt-8">
          <p className="max-w-[64ch] text-[0.97rem] leading-relaxed text-muted">
            <T s={c.services.intro ?? ""} />
          </p>
        </Line>
        <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {c.services.items.map((it, i) => (
            <Line key={i} className="min-w-0">
              <h3 className="text-[0.95rem] text-ink">
                <T s={it.title} />
              </h3>
              <p className="mt-3 text-[0.88rem] leading-relaxed text-muted">
                <T s={it.body} />
              </p>
            </Line>
          ))}
        </div>
      </Ledger>
    </section>
  );
}

/* ------------------------------------------------------------ registers */

const TECHNICAL_ID = "bmw320i";
const PARTIAL_ID = "rogue";

function SpecCard({
  model,
  badge,
  badgeClass,
  specs,
  className = "",
}: {
  model: string;
  badge: string;
  badgeClass: string;
  specs: { label: string; value: string }[];
  className?: string;
}) {
  return (
    <div className={`border border-ink/15 p-5 sm:p-7 ${className}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <span className={`chip ${badgeClass}`}>{badge}</span>
        <span className="display text-[1.15rem] text-ink">
          <L>{model}</L>
        </span>
      </div>
      <dl className="mt-6 grid grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] gap-x-5">
        {specs.map((s) => (
          <div key={s.label} className="contents">
            <dt className="border-t border-ink/12 py-2.5 text-[0.74rem] leading-snug text-muted">
              <L>{s.label}</L>
            </dt>
            <dd className="border-t border-ink/12 py-2.5 text-[0.84rem] leading-snug text-ink">
              <L>{s.value}</L>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Registers() {
  const c = useLocale().content as SiteContentExt;
  const technical = CARS.find((x) => x.id === TECHNICAL_ID);
  const partial = CARS.find((x) => x.id === PARTIAL_ID);
  const terse = BY_KM.filter((x) => x.id !== TECHNICAL_ID && x.id !== PARTIAL_ID);

  return (
    <section id="registers" className="border-y border-panel-2 bg-panel">
      <div className="mx-auto max-w-[80rem] px-5 py-18 sm:px-8 sm:py-24">
        <Ledger>
          <Line>
            <Head eyebrow={c.registers.technicalLabel}>
              <T s={c.registers.heading} />
            </Head>
          </Line>
          <Line className="mt-8">
            <p className="max-w-[64ch] text-[0.97rem] leading-relaxed text-muted">
              <T s={c.registers.intro} />
            </p>
          </Line>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <Line className="min-w-0">
              {technical ? (
                <SpecCard
                  model={technical.model}
                  badge={c.registers.technicalLabel}
                  badgeClass="border-gold text-gold"
                  specs={technical.specs ?? []}
                  className="bg-panel-2"
                />
              ) : null}
              {partial ? (
                <SpecCard
                  model={partial.model}
                  badge={c.registers.partialLabel}
                  badgeClass="text-muted"
                  specs={partial.specs ?? []}
                  className="mt-6"
                />
              ) : null}
            </Line>

            <Line className="min-w-0">
              <p className="fine text-gold">
                <T s={c.registers.terseLabel} />
              </p>
              <ul className="mt-4 space-y-4">
                {terse.map((car) => (
                  <li key={car.id} className="border-t border-ink/12 pt-3">
                    <p className="text-[0.88rem] text-ink">
                      <L>{car.model}</L>
                    </p>
                    <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted">
                      <L>
                        {car.year} · {NUM.format(car.km)} {c.roster.kmUnit}
                      </L>
                    </p>
                    {car.claims.length ? (
                      <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted">
                        {car.claims.map((claim, i) => (
                          <span key={claim}>
                            {i > 0 ? " · " : ""}
                            <L>{claim}</L>
                          </span>
                        ))}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </Line>
          </div>

          <div className="mt-12 grid gap-x-10 gap-y-6 md:grid-cols-3">
            {c.registers.body.map((p, i) => (
              <Line key={i} className="min-w-0">
                <p className="text-[0.92rem] leading-relaxed text-muted">
                  <T s={p} />
                </p>
              </Line>
            ))}
          </div>

          <Line className="mt-10">
            <p className="max-w-[70ch] border-s-2 border-gold/60 ps-5 text-[0.85rem] leading-relaxed text-muted">
              <T s={c.registers.note} />
            </p>
          </Line>
        </Ledger>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- labels */

function Labels() {
  const c = useLocale().content as SiteContentExt;
  return (
    <section id="labels" className="mx-auto max-w-[80rem] px-5 py-18 sm:px-8 sm:py-24">
      <Ledger>
        <Line>
          <Head eyebrow={c.labels.highlightsLabel}>
            <T s={c.labels.heading} />
          </Head>
        </Line>
        <Line className="mt-8">
          <p className="max-w-[64ch] text-[0.97rem] leading-relaxed text-muted">
            <T s={c.labels.intro} />
          </p>
        </Line>

        <Line className="mt-12">
          <p className="fine text-gold">
            <T s={c.labels.highlightsLabel} />
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {HIGHLIGHTS.map((h) => (
              <span key={h} className="chip text-ink">
                <L>{h}</L>
              </span>
            ))}
          </div>
        </Line>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <Line className="min-w-0">
            <p className="fine text-gold">
              <T s={c.labels.bannerLabel} />
            </p>
            <ul className="mt-4">
              {BANNER_MARQUES.map((m) => (
                <li key={m} className="border-t border-ink/15 py-2.5 text-[0.9rem] text-ink">
                  <L>{m}</L>
                </li>
              ))}
            </ul>
          </Line>
          <Line className="min-w-0">
            <p className="fine text-gold">
              <T s={c.labels.floorLabel} />
            </p>
            <ul className="mt-4">
              {FLOOR_MARQUES.map((m) => (
                <li
                  key={m}
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-ink/15 py-2.5 text-[0.9rem] text-ink"
                >
                  <L>{m}</L>
                  {NOT_ON_BANNER.includes(m) ? (
                    <span className="fine text-gold">
                      <T s={c.labels.notOnBannerLabel} />
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </Line>
        </div>

        <div className="mt-12 grid gap-x-10 gap-y-6 md:grid-cols-3">
          {c.labels.body.map((p, i) => (
            <Line key={i} className="min-w-0">
              <p className="text-[0.92rem] leading-relaxed text-muted">
                <T s={p} />
              </p>
            </Line>
          ))}
        </div>

        <Line className="mt-10">
          <p className="max-w-[70ch] border-s-2 border-gold/60 ps-5 text-[0.85rem] leading-relaxed text-muted">
            <T s={c.labels.note} />
          </p>
        </Line>
      </Ledger>
    </section>
  );
}

/* --------------------------------------------------------------- counts */

function Counts() {
  const c = useLocale().content as SiteContentExt;
  return (
    <section id="counts" className="border-y border-ink/12 bg-ground-2">
      <div className="mx-auto max-w-[80rem] px-5 py-16 sm:px-8 sm:py-20">
        <Ledger>
          <Line>
            <Head>
              <T s={c.counts.heading} />
            </Head>
          </Line>
          <Line className="mt-8">
            <p className="max-w-[60ch] text-[0.95rem] leading-relaxed text-muted">
              <T s={c.counts.intro} />
            </p>
          </Line>
          <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
            {c.counts.items.map((it, i) => (
              <Line key={i} className="min-w-0">
                <p className="display text-[clamp(1.5rem,3.6vw,2.4rem)] leading-none text-ink">
                  <T s={it.value} />
                </p>
                <p className="mt-3 text-[0.76rem] leading-snug text-muted">
                  <T s={it.label} />
                </p>
              </Line>
            ))}
          </div>
        </Ledger>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- contact */

function Contact() {
  const { locale, content } = useLocale();
  const c = content as SiteContentExt;
  return (
    <section id="contact" className="mx-auto max-w-[80rem] px-5 py-18 sm:px-8 sm:py-24">
      <Ledger className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="min-w-0">
          <Line>
            <Head>
              <T s={c.contact.heading} />
            </Head>
          </Line>
          <Line className="mt-6">
            <p className="max-w-[52ch] text-[0.93rem] leading-relaxed text-muted">
              <T s={c.contact.intro ?? ""} />
            </p>
          </Line>
        </div>

        <div className="min-w-0">
          <Line>
            <p className="fine text-gold">
              <T s={c.contact.addressLabel} />
            </p>
            <p className="mt-3 max-w-[48ch] text-[0.95rem] leading-relaxed text-ink">
              {locale === "ar" ? <Verbatim s={c.contact.address} /> : c.contact.address}
            </p>
          </Line>

          <Line className="mt-8">
            <p className="fine text-gold">
              <T s={c.contact.phoneLabel} />
            </p>
            <div className="mt-3 flex flex-col">
              {PHONES.map((p) => (
                <a
                  key={p}
                  href={`tel:+2${p}`}
                  className="border-b border-ink/15 py-2.5 text-ink transition-colors hover:text-gold"
                >
                  <span className="latin text-[0.95rem] tracking-[0.06em]">{p}</span>
                </a>
              ))}
            </div>
          </Line>

          <Line className="mt-8">
            <p className="fine text-gold">
              <T s={c.contact.hoursLabel ?? ""} />
            </p>
            <p className="mt-3 text-[0.9rem] text-muted">
              <T s={c.contact.hours ?? ""} />
            </p>
          </Line>

          <Line className="mt-8">
            <div className="flex flex-wrap gap-3">
              <a
                href={c.contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="chip border-gold text-ink transition-colors hover:bg-panel"
              >
                {c.contact.cta}
              </a>
              {c.contact.instagramUrl ? (
                <a
                  href={c.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chip border-ink/45 text-ink transition-colors hover:bg-panel"
                >
                  <L>Instagram</L>
                </a>
              ) : null}
              {c.contact.facebookUrl ? (
                <a
                  href={c.contact.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chip border-ink/45 text-ink transition-colors hover:bg-panel"
                >
                  <L>Facebook</L>
                </a>
              ) : null}
            </div>
          </Line>

          <Line className="mt-8">
            <p className="max-w-[62ch] text-[0.8rem] leading-relaxed text-muted">
              <T s={c.spread.note} />
            </p>
          </Line>
        </div>
      </Ledger>
    </section>
  );
}

/* --------------------------------------------------------------- footer */

function Footer() {
  const c = useLocale().content as SiteContentExt;
  return (
    <footer className="border-t border-panel-2 bg-panel">
      <div className="mx-auto max-w-[80rem] px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <Mark />
              <p className="display text-[1.2rem] text-ink">
                <L>{c.brand.name}</L>
              </p>
            </div>
            <p className="mt-3 text-[0.85rem] text-muted">
              «<L>{BIO}</L>»
            </p>
          </div>

          {/* Bilingual, because the disclaimer has to hold in both languages. */}
          <div className="min-w-0 max-w-[56ch]">
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink/12 pt-6 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="text-[0.72rem] text-muted">
            <T s={c.footer.rights} />
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="fine text-muted transition-colors hover:text-ink"
            >
              Instagram
            </a>
            <a
              href={FB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="fine text-muted transition-colors hover:text-ink"
            >
              Facebook
            </a>
          </div>
        </div>

        {/* The arrival's two escapes, said out loud rather than left implicit. */}
        <noscript>
          <p className="mt-8 text-[0.72rem] leading-relaxed text-muted">{c.ledger.noscript}</p>
        </noscript>
        <p className="mt-8 hidden text-[0.72rem] leading-relaxed text-muted motion-reduce:block">
          <T s={c.ledger.reducedMotion} />
        </p>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ page */

function Body() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <SpreadSection />
        <Inside />
        <Roster />
        <Vocabulary />
        <Registers />
        <Labels />
        <Counts />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export function Page() {
  return (
    <LocaleProvider dictionaries={{ en, ar }} defaultLocale="en">
      <Body />
    </LocaleProvider>
  );
}

export default Page;
