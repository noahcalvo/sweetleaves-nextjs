export interface CatalogEntry {
  slug: string;
  name: string;
  navLabel?: string;
  headline: string;
  // For product pages — maps to ?dtche[category]=<category>
  category?: string;
  // For brand pages — maps to ?dtche[brands]=<brand> (must match Dutchie's exact display name)
  brand?: string;
  subheadline: string;
  body: string;
  metaDescription: string;
}
