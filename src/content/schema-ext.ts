import type { SiteContent } from "@/i18n/schema";

/**
 * AM Automotive — the page-specific copy layer.
 *
 * `en.ts` and `ar.ts` fill this shape identically, key for key. No editorial
 * string exists in one file and not the other; neither file is a shorter
 * version of the other.
 *
 * Nothing here restates a figure `media.ts` already holds. Where a number
 * belongs inside a sentence, the sentence carries a `{token}` and the section
 * substitutes it — and in Arabic that substitution MUST be rendered inside
 * `<span className="latin">…</span>`, because a bare Latin digit run sitting
 * between an Arabic word and a Latin unit reorders itself under RTL. There is
 * never a literal digit run inside an Arabic sentence in `ar.ts`.
 *
 * Never store a function in this object: it crosses the server → client
 * boundary.
 *
 * TOKENS (identical in both locales, so one substitution path serves both):
 *   {brand}      brand.name                 "AM Automotive"
 *   {tagline}    TAGLINE                    the bio's one line
 *   {host}       HOST_BUSINESS              the business the showroom sits inside
 *   {stated}     POSTS_STATED               posts the profile claims
 *   {reachable}  POSTS_REACHABLE            posts that open to a logged-out visitor
 *   {cars}       CARS.length                cars those posts resolve to
 *   {kmMin}      KM_MIN                     lowest published odometer
 *   {kmMax}      KM_MAX                     highest published odometer
 *   {yearMin}    YEAR_MIN                   oldest model year on the floor
 *   {yearMax}    YEAR_MAX                   newest model year on the floor
 *   {yearSpan}   YEAR_SPAN                  years between the two
 *   {priced}     PRICED.length              listings that carry a price
 *   {sold}       SOLD.length                listings marked sold
 *   {followers}  FOLLOWERS                  follower count
 *   {n}          a local count supplied by the row being rendered
 *
 * The dealership's own vocabulary — "Factory Paint", "Maintenance at the
 * Agent", "Mint condition", "All service done", "New profile", "Only one in
 * Egypt", "License 2 years" — is quoted verbatim in BOTH locales, uncorrected,
 * including where the same phrase is capitalised two different ways across two
 * captions. A gloss is set beside a quoted term, never in place of it. Marque
 * and model names stay Latin in Arabic. Their Arabic address line is quoted
 * verbatim in both files, with a gloss beside it.
 */

/** Multi-paragraph body copy. One string per paragraph, in order. */
export type Paragraphs = string[];

/**
 * The spine. Nine listings, {yearMin} to {yearMax}, {kmMin} km to {kmMax} km.
 * There is no type of car here — the spread itself is the identity.
 */
export type SpreadCopy = {
  heading: string;
  /** Uses {cars}, {kmMin}, {kmMax}. */
  intro: string;
  /** Uses {cars}, {yearMin}, {yearMax}, {yearSpan}, {kmMin}, {kmMax}, {priced}, {sold}, {brand}. */
  body: Paragraphs;
  /** Sits above a published odometer. */
  kmLabel: string;
  /** Distance unit, printed after a Latin digit run. */
  kmUnit: string;
  /** Sits above a model year. */
  yearLabel: string;
  /** Pointer affordance on the spread rail. */
  hint: string;
  /** Marks the one listing the dealership banners as sold. */
  /** Sits on the card for the lowest published odometer on the floor. */
  lowestLabel: string;
  /** Sits on the card for the highest. */
  highestLabel: string;
  soldLabel: string;
  /** Marks the one listing that carries an asking price. */
  pricedLabel: string;
  /** The standing caveat: every figure is quoted from a caption. */
  note: string;
};

/**
 * The showroom is inside another business — their own address line says so,
 * and Google's place entry agrees. Two Maps links appear across their posts
 * and both resolve to the same address: one registered place entry, one plain
 * text search of the same words. Never two locations.
 */
export type InsideCopy = {
  heading: string;
  /** Uses {host}, {brand}. */
  body: Paragraphs;
  addressLabel: string;
  /** Names the business the showroom sits inside. */
  hostLabel: string;
  /** Heads the address line quoted in their own Arabic, in both locales. */
  verbatimLabel: string;
  /** ADDRESS_AR, quoted verbatim. Identical in both files. */
  addressVerbatim: string;
  /** Heads the plain-language rendering of that line. */
  glossLabel: string;
  /** What the quoted line says, in the reader's own language. */
  gloss: string;
  /** Badge on the registered Google place entry. */
  placeEntryLabel: string;
  /** Badge on the plain text search. */
  textQueryLabel: string;
  /** Heads what a link resolves to. */
  resolvesLabel: string;
  /** One address, two links. Says exactly that, and not more. Uses {host}. */
  mapsNote: string;
};

/** The {cars} listings, each in the words of its own caption. */
export type RosterCopy = {
  heading: string;
  /** Uses {cars}, {reachable}, {stated}. */
  intro: string;
  kmLabel: string;
  /** Distance unit, printed after a Latin digit run. */
  kmUnit: string;
  yearLabel: string;
  /** Heads the caption's own short claims. */
  claimsLabel: string;
  /** Heads the spec rows, on the two listings that print them. */
  specsLabel: string;
  priceLabel: string;
  /** Currency, printed after a Latin digit run. */
  priceUnit: string;
  /** Stands in where a caption publishes no price — which is all but one. */
  noPrice: string;
  /** The dealership's own sold banner, rendered as a badge. */
  soldBadge: string;
  /** Heads the plain-language rendering of a trade phrase. */
  glossLabel: string;
  /**
   * Keyed by the claim string exactly as `media.ts` holds it, capitals and
   * all — including the two spellings of the same phrase across two captions.
   * Each value explains the trade term honestly and briefly.
   */
  claimGloss: Record<string, string>;
  /** Keyed by Car.id: s500, e200, cla180, x5, x6, bmw320i, c200, rogue, kodiaq. */
  carNotes: Record<string, string>;
};

/**
 * One listing (the BMW 320i) is written in a technical register — Engine,
 * Displacement, Power, Torque, Transmission, Drivetrain — where every other
 * caption is four or five terse lines. The Nissan Rogue partly follows it.
 */
export type RegistersCopy = {
  heading: string;
  /** Uses {cars}. */
  intro: string;
  /** Uses {cars}, {brand}. */
  body: Paragraphs;
  /** Badge on the four-or-five-line captions. */
  terseLabel: string;
  /** Badge on the spec-sheet caption. */
  technicalLabel: string;
  /** Badge on the caption that half follows it. */
  partialLabel: string;
  /** What is and is not being claimed about the difference. */
  note: string;
};

/**
 * Two label sets that do not match each other: story highlights that name
 * individual cars rather than categories, and a shopfront banner carrying five
 * marque badges. The floor also holds marques the banner does not. Stated as
 * an observation, with its caveat carried in the copy itself.
 */
export type LabelsCopy = {
  heading: string;
  /** Uses {brand}. */
  intro: string;
  /** Uses {stated}, {reachable}, {cars}. */
  body: Paragraphs;
  highlightsLabel: string;
  bannerLabel: string;
  floorLabel: string;
  /** Heads the marques on the floor that the banner does not carry. */
  notOnBannerLabel: string;
  /** The caveat: the unreachable posts mean this proves nothing. Uses {stated}, {reachable}. */
  note: string;
};

export type CountsCopy = {
  heading: string;
  intro: string;
  /** `value` is a token string resolved from media.ts; `label` is the prose. */
  items: { value: string; label: string }[];
};

/** Copy for "the ledger" — the rule-then-entry arrival used across the page. */
export type LedgerCopy = {
  /** Shown inside <noscript>. */
  noscript: string;
  /** Shown where prefers-reduced-motion is set. */
  reducedMotion: string;
};

export type SiteContentExt = SiteContent & {
  spread: SpreadCopy;
  inside: InsideCopy;
  roster: RosterCopy;
  registers: RegistersCopy;
  labels: LabelsCopy;
  counts: CountsCopy;
  ledger: LedgerCopy;
};
