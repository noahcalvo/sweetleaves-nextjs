export interface CatalogEntry {
  slug: string;
  name: string;
  navLabel?: string;
  headline: string;
  category?: string;
  // Dutchie embed URL params, written to window.location.search before the script loads.
  // Keys are full param names e.g. "dtche[category]", "dtche[path]", "dtche[subcategories]".
  // Must match Dutchie's exact values — verify by browsing the live embed and watching the URL.
  dutchieParams?: Record<string, string>;
  subheadline: string;
  body: string;
  metaDescription: string;
}
