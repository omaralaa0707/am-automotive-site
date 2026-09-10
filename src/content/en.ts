import type { SiteContentExt } from "./schema-ext";
import { ADDRESS_AR, ADDRESS_EN, CARS, FB_URL, IG_URL, MAPS_LINKS, PHONES } from "./media";

/**
 * AM Automotive — English copy. `ar.ts` fills the same shape key for key.
 *
 * Every number arrives as a {token}; nothing here restates a figure media.ts
 * already holds. The dealership's own trade phrases are quoted as they wrote
 * them, capitals and all, and their Arabic address line stays Arabic here with
 * a gloss set beside it, never in place of it.
 */

const ALT: Record<string, string> = {
  s500: "A Mercedes-Benz S500 with an AMG kit, the oldest car on the reachable floor.",
  e200: "A Mercedes-Benz E200 Avantgarde, the one listing the dealership banners as sold.",
  cla180: "A Mercedes-Benz CLA 180 Urban, carrying the highest odometer published here.",
  x5: "A BMW X5 photographed on the showroom floor in Heliopolis.",
  x6: "A BMW X6 M Sport, its caption stating two years of licence remaining.",
  bmw320i: "A BMW 320i, the one car listed with a full spec sheet rather than a short caption.",
  c200: "A Mercedes-Benz C200 with an AMG kit and a panoramic sunroof.",
  rogue: "A Nissan Rogue S, a marque that does not appear on the shopfront banner.",
  kodiaq: "A Skoda Kodiaq Sport Line, the only listing here that carries an asking price.",
};

const CAPTION: Record<string, string> = {
  s500: "The oldest year and one of the highest readings on the floor.",
  e200: "Marked sold by the dealership themselves, in their own banner.",
  cla180: "The highest odometer published anywhere in the account.",
  x5: "\"New profile\" — the caption's own words for a fresh set of tyres.",
  x6: "The only caption that states how much licence is left on the car.",
  bmw320i: "Engine, displacement, power, torque, transmission, drivetrain. Nothing else here reads like this.",
  c200: "Four claims in four lines, which is the house style.",
  rogue: "\"Only one in Egypt\", as the caption puts it.",
  kodiaq: "The one car with a number beside it.",
};

export const en: SiteContentExt = {
  locale: "en",
  dir: "ltr",
  brand: {
    name: "AM Automotive",
    shortName: "AM",
    tagline: "{tagline}",
  },
  nav: [
    { label: "The spread", href: "#spread" },
    { label: "Inside another business", href: "#inside" },
    { label: "The floor", href: "#roster" },
    { label: "Two registers", href: "#registers" },
    { label: "Badges and labels", href: "#labels" },
    { label: "Contact", href: "#contact" },
  ],
  hero: {
    eyebrow: "{brand} — Heliopolis, Cairo",
    headline: "No type of car. That is the type of car.",
    sub: "{cars} listings open to a visitor who is not logged in. They run from {yearMin} to {yearMax} — {yearSpan} model years — and from {kmMin} km to {kmMax} km. Every one of them states its odometer. Exactly {priced} states a price. Exactly {sold} is marked sold. Read off the {reachable} posts that open, out of {stated} the profile states.",
    primaryCta: "See the floor",
    secondaryCta: "Call the showroom",
  },
  about: {
    heading: "The account as it stands",
    body: [
      "{brand} sells out of a showroom in Heliopolis, and the bio carries one line — «{tagline}» — three phone numbers and a map link. That line is the whole stated remit: used cars and new ones, premium, without narrowing further.",
      "The reachable floor keeps that promise literally. A {yearMin} saloon on {kmMax} km stands in the same account as a {yearMax} SUV on {kmMin} km, and nothing in the captions treats the distance between them as unusual. Most dealers in a series like this one settle into a lane. This one does not have a lane.",
      "The profile states {stated} posts. {reachable} of them open to a visitor who is not logged in, and {followers} accounts follow it. Everything on this page is read off those posts and stops there; what the other posts hold is neither known here nor guessed at.",
    ],
    stats: [
      { value: "{cars}", label: "listings reachable" },
      { value: "{yearSpan}", label: "model years apart" },
      { value: "{priced}", label: "price published" },
      { value: "{sold}", label: "marked sold" },
    ],
  },
  services: {
    heading: "What the captions themselves state",
    intro:
      "No service list is published anywhere in the account. What follows is nothing more than the vocabulary the captions actually use, in their own words.",
    items: [
      {
        title: "\"Factory Paint\"",
        body: "Fabrica — the original factory paintwork, never resprayed. It is the single most repeated claim in the account, and one caption spells it \"Factory paint\" instead. Both spellings are kept as written.",
      },
      {
        title: "\"Maintenance at the Agent\"",
        body: "Serviced by the marque's authorised agent in Egypt rather than an independent workshop. No service book or date is published beside it.",
      },
      {
        title: "\"All service done\" / \"Full service done\"",
        body: "The scheduled servicing is up to date as of the post. Which services, and when, is not stated — so nothing further is said about it here.",
      },
      {
        title: "\"New profile\" and \"New tires\"",
        body: "Their term for a fresh set of tyres. \"Profile\" is the trade word for the tyre itself, carried over from Arabic usage.",
      },
      {
        title: "\"Mint condition\" / \"Perfect condition\"",
        body: "The dealership's own summary of the car's state. It is an opinion published as a claim, and this page prints it as a quotation, not a finding.",
      },
      {
        title: "\"License 2 years\"",
        body: "Two years of valid Egyptian licence remaining on the car, so the buyer does not renew immediately. Only one caption states it.",
      },
    ],
  },
  gallery: {
    heading: "The floor, one frame each",
    intro:
      "Every frame is theirs. One frame per listing is shown here; the posts themselves run longer. The spread you are looking at is the point — nothing was ordered to make it look tidier than it is.",
    items: CARS.map((car) => ({
      src: car.images[0],
      alt: ALT[car.id],
      caption: CAPTION[car.id],
      kind: "image" as const,
    })),
  },
  contact: {
    heading: "Contact",
    intro:
      "One showroom in Heliopolis, sitting inside another business. The address is printed exactly as they publish it, in their own Arabic, with a gloss beside it.",
    addressLabel: "Address",
    address: ADDRESS_EN,
    phoneLabel: "Numbers",
    phones: PHONES,
    hoursLabel: "Opening hours",
    hours: "Not published anywhere in the account.",
    mapsUrl: MAPS_LINKS[0].url,
    instagramUrl: IG_URL,
    facebookUrl: FB_URL,
    cta: "Call the showroom",
  },
  footer: {
    disclaimer:
      "This is an unofficial concept design, built as a portfolio exercise. It is not affiliated with, endorsed by, or operated by {brand}. All photography and every quoted line remain the dealership's own.",
    rights: "Concept design. Photography and text: {brand}.",
  },
  a11y: {
    toggleLanguage: "Switch to Arabic",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },

  spread: {
    heading: "From {kmMin} to {kmMax}",
    intro:
      "The {cars} reachable listings run from {kmMin} km to {kmMax} km, and from the {yearMin} model year to the {yearMax}. Every single one of them publishes its odometer.",
    body: [
      "That last part is worth stopping on. Across this whole series of dealership accounts, a missing reading is the norm — a caption gives the year, the trim, the claims, and leaves the kilometres out. Here, not one listing does. {cars} out of {cars} state a figure, including the {yearMin} car, which had the most to gain from silence.",
      "The range those figures describe is {yearSpan} model years wide and runs across {kmMax} kilometres of published use. A car that has done more than its owner planned sits in the same grid as one barely run in. {brand} does not sort them, does not stream them into \"classics\" and \"new arrivals\", and does not apologise for either end.",
      "Against all of that, exactly {priced} listing carries an asking price and exactly {sold} is marked sold. So the account tells you precisely how far each car has gone and almost never what it costs — the odometer is the disclosure, and the price is the conversation.",
    ],
    kmLabel: "Odometer, as published",
    kmUnit: "km",
    yearLabel: "Model year",
    hint: "Follow the rail from the oldest reading to the newest.",
    lowestLabel: "Lowest published odometer",
    highestLabel: "Highest published odometer",
    soldLabel: "Sold",
    pricedLabel: "Price published",
    note: "Every kilometre figure, year and price on this page is quoted from the dealership's own caption. Nothing is inspected, verified or estimated here.",
  },

  inside: {
    heading: "A showroom inside another business",
    body: [
      "{brand} does not have its own street frontage. Their address line puts the showroom inside {host} — a working car-service centre opposite the Military Academy in Heliopolis, at Gate 7. Google's own place entry says the same thing, in the same words.",
      "Nothing else in this series is housed like that. Every other dealer here has a unit, a strip, a floor of its own. This one is a showroom set within a business that does something else for a living, and their address line states it plainly rather than working around it.",
      "It changes how you read the account, too. The cars are photographed where they stand, in a place built for servicing rather than for display, and the captions lean on what the car has had done to it rather than on the room it is standing in.",
    ],
    addressLabel: "Address",
    hostLabel: "Inside",
    verbatimLabel: "As they write it",
    addressVerbatim: ADDRESS_AR,
    glossLabel: "In English",
    gloss:
      "Heliopolis, opposite the Military Academy, Gate 7, inside {host} — the {brand} showroom.",
    placeEntryLabel: "Registered place entry",
    textQueryLabel: "Plain text search",
    resolvesLabel: "Resolves to",
    mapsNote:
      "Two different Maps links appear across their posts. They resolve to the same address: one is a registered Google place entry for the showroom inside {host}, the other is a plain text search of the same words. Two ways of pointing at one place — not two places.",
  },

  roster: {
    heading: "The floor",
    intro:
      "All {cars} listings that a logged-out visitor can reach, each in the words of its own caption. {reachable} posts opened out of {stated}; what the rest hold is not known here.",
    kmLabel: "Odometer",
    kmUnit: "km",
    yearLabel: "Year",
    claimsLabel: "As the caption states it",
    specsLabel: "Spec rows, as printed",
    priceLabel: "Asking price",
    priceUnit: "EGP",
    noPrice: "No price published",
    soldBadge: "Sold",
    glossLabel: "What that means",
    claimGloss: {
      "Amg kit": "AMG bodywork and trim fitted to a standard Mercedes — a styling package, not an AMG engine.",
      "Amg Kit": "The same AMG styling package. The account capitalises the phrase two different ways across two captions; both are kept as written.",
      "Factory Paint": "Fabrica — the original factory paintwork, with no panel resprayed.",
      "Factory paint": "The same claim as \"Factory Paint\", spelled this way in this caption and left uncorrected.",
      "Maintenance at the Agent": "Serviced by the marque's authorised agent in Egypt rather than an independent workshop.",
      "New tires": "A fresh set of tyres fitted.",
      "New profile": "The trade term for the same thing — new tyres. \"Profile\" is the workshop word for the tyre itself.",
      "All service done": "The scheduled servicing is up to date as of the post. Which services is not stated.",
      "Full service done": "The same claim, worded this way in this caption.",
      "Mint condition": "The dealership's own summary of the car's condition. An opinion, published as a claim.",
      "Perfect condition": "The same kind of summary, in this caption's wording.",
      "Panoramic sunroof": "A full-length glass roof panel, factory-fitted.",
      "License 2 years": "Two years of valid Egyptian licence remaining, so the buyer does not renew straight away.",
      "Only one in Egypt": "Their claim that no other example of this exact car and trim is in the country. It is not verifiable from the post, and is printed here as their words.",
    },
    carNotes: {
      s500: "The oldest car reachable in the account, and the only claim beside it is the bodykit.",
      e200: "The one listing the dealership marked sold, with their own banner across it. It is left on the floor here exactly as they left it on theirs.",
      cla180: "The highest odometer published anywhere in the account — and the caption still leads with factory paint.",
      x5: "Two claims, four words. This is the house style at its shortest.",
      x6: "The only caption in the account that states how much licence is left on the car.",
      bmw320i: "The outlier: a full spec sheet where every other caption is four or five lines.",
      c200: "The most claims of any listing here, and still under five lines.",
      rogue: "Half spec sheet, half claim. A marque the shopfront banner does not carry.",
      kodiaq: "The newest car, the lowest reading, and the only one with a number beside it.",
    },
  },

  registers: {
    heading: "Two registers, one account",
    intro:
      "Of the {cars} reachable captions, all but two are four or five terse lines. The exceptions read like a manufacturer's brochure.",
    body: [
      "The BMW 320i is written by someone else, or on a different day, or for a different buyer. It prints Engine, Displacement, Power, Torque, Transmission and Drivetrain as labelled rows, with the engine code, the rpm bands and the gearbox name spelled out. Nothing else in the account goes near that level of detail.",
      "The Nissan Rogue follows it halfway — three rows where the BMW has six — and then drops back into the house voice for its one claim. Every other listing here states a year, a reading and a handful of short phrases, and stops.",
      "The difference is noted, not diagnosed. {brand} publishes both kinds of caption, and this page shows each listing in the register it was actually written in rather than flattening the two into one house format.",
    ],
    terseLabel: "Terse caption",
    technicalLabel: "Spec sheet",
    partialLabel: "Part spec sheet",
    note: "Nothing is inferred from the difference in register. The spec rows are quoted as printed; where a caption states no specification, this page shows none.",
  },

  labels: {
    heading: "Badges on the glass, names in the highlights",
    intro:
      "{brand} labels itself twice, and the two label sets do not describe the same thing.",
    body: [
      "The story highlights name individual cars rather than categories — a car they had, a car they sold, a car worth pinning. Most dealers use highlights as a filing system: saloons, SUVs, new arrivals. These are closer to a wall of photographs.",
      "The shopfront banner does the opposite. It carries marque badges, and those badges are a statement of what the showroom deals in. The reachable floor holds two marques the banner does not carry.",
      "Which is an observation and nothing more. {reachable} posts of the {stated} the profile states opened to us — the badges may well be a fair description of everything else, and the floor we can see is a thin slice of the floor they have had.",
    ],
    highlightsLabel: "Story highlights",
    bannerLabel: "Badges on the shopfront banner",
    floorLabel: "Marques on the reachable floor",
    notOnBannerLabel: "On the floor, not on the banner",
    note: "This is not a contradiction and is not presented as one. Only {reachable} of {stated} posts open to a logged-out visitor, so a marque missing from the banner is evidence of nothing at all — it means only that the banner was printed before, or without, the cars we happen to be able to see.",
  },

  counts: {
    heading: "Counted, not estimated",
    intro: "Every figure below was read off the account itself. Not one of them is an estimate.",
    items: [
      { value: "{stated}", label: "posts stated on the profile" },
      { value: "{reachable}", label: "of them open to a visitor" },
      { value: "{cars}", label: "listings behind those posts" },
      { value: "{cars}", label: "of them publish an odometer" },
      { value: "{kmMin}", label: "km, the lowest reading published" },
      { value: "{kmMax}", label: "km, the highest reading published" },
      { value: "{yearSpan}", label: "model years between oldest and newest" },
      { value: "{priced}", label: "listing carries an asking price" },
      { value: "{sold}", label: "listing is marked sold" },
      { value: "{followers}", label: "followers" },
    ],
  },

  ledger: {
    noscript:
      "Motion is off, so every entry below is already written out. Nothing here depends on its rule being drawn first.",
    reducedMotion:
      "Reduced motion is set, so each entry is simply here rather than being ruled and then filled in.",
  },
};

export default en;
