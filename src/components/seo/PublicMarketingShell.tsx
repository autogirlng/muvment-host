import type { ReactNode } from "react";
import type { PageSeoInput } from "@/lib/seo/types";
import { JsonLd } from "@/components/seo/JsonLd";
import { seoController } from "@/lib/seo";

type Props = {
  config: Required<Pick<PageSeoInput, "path">> &
    Pick<PageSeoInput, "title" | "absoluteTitle" | "description">;
  children: ReactNode;
};

/**
 * Server-only wrapper: WebPage JSON-LD aligned with `seoController.metadata.page` for the same route.
 */
export default function PublicMarketingShell({ config, children }: Props) {
  const title =
    config.absoluteTitle ??
    config.title ??
    seoController.defaults.siteName;

  return (
    <>
      <JsonLd
        document={seoController.schema.graph(
          seoController.schema.webPage({
            path: config.path,
            title,
            description: config.description,
          })
        )}
      />
      {children}
    </>
  );
}
