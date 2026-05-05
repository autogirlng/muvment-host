import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { seoController } from "@/lib/seo";

const earnTitle = "Earn as a driver";
const earnDescription =
  "Apply to drive with Muvment and grow your income with flexible opportunities.";

export const metadata: Metadata = seoController.metadata.page({
  title: earnTitle,
  description: earnDescription,
  path: "/earn",
  keywords: ["driver", "earn", "apply", "Muvment"],
});

/**
 * Example: extra JSON-LD for this segment only (WebPage). Global Org/WebSite
 * already ship from the root layout.
 */
export default function EarnLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd
        document={seoController.schema.graph(
          seoController.schema.webPage({
            path: "/earn",
            title: earnTitle,
            description: earnDescription,
          })
        )}
      />
      {children}
    </>
  );
}
