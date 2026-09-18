/**
 * Event marks from public/assets, matched by event title. The API's own
 * `logo` wins when it is set; these only fill the gap so a card never shows
 * a broken image.
 */
const EVENT_MARKS: { match: RegExp; logo: string }[] = [
  { match: /data\s*quest/i, logo: "/assets/logo-dq.webp" },
  { match: /math\s*mania/i, logo: "/assets/logo-mm.webp" },
  { match: /q[\s-]*factor|quiz/i, logo: "/assets/logo-qz.webp" },
  { match: /triathlon/i, logo: "/assets/logo-tri.webp" },
  { match: /breach\s*point/i, logo: "/assets/logo-brc.webp" },
  { match: /survivor|court/i, logo: "/assets/logo-svc.webp" },
  { match: /valorant/i, logo: "/assets/logo-val.webp" },
  { match: /fifa|football/i, logo: "/assets/logo-fifa.webp" },
];

export function eventLogo(event: { title?: string; logo?: string | null }) {
  if (event?.logo) return event.logo;
  const hit = EVENT_MARKS.find(({ match }) => match.test(event?.title ?? ""));
  return hit?.logo ?? null;
}

/** One spectrum colour per card (§3.2) — used for its shadow only. */
const SPECTRUM = ["var(--r1)", "var(--r5)", "var(--r3)", "var(--r7)", "var(--r4)", "var(--r2)", "var(--r6)"];
export const eventAccent = (index: number) => SPECTRUM[index % SPECTRUM.length];

/** Small, varied tilts so adjacent cards never share an angle (§6.4). */
const TILTS = [-1.2, 0.8, -0.5, 1.3, -1, 0.4];
export const eventTilt = (index: number) => TILTS[index % TILTS.length];
