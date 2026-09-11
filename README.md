# AM Automotive — site 45 of 46

A concept site built entirely from this dealership's own published material.
**Not affiliated with AM Automotive, and not an official site.**

- **Live:** https://am-automotive-site.vercel.app
- **Repo:** [am-automotive-site](https://github.com/omaralaa0707/am-automotive-site)

## What this page is about

Every site in this series is built around something true and checkable about
the dealer's own account — a pattern in what they publish, a contradiction
between two of their channels, or a fact about their showroom — rather than
around a generic template. The palette, type, 3D piece and motion below were
all chosen to serve that finding.

## Design record

**Palette**
: **The first saturated brown ground in the set** — #6B4A2E, the cognac leather that recurs through their cabins (L*≈35); its nearest neighbour is 30's burnt sienna, which is redder, lighter and taken from a wall, where this is browner, darker and taken from upholstery. Ink #F6F1E9, panels #241811, their shield gold #C9A24B on the mark and rules alone, and #C0202B reserved **entirely** for the single car they bannered as sold — a colour with exactly one job on the whole page

**Type pairing**
: Cormorant Garamond + Figtree / Rakkas + Cairo (AR)

**3D / signature technique**
: **The Spread**: the nine published odometers strung along one *uncompressed* axis at their true proportional positions between 9,000 and 175,000 km, each marker's height set by its model year, so the complete absence of any relationship between age and mileage is visible rather than asserted. The sold car's marker is red; the one priced car's carries a gold cap

**Motion language**
: **The ledger**: a hairline rule draws itself first, and only once it has finished does the entry get written onto it — the rule is a separate element that *completes before* the content appears, where every other arrival in the set moves the content itself

## Sources

Everything on the page was sourced from:

- Instagram: https://www.instagram.com/am_automotive.eg/ (unverified - multiple candidates)
- Facebook: https://www.facebook.com/AM.AutoMotiveEG/ (unverified - multiple candidates)

Photography belongs to the dealership (or, where their frames are watermarked
by an outside studio, to that studio) and is used here only to document their
own published material. No figure on the page is invented: anything the dealer
did not publish is marked as unpublished rather than estimated.

## Running it

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build — must pass before shipping
pnpm lint     # eslint, zero warnings
```

Requires `node-linker=hoisted` in `.npmrc` (already present) or three.js peer
deps fail to resolve.

## Structure

```
src/content/media.ts      verified facts and figures — the data layer
src/content/en.ts|ar.ts   all copy, both locales, identical shapes
src/content/schema-ext.ts the page-specific content contract
src/components/webgl/     the 3D piece
src/components/site/      the page composition
src/app/globals.css       palette tokens, type, RTL overrides, motion
```

Arabic/English toggle with full RTL. All CSS direction overrides key off
`[dir="rtl"]` (never `[lang]`) and live outside `@layer`. Every Latin or
numeric fragment inside Arabic copy is wrapped in `.latin` for correct bidi.

---

Part of a 46-site series. See the [top-level README](../README.md) for the full
index and [`TRACKING.md`](../TRACKING.md) for the differentiation log.
