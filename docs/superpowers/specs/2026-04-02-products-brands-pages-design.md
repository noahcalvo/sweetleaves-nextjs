# Products & Brands Pages Design

## Overview

Migrate product category and brand pages from sweetleavesnorthloop.com to the new Next.js site. Both page types share a single reusable template component. Data starts as static TypeScript, structured for easy CMS migration later.

## Routes

```
/products          → index page (card grid of all product categories)
/products/[slug]   → individual product category page
/brands            → index page (card grid of all brands)
/brands/[slug]     → individual brand page
```

## Data Schema

Both products and brands share the same `CatalogEntry` interface, defined in `lib/catalog.ts`:

```ts
interface AccordionItem {
  title: string;
  content: string; // HTML string (matches existing FAQ pattern)
}

interface CatalogEntry {
  slug: string;
  name: string;
  heroImage: string;         // path in public/products/ or public/brands/
  headline: string;          // H1 text
  accordionItems: AccordionItem[];
  iframeUrl: string;          // full Dutchie embed/iframe URL for this page
  subheadline: string;       // H2 text
  body: string;              // closing copy block (HTML string)
  metaDescription: string;   // SEO meta description
}
```

Data files:
- `lib/products.ts` — exports `products: CatalogEntry[]` (8 entries)
- `lib/brands.ts` — exports `brands: CatalogEntry[]` (~24 entries)

## Product Categories (8)

| Slug | Name |
|------|------|
| flower | Flower |
| pre-rolls | Pre-Rolls |
| edibles | Edibles |
| cannabis-beverages | Cannabis Beverages |
| disposable-vapes-and-carts | Disposable Vapes & Carts |
| cannabis-accessories | Cannabis Accessories |
| cbd | CBD |
| cannabis-seeds | Cannabis Seeds |

## Brands (~24)

| Slug | Name |
|------|------|
| sweetleaves | Sweetleaves |
| blncd | BLNCD |
| cann | Cann |
| raw | RAW |
| nowadays | Nowadays |
| gigli | Gigli |
| mary-jane | Mary & Jane |
| birchs-on-the-lake | Birch's on the Lake |
| clrty | CLRTY |
| find-wunder | Find Wunder |
| minh-le-studio | Minh Le Studio |
| oliphant-brewing | Oliphant Brewing |
| ongrok | ONGROK |
| session-goods | Session Goods |
| studio-tbd | Studio TBD |
| wild-state-cider-birdie | Wild State Cider / Birdie |
| wyld | Wyld |
| rythm | Rythm |
| dogwalkers | Dogwalkers |
| good-green | Good Green |
| grasslandz | Grasslandz |
| nebula | Nebula |
| lakeside-cannabis-co | Lakeside Cannabis Co. |
| cannabis-beverages (brand) | — skipped, this is a product category |

## Template: Detail Page (`CatalogPageTemplate`)

Shared component at `app/components/CatalogPageTemplate.tsx`. Server component with 0–n client accordion children (driven by `accordionItems` array length).

### Section Order

1. **Hero image** — full-width, rounded corners (`rounded-[30px] md:rounded-[40px]`), uses `next/image` with `fill` + `object-cover`, aspect ratio ~16:9 on desktop, ~4:3 on mobile
2. **H1** — `font-poppins-bold text-[35px] md:text-[55px] text-dark-green leading-tight`
3. **Accordion copy block** — reuses the existing `FaqItem` expand/collapse pattern (orange circle +/− button, grid-rows animation). Each accordion item has a `title` (bold heading) and `content` (HTML body). Single-column layout, full width.
4. **Dutchie embed** — an iframe loaded from the entry's `iframeUrl`. Simple `<iframe>` wrapper component, no script injection needed.
5. **H2** — `font-poppins-bold text-[25px] md:text-[35px] text-dark-green leading-tight`
6. **Copy block** — `font-poppins-regular text-[18px] text-dark-green leading-[1.6]`, rendered as HTML

### Container

Matches site pattern: `max-w-[1365px] mx-auto px-4 md:px-6 py-5 md:py-8 flex flex-col gap-5 lg:gap-[30px]`

## Template: Index Page

Both `/products` and `/brands` get an index page.

### Layout

- H1 heading (same style as other pages)
- Responsive card grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-[25px]`
- Each card: hero image thumbnail + name overlay, links to detail page
- Card style: `rounded-[30px]` with image, name as white text with dark overlay at bottom, hover scale effect

## Dutchie Embed

Each catalog entry stores a full `iframeUrl`. The template renders this in a simple iframe wrapper — no script injection or URL construction needed. This is simpler than the existing `DutchieEmbed` script approach and lets each page point to whatever Dutchie URL is appropriate.

The iframe component lives at `app/components/DutchieIframe.tsx` since it's shared across products and brands. It's a server component (just renders an `<iframe>`).

## Accordion Component

Genericize the existing `FaqItem` into a shared `AccordionItem` client component at `app/components/AccordionItem.tsx`. Props become `title`/`content` instead of `question`/`answer`. Update all existing FAQ usages to use the renamed component.

Visual pattern (unchanged):
- Orange circle toggle button
- Grid-rows expand/collapse animation
- `font-poppins-bold text-[20px]` for titles
- `font-poppins-regular text-[18px]` for content

The catalog template and FAQ pages both consume this single component.

## File Structure

```
app/
  components/
    CatalogPageTemplate.tsx     # Shared detail page template (server)
    AccordionItem.tsx           # Generic accordion item (client, replaces FaqItem)
    DutchieIframe.tsx           # Iframe wrapper for Dutchie URLs (server)
  products/
    page.tsx                    # Product index page
    [slug]/
      page.tsx                  # Product detail page (uses CatalogPageTemplate)
  brands/
    page.tsx                    # Brand index page
    [slug]/
      page.tsx                  # Brand detail page (uses CatalogPageTemplate)

lib/
  catalog.ts                    # CatalogEntry type + AccordionItem type
  products.ts                   # Product data array
  brands.ts                     # Brand data array

public/
  products/                     # Product hero images (scraped from old site)
    flower.jpg
    pre-rolls.jpg
    ...
  brands/                       # Brand hero images (scraped from old site)
    wyld.jpg
    cann.jpg
    ...
```

## Images

Hero images scraped from the old site pages and saved to `public/products/` and `public/brands/`. Used via `next/image` for optimization.

## SEO

Each detail page generates its own metadata using Next.js `generateMetadata`:
- `title` from `entry.name` (uses layout template: `"%s | Sweetleaves"`)
- `description` from `entry.metaDescription`
- `alternates.canonical` set to the page path

Each detail page uses `generateStaticParams` for static generation at build time.

## Content Population

Copy and images scraped from each page on sweetleavesnorthloop.com. The accordion items are derived from the content sections on each old page (typically 2 sections per page). The body copy block is the closing marketing paragraph.
