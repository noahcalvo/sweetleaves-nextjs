# Products & Brands Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate product category and brand pages from the old WordPress site to the new Next.js site using a shared template component and static TypeScript data.

**Architecture:** A single `CatalogPageTemplate` server component renders both product and brand detail pages. Data lives in `lib/products.ts` and `lib/brands.ts` as typed arrays. A generic `AccordionItem` client component (refactored from the existing FAQ page's `FaqItem`) handles expand/collapse sections. Content and images are scraped from sweetleavesnorthloop.com.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, next/image

**Note:** No test infrastructure exists in this project. Per CLAUDE.md, adding test infrastructure requires a tradeoff discussion. This plan skips TDD — verify changes visually via the running dev server at localhost:3000.

---

### Task 1: Create catalog types

**Files:**
- Create: `lib/catalog.ts`

- [ ] **Step 1: Create the shared type definitions**

```ts
export interface AccordionItem {
  title: string;
  content: string;
}

export interface CatalogEntry {
  slug: string;
  name: string;
  heroImage: string;
  headline: string;
  accordionItems: AccordionItem[];
  iframeUrl: string;
  subheadline: string;
  body: string;
  metaDescription: string;
}
```

- [ ] **Step 2: Verify the dev server still compiles**

Run: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000`
Expected: `200`

- [ ] **Step 3: Commit**

```bash
git add lib/catalog.ts
git commit -m "add CatalogEntry and AccordionItem types"
```

---

### Task 2: Genericize FaqItem into AccordionItem

Refactor `app/faq/components/FaqItem.tsx` into a shared `app/components/AccordionItem.tsx` with `title`/`content` props. Update the FAQ page's `FaqAccordion.tsx` to import from the new location. Delete the old file.

The inline `FaqItem` in `app/components/FaqSection.tsx` and `app/loyalty/components/FaqSection.tsx` use a different visual treatment (pill-shaped, `>` rotation, parent-managed state) — leave those untouched.

**Files:**
- Create: `app/components/AccordionItem.tsx`
- Modify: `app/faq/components/FaqAccordion.tsx`
- Delete: `app/faq/components/FaqItem.tsx`

- [ ] **Step 1: Create AccordionItem**

Create `app/components/AccordionItem.tsx` — same logic as `app/faq/components/FaqItem.tsx` but with `title`/`content` props:

```tsx
"use client";

import { useState } from "react";

interface Props {
  title: string;
  content: string;
}

export default function AccordionItem({ title, content }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-w-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex gap-[25px] items-start w-full text-left cursor-pointer"
      >
        <span className="bg-orange-glow size-[44px] rounded-full shrink-0 flex items-center justify-center font-poppins-semibold text-[35px] text-white leading-none">
          {open ? "−" : "+"}
        </span>
        <span className="font-poppins-bold text-[20px] text-dark-green leading-none pt-[10px]">
          {title}
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div
            className="font-poppins-regular text-[18px] text-dark-green leading-[1.6] pl-[49px] pt-[10px]"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update FaqAccordion to use AccordionItem**

In `app/faq/components/FaqAccordion.tsx`, change the import and prop mapping:

```tsx
import type { FaqSection } from "@/lib/faq";
import AccordionItem from "@/app/components/AccordionItem";

interface Props {
  sections: FaqSection[];
}

export default function FaqAccordion({ sections }: Props) {
  return (
    <div className="bg-white rounded-[45px] py-[45px] px-[20px] md:rounded-[50px] md:px-[53px] md:py-[64px] w-full ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-[30px] md:gap-x-[65px]">
        {sections.map((section) => (
          <div key={section.slug} className="flex flex-col gap-[13px] min-w-0">
            <h2 className="font-poppins-bold text-[30px] md:text-[45px] text-dark-green leading-none mb-2">
              {section.name}
            </h2>
            {section.faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                title={faq.question}
                content={faq.answer}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Delete old FaqItem**

```bash
rm app/faq/components/FaqItem.tsx
```

- [ ] **Step 4: Verify FAQ page still works**

Open `http://localhost:3000/faq` in the browser. Confirm accordion items expand/collapse identically to before.

- [ ] **Step 5: Commit**

```bash
git add app/components/AccordionItem.tsx app/faq/components/FaqAccordion.tsx
git rm app/faq/components/FaqItem.tsx
git commit -m "refactor FaqItem into generic AccordionItem component"
```

---

### Task 3: Create DutchieIframe component

**Files:**
- Create: `app/components/DutchieIframe.tsx`

- [ ] **Step 1: Create the iframe wrapper**

```tsx
import Image from "next/image";

interface Props {
  src: string;
}

export default function DutchieIframe({ src }: Props) {
  return (
    <div className="w-full rounded-[30px] md:rounded-[40px] overflow-hidden bg-white">
      <iframe
        src={src}
        title="Shop menu"
        className="w-full border-0"
        style={{ minHeight: "600px" }}
        loading="lazy"
        allow="payment"
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/DutchieIframe.tsx
git commit -m "add DutchieIframe component for catalog pages"
```

---

### Task 4: Create CatalogPageTemplate component

**Files:**
- Create: `app/components/CatalogPageTemplate.tsx`

- [ ] **Step 1: Build the template**

```tsx
import Image from "next/image";
import type { CatalogEntry } from "@/lib/catalog";
import AccordionItem from "./AccordionItem";
import DutchieIframe from "./DutchieIframe";

interface Props {
  entry: CatalogEntry;
}

export default function CatalogPageTemplate({ entry }: Props) {
  return (
    <div className="max-w-[1365px] mx-auto px-4 md:px-6 py-5 md:py-8 flex flex-col gap-5 lg:gap-[30px]">
      {/* Hero */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-[30px] md:rounded-[40px] overflow-hidden">
        <Image
          src={entry.heroImage}
          alt={entry.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* H1 */}
      <h1 className="font-poppins-bold text-[35px] md:text-[55px] text-dark-green leading-tight">
        {entry.headline}
      </h1>

      {/* Accordion */}
      {entry.accordionItems.length > 0 && (
        <div className="flex flex-col gap-[13px]">
          {entry.accordionItems.map((item) => (
            <AccordionItem
              key={item.title}
              title={item.title}
              content={item.content}
            />
          ))}
        </div>
      )}

      {/* Dutchie menu */}
      {entry.iframeUrl && (
        <DutchieIframe src={entry.iframeUrl} />
      )}

      {/* H2 */}
      {entry.subheadline && (
        <h2 className="font-poppins-bold text-[25px] md:text-[35px] text-dark-green leading-tight">
          {entry.subheadline}
        </h2>
      )}

      {/* Body */}
      {entry.body && (
        <div
          className="font-poppins-regular text-[18px] text-dark-green leading-[1.6]"
          dangerouslySetInnerHTML={{ __html: entry.body }}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/CatalogPageTemplate.tsx
git commit -m "add CatalogPageTemplate shared detail page component"
```

---

### Task 5: Scrape product data and images

Scrape all 8 product category pages from sweetleavesnorthloop.com. For each page:
1. Use `WebFetch` to get the page content — extract the headline, content sections (for accordion items), and closing copy
2. Download the hero image to `public/products/`
3. Structure into a `CatalogEntry` object

**URLs to scrape:**

| Slug | URL |
|------|-----|
| flower | https://sweetleavesnorthloop.com/flower/ |
| pre-rolls | https://sweetleavesnorthloop.com/pre-rolls/ |
| edibles | https://sweetleavesnorthloop.com/edibles/ |
| cannabis-beverages | https://sweetleavesnorthloop.com/cannabis-beverages/ |
| disposable-vapes-and-carts | https://sweetleavesnorthloop.com/disposable-vapes-and-carts/ |
| cannabis-accessories | https://sweetleavesnorthloop.com/cannabis-accessories/ |
| cbd | https://sweetleavesnorthloop.com/cbd/ |
| cannabis-seeds | https://sweetleavesnorthloop.com/cannabis-seeds/ |

**Files:**
- Create: `lib/products.ts`
- Create: `public/products/*.jpg` (8 hero images)

- [ ] **Step 1: Create `public/products/` directory**

```bash
mkdir -p public/products
```

- [ ] **Step 2: Scrape each product page**

For each URL above, use `WebFetch` with this prompt:
> "Extract the following from this page: 1) The main heading text. 2) Each content section as a pair of (section heading, section body paragraph). 3) Any closing paragraph or CTA text. 4) The URL of the main hero/featured image on the page. Return all text content verbatim."

- [ ] **Step 3: Download hero images**

For each page's hero image URL, download to `public/products/{slug}.jpg`:
```bash
curl -L -o public/products/flower.jpg "https://sweetleavesnorthloop.com/path/to/image.jpg"
```

- [ ] **Step 4: Write `lib/products.ts`**

Assemble all scraped content into the typed array. The `iframeUrl` field should be left as an empty string (user will provide Dutchie URLs). Example structure:

```ts
import type { CatalogEntry } from "./catalog";

export const products: CatalogEntry[] = [
  {
    slug: "flower",
    name: "Flower",
    heroImage: "/products/flower.jpg",
    headline: "Flower",
    accordionItems: [
      {
        title: "Discover Premium Flower at Sweetleaves in Minneapolis",
        content: "<p>Scraped paragraph content here...</p>",
      },
      {
        title: "Flower in Minnesota, Expertly Curated for You",
        content: "<p>Scraped paragraph content here...</p>",
      },
    ],
    iframeUrl: "",
    subheadline: "Shop Flower at Sweetleaves",
    body: "<p>Closing marketing copy here...</p>",
    metaDescription: "Shop premium cannabis flower at Sweetleaves in Minneapolis. Minnesota-grown, expertly curated indica, hybrid, and sativa strains.",
  },
  // ... remaining 7 product entries
];
```

Each entry must have all fields populated from the scraped content. The `metaDescription` should be a concise summary derived from the page's introductory text (~150 chars).

- [ ] **Step 5: Commit**

```bash
git add lib/products.ts public/products/
git commit -m "add product data and hero images scraped from old site"
```

---

### Task 6: Create product pages

**Files:**
- Create: `app/products/[slug]/page.tsx`
- Create: `app/products/page.tsx`

- [ ] **Step 1: Create the product detail page**

Create `app/products/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/lib/products";
import CatalogPageTemplate from "@/app/components/CatalogPageTemplate";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.metaDescription,
    alternates: { canonical: `/products/${product.slug}` },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  return <CatalogPageTemplate entry={product} />;
}
```

- [ ] **Step 2: Create the product index page**

Create `app/products/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Shop cannabis flower, edibles, pre-rolls, beverages, vapes, and more at Sweetleaves in Minneapolis.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <div className="max-w-[1365px] mx-auto px-4 md:px-6 py-5 md:py-8 flex flex-col gap-5 lg:gap-[30px]">
      <h1 className="font-poppins-bold text-[35px] md:text-[55px] text-dark-green text-center leading-tight">
        Products
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-[25px]">
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/products/${product.slug}`}
            className="group relative aspect-[4/3] rounded-[30px] overflow-hidden"
          >
            <Image
              src={product.heroImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-5 left-5 font-poppins-bold text-[25px] text-white leading-tight">
              {product.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify product pages**

Open `http://localhost:3000/products` — confirm the card grid renders with images and links.
Open `http://localhost:3000/products/flower` — confirm the full template renders: hero, H1, accordion, H2, body.

- [ ] **Step 4: Commit**

```bash
git add app/products/
git commit -m "add product index and detail pages"
```

---

### Task 7: Scrape brand data and images

Same process as Task 5 but for all brand pages.

**URLs to scrape:**

| Slug | URL |
|------|-----|
| sweetleaves | https://sweetleavesnorthloop.com/sweetleaves/ |
| blncd | https://sweetleavesnorthloop.com/blncd/ |
| cann | https://sweetleavesnorthloop.com/cann/ |
| raw | https://sweetleavesnorthloop.com/raw/ |
| nowadays | https://sweetleavesnorthloop.com/nowadays/ |
| gigli | https://sweetleavesnorthloop.com/gigli/ |
| mary-jane | https://sweetleavesnorthloop.com/mary-jane/ |
| birchs-on-the-lake | https://sweetleavesnorthloop.com/birchs-on-the-lake/ |
| clrty | https://sweetleavesnorthloop.com/clrty/ |
| find-wunder | https://sweetleavesnorthloop.com/find-wunder/ |
| minh-le-studio | https://sweetleavesnorthloop.com/minh-le-studio/ |
| oliphant-brewing | https://sweetleavesnorthloop.com/oliphant-brewing/ |
| ongrok | https://sweetleavesnorthloop.com/ongrok/ |
| session-goods | https://sweetleavesnorthloop.com/session-goods/ |
| studio-tbd | https://sweetleavesnorthloop.com/studio-tbd/ |
| wild-state-cider-birdie | https://sweetleavesnorthloop.com/wild-state-cider-birdie/ |
| wyld | https://sweetleavesnorthloop.com/wyld/ |
| rythm | https://sweetleavesnorthloop.com/rythm/ |
| dogwalkers | https://sweetleavesnorthloop.com/dogwalkers/ |
| good-green | https://sweetleavesnorthloop.com/good-green/ |
| grasslandz | https://sweetleavesnorthloop.com/grasslandz/ |
| nebula | https://sweetleavesnorthloop.com/nebula/ |
| lakeside-cannabis-co | https://sweetleavesnorthloop.com/lakeside-cannabis-co/ |

**Files:**
- Create: `lib/brands.ts`
- Create: `public/brands/*.jpg` (~23 hero images)

- [ ] **Step 1: Create `public/brands/` directory**

```bash
mkdir -p public/brands
```

- [ ] **Step 2: Scrape each brand page**

For each URL above, use `WebFetch` with this prompt:
> "Extract the following from this page: 1) The brand name as displayed. 2) The main tagline or description. 3) Each content section as a pair of (section heading, section body paragraph). 4) Any closing paragraph or CTA text. 5) The URL of the main hero/featured image. Return all text content verbatim."

- [ ] **Step 3: Download hero images**

For each page's hero image URL, download to `public/brands/{slug}.jpg`:
```bash
curl -L -o public/brands/wyld.jpg "https://sweetleavesnorthloop.com/path/to/image.jpg"
```

- [ ] **Step 4: Write `lib/brands.ts`**

Same structure as `lib/products.ts`:

```ts
import type { CatalogEntry } from "./catalog";

export const brands: CatalogEntry[] = [
  {
    slug: "wyld",
    name: "Wyld",
    heroImage: "/brands/wyld.jpg",
    headline: "WYLD",
    accordionItems: [
      {
        title: "Sweetleaves Has WYLD Edibles",
        content: "<p>Scraped paragraph content here...</p>",
      },
      {
        title: "The WYLD Story",
        content: "<p>Scraped paragraph content here...</p>",
      },
    ],
    iframeUrl: "",
    subheadline: "Shop WYLD at Sweetleaves",
    body: "<p>Closing marketing copy here...</p>",
    metaDescription: "Shop WYLD edibles at Sweetleaves in Minneapolis. Flavors inspired by nature with precise dosing.",
  },
  // ... remaining brand entries
];
```

- [ ] **Step 5: Commit**

```bash
git add lib/brands.ts public/brands/
git commit -m "add brand data and hero images scraped from old site"
```

---

### Task 8: Create brand pages

**Files:**
- Create: `app/brands/[slug]/page.tsx`
- Create: `app/brands/page.tsx`

- [ ] **Step 1: Create the brand detail page**

Create `app/brands/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { brands } from "@/lib/brands";
import CatalogPageTemplate from "@/app/components/CatalogPageTemplate";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) return {};
  return {
    title: brand.name,
    description: brand.metaDescription,
    alternates: { canonical: `/brands/${brand.slug}` },
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) notFound();

  return <CatalogPageTemplate entry={brand} />;
}
```

- [ ] **Step 2: Create the brand index page**

Create `app/brands/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { brands } from "@/lib/brands";

export const metadata: Metadata = {
  title: "Brands",
  description:
    "Explore our curated selection of cannabis brands at Sweetleaves in Minneapolis.",
  alternates: { canonical: "/brands" },
};

export default function BrandsPage() {
  return (
    <div className="max-w-[1365px] mx-auto px-4 md:px-6 py-5 md:py-8 flex flex-col gap-5 lg:gap-[30px]">
      <h1 className="font-poppins-bold text-[35px] md:text-[55px] text-dark-green text-center leading-tight">
        Brands
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-[25px]">
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/brands/${brand.slug}`}
            className="group relative aspect-[4/3] rounded-[30px] overflow-hidden"
          >
            <Image
              src={brand.heroImage}
              alt={brand.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-5 left-5 font-poppins-bold text-[25px] text-white leading-tight">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify brand pages**

Open `http://localhost:3000/brands` — confirm the card grid renders with images and links.
Open `http://localhost:3000/brands/wyld` — confirm the full template renders.

- [ ] **Step 4: Commit**

```bash
git add app/brands/
git commit -m "add brand index and detail pages"
```
