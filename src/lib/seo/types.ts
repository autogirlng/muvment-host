import type { Metadata } from "next";

export type SeoDefaults = {
  siteName: string;
  titleTemplate: string;
  defaultDescription: string;
  defaultKeywords: string[];
  locale: string;
  region?: string;
  twitterSite?: string;
  twitterCreator?: string;
  themeColor?: string;
  defaultOgImage: string;
  robotsDisallow: string[];
  robotsAllow?: string[];
};

export type PageSeoInput = {
  title?: string;
  absoluteTitle?: string;
  description?: string;
  keywords?: string[];
  path?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
  noFollow?: boolean;
  metadata?: Metadata;
};

export type SitemapRouteEntry = {
  path: string;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
  lastModified?: Date | string;
};
