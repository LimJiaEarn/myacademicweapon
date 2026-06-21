// Single source of truth for SEO metadata — consumed by the root layout,
// sitemap.ts, robots.ts, manifest.ts and the dynamic opengraph-image.
export const SITE_URL = "https://www.myacademicweapon.com";
export const SITE_NAME = "My Academic Weapon";
export const SITE_DESCRIPTION =
  "Free study resources for Singapore students — O-Level and A-Level prelim papers, topical practice papers and study notes for Secondary and JC, all in one place.";
export const GOOGLE_SITE_VERIFICATION = "fgFblIdD-kvYb-XjhGf0B57bu3JMY-gwpIHFH0xY2K4";

// Live study-resource levels (Primary not yet enabled). Lowercase = URL slug.
export const LEVELS = ["secondary", "jc"] as const;
export type Level = (typeof LEVELS)[number];
