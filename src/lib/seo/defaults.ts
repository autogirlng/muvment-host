import type { SeoDefaults, SitemapRouteEntry } from "./types";


export const SEO_DEFAULTS: SeoDefaults = {
  siteName: "Muvment Host",
  titleTemplate: "%s | Muvment Host",
  defaultDescription:
    "Manage your host vehicles, bookings, and earnings with Muvment — Nigeria's mobility marketplace.",
  defaultKeywords: ["Muvment", "host", "vehicle rental", "Nigeria", "fleet"],
  locale: "en_NG",
  region: "NG",
  twitterSite: "@muvment",
  themeColor: "#0f766e",
  defaultOgImage: "/icons/logo.svg",
  robotsDisallow: [
    "/api/",
    "/dashboard",
    "/bookings",
    "/listings",
    "/wallet",
    "/profile",
    "/notifications",
    "/support",
    "/vehicle-onboarding",
    "/account-setup",
  ],
  robotsAllow: undefined,
};

/** Indexable public URLs only — extend as you add marketing pages. */
export const SITEMAP_PUBLIC_ROUTES: SitemapRouteEntry[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/earn", changeFrequency: "monthly", priority: 0.9 },
  {
    path: "/cancellation-policy",
    changeFrequency: "monthly",
    priority: 0.55,
  },
  { path: "/privacy-policy", changeFrequency: "monthly", priority: 0.55 },
  { path: "/terms-of-service", changeFrequency: "monthly", priority: 0.55 },
  { path: "/login", changeFrequency: "weekly", priority: 0.65 },
  { path: "/signup", changeFrequency: "weekly", priority: 0.7 },
];
