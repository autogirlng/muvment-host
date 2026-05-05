import type { MetadataRoute } from "next";
import { seoController } from "@/lib/seo";

/** Crawl rules match production only; dev/preview disallow all (no sitemap line). */
export default function robots(): MetadataRoute.Robots {
  return seoController.getRobotsConfigForEnvironment();
}
