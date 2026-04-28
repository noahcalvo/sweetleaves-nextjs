import type { MetadataRoute } from "next";
import { brands } from "@/lib/brands";
import { products } from "@/lib/products";

const BASE = "https://sweetleavesnorthloop.com";

const staticRoutes = [
  "/",
  "/about-us/",
  "/contact/",
  "/careers/",
  "/events/",
  "/faqs/",
  "/loyalty/",
  "/shop-now/",
  "/certificate-of-analysis/",
  "/blog/",
  "/cannabis-101-understanding-thc-cbd-and-more/",
  "/minnesota-cannabis-laws/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const statics = staticRoutes.map((route) => ({
    url: `${BASE}${route}`,
    lastModified,
  }));

  const brandEntries = brands.map((brand) => ({
    url: `${BASE}/brands/${brand.slug}/`,
    lastModified,
  }));

  const productEntries = products.map((product) => ({
    url: `${BASE}/products/${product.slug}/`,
    lastModified,
  }));

  return [...statics, ...brandEntries, ...productEntries];
}
