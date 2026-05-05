import type { MetadataRoute } from "next";
import { seoController } from "@/lib/seo";

/** Full URL list only in production (see `isProductionSeoArtifactsEnabled`). */
export default function sitemap(): MetadataRoute.Sitemap {
  return seoController.getSitemapEntriesForEnvironment();
}
