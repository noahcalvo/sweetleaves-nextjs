import { products } from "@/lib/products";
import { brands } from "@/lib/brands";
import type { CatalogEntry } from "@/lib/catalog";

type SimpleLink = { href: string; label: string; items?: never };
type DropdownLink = { label: string; items: { href: string; label: string }[]; href?: never };
export type NavItem = SimpleLink | DropdownLink;

const PRODUCT_SLUGS = ["flower", "vaporizers", "pre-rolls", "edibles", "cannabis-beverages", "cbd"];
const BRAND_SLUGS = ["sweetleaves", "rythm", "good-green", "dogwalkers", "lakeside-cannabis-co", "nebula", "grasslandz", "wyld"];

function toNavItems(entries: CatalogEntry[], slugs: string[], basePath: string) {
  return slugs.map((slug) => {
    const entry = entries.find((e) => e.slug === slug);
    return { href: `${basePath}/${slug}`, label: entry?.navLabel ?? entry?.name ?? slug };
  });
}

export const NAV_LINKS: NavItem[] = [
  { label: "Products", items: toNavItems(products, PRODUCT_SLUGS, "/products") },
  { label: "Brands", items: toNavItems(brands, BRAND_SLUGS, "/brands") },
  { href: "/loyalty", label: "Rewards" },
  { href: "/blog", label: "Blog" },
  { href: "/about-us", label: "About" },
  { href: "/contact", label: "Contact" },
];
