import type { Metadata } from "next";
import type { MetadataRoute } from "next";
import { SEO_DEFAULTS, SITEMAP_PUBLIC_ROUTES } from "./defaults";
import type { PageSeoInput } from "./types";
import {
  buildBreadcrumbSchema,
  buildGraphDocument,
  buildOrganizationSchema,
  buildWebPageSchema,
  buildWebSiteSchema,
  resolveAbsoluteUrl,
} from "./schema";


export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";
  return raw.replace(/\/$/, "");
}


export function isProductionSeoArtifactsEnabled(): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  const env = process.env.VERCEL_ENV;
  if (env === "preview" || env === "development") return false;
  return true;
}

export function getSitemapEntriesForEnvironment(): MetadataRoute.Sitemap {
  if (!isProductionSeoArtifactsEnabled()) return [];
  return getSitemapEntries();
}

export function getRobotsConfigForEnvironment(): MetadataRoute.Robots {
  if (!isProductionSeoArtifactsEnabled()) {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: ["/"],
        },
      ],
    };
  }
  return getRobotsConfig();
}

export function resolveOgUrl(pathOrUrl: string): string {
  return resolveAbsoluteUrl(getSiteUrl(), pathOrUrl);
}

function ogLocale(): string {
  return SEO_DEFAULTS.locale.replace("_", "-");
}


export function rootMetadata(): Metadata {
  const base = getSiteUrl();
  const image = resolveOgUrl(SEO_DEFAULTS.defaultOgImage);

  return {
    metadataBase: new URL(base),
    title: {
      default: SEO_DEFAULTS.siteName,
      template: SEO_DEFAULTS.titleTemplate,
    },
    description: SEO_DEFAULTS.defaultDescription,
    keywords: [...SEO_DEFAULTS.defaultKeywords],
    applicationName: SEO_DEFAULTS.siteName,
    ...(SEO_DEFAULTS.themeColor && { themeColor: SEO_DEFAULTS.themeColor }),
    alternates: {
      canonical: base,
    },
    openGraph: {
      type: "website",
      locale: ogLocale(),
      url: base,
      siteName: SEO_DEFAULTS.siteName,
      title: SEO_DEFAULTS.siteName,
      description: SEO_DEFAULTS.defaultDescription,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: SEO_DEFAULTS.siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      ...(SEO_DEFAULTS.twitterSite && { site: SEO_DEFAULTS.twitterSite }),
      ...(SEO_DEFAULTS.twitterCreator && { creator: SEO_DEFAULTS.twitterCreator }),
      title: SEO_DEFAULTS.siteName,
      description: SEO_DEFAULTS.defaultDescription,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function authenticatedShellMetadata(): Metadata {
  return {
    title: { absolute: SEO_DEFAULTS.siteName },
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}


export function pageMetadata(input: PageSeoInput): Metadata {
  const base = getSiteUrl();
  const pathNorm = input.path
    ? input.path.startsWith("/")
      ? input.path
      : `/${input.path}`
    : "";
  const canonical = input.canonical ?? (pathNorm ? `${base}${pathNorm}` : undefined);
  const description = input.description ?? SEO_DEFAULTS.defaultDescription;
  const keywords = [...SEO_DEFAULTS.defaultKeywords, ...(input.keywords ?? [])];
  const image = resolveOgUrl(input.ogImage ?? SEO_DEFAULTS.defaultOgImage);

  const displayTitle =
    input.absoluteTitle ?? input.title ?? SEO_DEFAULTS.siteName;

  const titleBlock: Metadata["title"] | undefined = input.absoluteTitle
    ? { absolute: input.absoluteTitle }
    : input.title
      ? input.title
      : undefined;

  const robots =
    input.noIndex !== undefined || input.noFollow !== undefined
      ? {
          index: input.noIndex === true ? false : true,
          follow: input.noFollow === true ? false : true,
        }
      : undefined;

  const meta: Metadata = {
    ...(titleBlock !== undefined ? { title: titleBlock } : {}),
    description,
    keywords,
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      type: input.ogType ?? "website",
      locale: ogLocale(),
      ...(canonical ? { url: canonical } : {}),
      siteName: SEO_DEFAULTS.siteName,
      title: displayTitle,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: SEO_DEFAULTS.siteName }],
    },
    twitter: {
      card: "summary_large_image",
      ...(SEO_DEFAULTS.twitterSite && { site: SEO_DEFAULTS.twitterSite }),
      ...(SEO_DEFAULTS.twitterCreator && { creator: SEO_DEFAULTS.twitterCreator }),
      title: displayTitle,
      description,
      images: [image],
    },
    ...(robots ? { robots } : {}),
    ...(input.metadata ?? {}),
  };

  return meta;
}

export function getSitemapEntries(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return SITEMAP_PUBLIC_ROUTES.map((r) => ({
    url: `${base}${r.path.startsWith("/") ? r.path : `/${r.path}`}`,
    lastModified: r.lastModified ?? new Date(),
    changeFrequency: r.changeFrequency ?? "weekly",
    priority: r.priority ?? 0.5,
  }));
}

export function getRobotsConfig(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        ...(SEO_DEFAULTS.robotsAllow?.length
          ? { allow: SEO_DEFAULTS.robotsAllow }
          : {}),
        ...(SEO_DEFAULTS.robotsDisallow.length > 0
          ? { disallow: SEO_DEFAULTS.robotsDisallow }
          : {}),
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}

export const seoSchema = {
  organization: () => buildOrganizationSchema(getSiteUrl()),
  webSite: () => buildWebSiteSchema(getSiteUrl()),
  webPage: (input: Pick<PageSeoInput, "path" | "title" | "description"> & { path: string }) =>
    buildWebPageSchema(getSiteUrl(), input),
  breadcrumbs: (items: { name: string; path: string }[]) =>
    buildBreadcrumbSchema(getSiteUrl(), items),
  rootGraph: () =>
    buildGraphDocument(
      buildOrganizationSchema(getSiteUrl()),
      buildWebSiteSchema(getSiteUrl())
    ),
  /** Compose arbitrary entities into one `@graph` payload. */
  graph: (...nodes: Record<string, unknown>[]) => buildGraphDocument(...nodes),
};


export const seoController = {
  defaults: SEO_DEFAULTS,
  sitemapRoutes: SITEMAP_PUBLIC_ROUTES,
  getSiteUrl,
  resolveOgUrl,
  getSitemapEntries,
  getRobotsConfig,
  isProductionSeoArtifactsEnabled,
  getSitemapEntriesForEnvironment,
  getRobotsConfigForEnvironment,
  metadata: {
    root: rootMetadata,
    page: pageMetadata,
    authenticatedShell: authenticatedShellMetadata,
  },
  schema: seoSchema,
};
