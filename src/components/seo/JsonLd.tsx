type JsonLdProps = {
  /** Pre-built document (e.g. from `seoController.schema.rootGraph()` or `graph(...)`) */
  document: Record<string, unknown>;
};

/**
 * View: inject JSON-LD. Keep pages/layouts server components when using this.
 */
export function JsonLd({ document }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(document) }}
    />
  );
}
