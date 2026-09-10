/**
 * AM Automotive — sourced facts.
 *
 * 1,815 followers, 356 posts stated, nine reachable, three accounts followed.
 * Bio: "Used and Brand New Premium Cars✨", then three numbers and a map link.
 *
 * Two things separate this account from every other in the series.
 *
 * **The showroom is inside another business.** Their own address line, printed
 * in Arabic at the foot of several posts, reads: مصر الجديدة امام الكلية
 * الحربية بوابة ٧ داخل chillout auto service معرض AM Automotive — Heliopolis,
 * opposite the Military Academy Gate 7, *inside* Chillout Auto Service. Google's
 * own place entry agrees: "AM Automotive, military Academy, in front of Gate 7,
 * Chillout car service center". No other dealer here is housed within another
 * trading business.
 *
 * **The floor has no type.** Nine listings run from a 2006 Mercedes S500 at
 * 170,000 km to a 2025 Nissan Rogue at 10,000 km. The published odometers span
 * 9,000 to 175,000 km — the widest spread in the series by a distance — across
 * nineteen model years. Exactly one listing carries a price. Exactly one is
 * marked sold.
 */

export type Car = {
  id: string;
  code: string;
  model: string;
  marque: string;
  year: number;
  /** Published odometer in km. Every listing here states one. */
  km: number;
  /** Published asking price in EGP; null on all but one. */
  price: number | null;
  sold: boolean;
  images: string[];
  /** Short claims exactly as the caption words them. */
  claims: string[];
  /** Present only on the one listing written in a technical register. */
  specs?: { label: string; value: string }[];
};

export const CARS: Car[] = [
  {
    id: "s500",
    code: "Dc6JG6aAOoq",
    model: "Mercedes-Benz S500",
    marque: "Mercedes-Benz",
    year: 2006,
    km: 170000,
    price: null,
    sold: false,
    images: [1, 2, 3, 4, 5, 6].map((i) => `/media/s500-${i}.jpg`),
    claims: ["Amg kit"],
  },
  {
    id: "e200",
    code: "DdCGYF7AM_z",
    model: "Mercedes-Benz E200 Avantgarde",
    marque: "Mercedes-Benz",
    year: 2015,
    km: 100000,
    price: null,
    sold: true,
    images: [1, 2, 3, 4, 5, 6].map((i) => `/media/e200-${i}.jpg`),
    claims: ["Factory Paint", "Maintenance at the Agent"],
  },
  {
    id: "cla180",
    code: "Dbo6cMZiCYL",
    model: "Mercedes-Benz CLA 180 Urban",
    marque: "Mercedes-Benz",
    year: 2015,
    km: 175000,
    price: null,
    sold: false,
    images: [1, 2, 3, 4, 5, 6].map((i) => `/media/cla180-${i}.jpg`),
    claims: ["Factory Paint", "New tires", "All service done"],
  },
  {
    id: "x5",
    code: "DcjjwHAgGjE",
    model: "BMW X5",
    marque: "BMW",
    year: 2016,
    km: 100000,
    price: null,
    sold: false,
    images: [1, 2, 3, 4, 5, 6].map((i) => `/media/x5-${i}.jpg`),
    claims: ["New profile", "Factory Paint"],
  },
  {
    id: "x6",
    code: "Dc_nbQrgBgb",
    model: "BMW X6 M Sport",
    marque: "BMW",
    year: 2017,
    km: 160000,
    price: null,
    sold: false,
    images: [1, 2, 3, 4, 5, 6].map((i) => `/media/x6-${i}.jpg`),
    claims: ["Perfect condition", "License 2 years"],
  },
  {
    id: "bmw320i",
    code: "DcEtTyuAJkp",
    model: "BMW 320i",
    marque: "BMW",
    year: 2020,
    km: 155000,
    price: null,
    sold: false,
    images: [1, 2, 3, 4, 5, 6].map((i) => `/media/bmw320i-${i}.jpg`),
    claims: ["Full service done", "Mint condition"],
    specs: [
      { label: "Engine", value: "2.0L 4-Cylinder TwinPower Turbo — B48" },
      { label: "Displacement", value: "1,998 cc" },
      { label: "Power", value: "184 HP @ 5,000–6,500 rpm" },
      { label: "Torque", value: "300 Nm @ 1,350–4,000 rpm" },
      { label: "Transmission", value: "8-Speed Automatic Steptronic" },
      { label: "Drivetrain", value: "Rear-Wheel Drive (RWD)" },
    ],
  },
  {
    id: "c200",
    code: "Dbo4VS6CIn9",
    model: "Mercedes-Benz C200",
    marque: "Mercedes-Benz",
    year: 2023,
    km: 23000,
    price: null,
    sold: false,
    images: [1, 2, 3, 4, 5, 6].map((i) => `/media/c200-${i}.jpg`),
    claims: ["Amg Kit", "Panoramic sunroof", "Factory paint", "Mint condition"],
  },
  {
    id: "rogue",
    code: "Dc9AVW8gPPd",
    model: "Nissan Rogue S",
    marque: "Nissan",
    year: 2025,
    km: 10000,
    price: null,
    sold: false,
    images: [1, 2, 3, 4, 5, 6].map((i) => `/media/rogue-${i}.jpg`),
    claims: ["Only one in Egypt"],
    specs: [
      { label: "Engine", value: "1500cc" },
      { label: "Power", value: "201 Hp" },
      { label: "Transmission", value: "X-Tronic CVT Transmission" },
    ],
  },
  {
    id: "kodiaq",
    code: "DcG9ZkpAFuC",
    model: "Skoda Kodiaq Sport Line",
    marque: "Skoda",
    year: 2025,
    km: 9000,
    price: 2850000,
    sold: false,
    images: [1, 2, 3, 4, 5, 6].map((i) => `/media/kodiaq-${i}.jpg`),
    claims: [],
  },
];

/** The address as they write it, in their own words. */
export const ADDRESS_AR =
  "مصر الجديدة امام الكلية الحربية بوابة ٧ داخل chillout auto service معرض AM Automotive";
export const ADDRESS_EN =
  "Heliopolis, opposite the Military Academy Gate 7, inside Chillout Auto Service — AM Automotive showroom";
/** The name of the business their showroom sits inside. */
export const HOST_BUSINESS = "Chillout Auto Service";

/**
 * Two different Maps links appear across their posts. Both resolve to the same
 * address; one is a registered Google place entry, the other a plain text
 * search of the same words. Not two locations — two ways of pointing at one.
 */
export const MAPS_LINKS = [
  {
    url: "https://maps.app.goo.gl/Y99KN4A1rX4eT5aS9",
    kind: "place-entry" as const,
    resolves:
      "AM Automotive, military Academy, in front of Gate 7, Chillout car service center, Cairo Governorate",
  },
  {
    url: "https://maps.app.goo.gl/GUKbGDPf2ArrDL6XA",
    kind: "text-query" as const,
    resolves: "AM Automotive، داخل chillout auto service، بوابة ٧",
  },
];

export const PHONES = ["01100449583", "01025977046", "01112115862"];

/** Their story highlights name individual cars, not categories. */
export const HIGHLIGHTS = ["Benz ♥️", "BMW x7", "X5 M50", "White CLA", "Grand Opening"];

/** The marque badges on their own shopfront banner. */
export const BANNER_MARQUES = ["Mercedes-Benz", "Audi", "Porsche", "Land Rover", "BMW"];

export const FLOOR_MARQUES = Array.from(new Set(CARS.map((c) => c.marque))).sort();
/** On the floor, absent from the banner. */
export const NOT_ON_BANNER = FLOOR_MARQUES.filter((m) => !BANNER_MARQUES.includes(m));

export const ODOMETERS = CARS.map((c) => c.km).sort((a, b) => a - b);
export const KM_MIN = ODOMETERS[0];
export const KM_MAX = ODOMETERS[ODOMETERS.length - 1];
export const YEAR_MIN = Math.min(...CARS.map((c) => c.year));
export const YEAR_MAX = Math.max(...CARS.map((c) => c.year));
export const YEAR_SPAN = YEAR_MAX - YEAR_MIN;
export const PRICED = CARS.filter((c) => c.price !== null);
export const SOLD = CARS.filter((c) => c.sold);

export const FOLLOWERS = "1,815";
export const FOLLOWING = 3;
export const POSTS_STATED = 356;
export const POSTS_REACHABLE = CARS.length;
export const TAGLINE = "Used and Brand New Premium Cars";
export const IG_URL = "https://www.instagram.com/am_automotive.eg/";
export const FB_URL = "https://www.facebook.com/AM.AutoMotiveEG/";
