import type { Metadata } from "next";
import type { ReactNode } from "react";
import PublicMarketingShell from "@/components/seo/PublicMarketingShell";
import { seoController } from "@/lib/seo";
import { PUBLIC_PAGES_SEO } from "@/lib/seo/publicPagesConfig";

const seo = PUBLIC_PAGES_SEO.login;

export const metadata: Metadata = seoController.metadata.page(seo);

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <PublicMarketingShell config={seo}>{children}</PublicMarketingShell>;
}
