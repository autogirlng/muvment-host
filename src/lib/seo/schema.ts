import { SEO_DEFAULTS } from "./defaults";
import type { PageSeoInput } from "./types";

type JsonLdObject = Record<string, unknown>;


export function resolveAbsoluteUrl(siteUrl: string, pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${siteUrl}${path}`;
}

export function buildOrganizationSchema(siteUrl: string): JsonLdObject {
  return {
    "@type": "Organization",
    "@id": `${siteUrl}#organization`,
    name: SEO_DEFAULTS.siteName,
    url: siteUrl,
    logo: resolveAbsoluteUrl(siteUrl, SEO_DEFAULTS.defaultOgImage),
    ...(SEO_DEFAULTS.region && { areaServed: SEO_DEFAULTS.region }),
  };
}

export function buildWebSiteSchema(siteUrl: string): JsonLdObject {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    name: SEO_DEFAULTS.siteName,
    url: siteUrl,
    publisher: { "@id": `${siteUrl}#organization` },
  };
}

export function buildWebPageSchema(
  siteUrl: string,
  input: Pick<PageSeoInput, "path" | "title" | "description"> & { path: string }
): JsonLdObject {
  const path = input.path.startsWith("/") ? input.path : `/${input.path}`;
  const url = `${siteUrl}${path}`;
  const name =
    input.title ??
    SEO_DEFAULTS.siteName;

  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description: input.description ?? SEO_DEFAULTS.defaultDescription,
    isPartOf: { "@id": `${siteUrl}#website` },
    publisher: { "@id": `${siteUrl}#organization` },
  };
}

export function buildBreadcrumbSchema(
  siteUrl: string,
  items: { name: string; path: string }[]
): JsonLdObject {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const path = item.path.startsWith("/") ? item.path : `/${item.path}`;
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${siteUrl}${path}`,
      };
    }),
  };
}


export function buildGraphDocument(...nodes: JsonLdObject[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
