export interface AccordionItem {
  title: string;
  content: string;
}

export interface CatalogEntry {
  slug: string;
  name: string;
  heroImage: string;
  logoImage?: string;
  headline: string;
  accordionItems: AccordionItem[];
  iframeUrl: string;
  subheadline: string;
  body: string;
  metaDescription: string;
}
