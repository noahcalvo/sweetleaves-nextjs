# DealsBanner Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder `DealsBanner` component with a live carousel that pulls deal slide images from a WordPress `deal` custom post type.

**Architecture:** A new `deal` CPT registered via mu-plugin feeds into a `getDealsBannerSlides()` data function in `lib/deals.ts`. `DealsBanner` (server component) fetches slides and passes them to `DealsCarousel` (client component) which handles the interactive prev/next behavior.

**Tech Stack:** PHP (WordPress mu-plugin), WPGraphQL, Next.js App Router, Tailwind CSS

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `mu-plugins/sweetleaves-deals.php` | Create | Registers `deal` CPT with WPGraphQL support |
| `lib/deals.ts` | Create | `DealSlide` type + `getDealsBannerSlides()` |
| `app/components/home/DealsCarousel.tsx` | Create | Client component — prev/next carousel UI |
| `app/components/home/DealsBanner.tsx` | Modify | Server component — fetches slides, renders carousel or null |

---

### Task 1: Register the `deal` CPT

**Files:**
- Create: `mu-plugins/sweetleaves-deals.php`

- [ ] **Step 1: Create the mu-plugin**

Create `mu-plugins/sweetleaves-deals.php` with the following content. Note `page-attributes` is required in `supports` to expose the Menu Order field in WP admin Quick Edit (same pattern used by `sweetleaves-faq.php`):

```php
<?php
/**
 * Plugin Name: Sweetleaves Deals
 * Description: Deal CPT for the homepage deals banner carousel
 */

add_action('init', function () {
    register_post_type('deal', [
        'labels' => [
            'name'          => 'Deals',
            'singular_name' => 'Deal',
            'add_new_item'  => 'Add New Deal',
            'edit_item'     => 'Edit Deal',
            'all_items'     => 'All Deals',
        ],
        'public'              => false,
        'has_archive'         => false,
        'show_ui'             => true,
        'show_in_rest'        => true,
        'supports'            => ['title', 'thumbnail', 'page-attributes'],
        'menu_icon'           => 'dashicons-tag',
        'show_in_graphql'     => true,
        'graphql_single_name' => 'deal',
        'graphql_plural_name' => 'deals',
    ]);
});
```

- [ ] **Step 2: Verify the CPT appears in WP admin**

Drop this file into the WordPress `mu-plugins/` directory. Reload WP admin — a **Deals** entry should appear in the left sidebar. If it doesn't appear, check for PHP errors in WP admin → Tools → Site Health → Info → PHP error log.

- [ ] **Step 3: Add 2–3 test Deal posts**

For each test post:
1. Go to **Deals → Add New**
2. Set the **Title** to descriptive alt text (e.g. `"Spring deals on flower"`) — this becomes the `<img alt>` attribute on the front end
3. Set a **Featured Image** — upload any placeholder image from your machine (minimum 1280×320px at 4:1 ratio)
4. **Publish** the post
5. Go back to **Deals → All Deals**, hover the row, click **Quick Edit**, set **Order** to `1`, `2`, `3` etc., then click **Update**

- [ ] **Step 4: Verify the GraphQL query returns data**

In WP admin → **GraphQL → GraphiQL IDE**, run:

```graphql
{
  deals(first: 20, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
    nodes {
      title
      featuredImage {
        node {
          sourceUrl
          mediaDetails {
            width
            height
          }
        }
      }
    }
  }
}
```

Expected: array of nodes, each with `title` and `featuredImage.node.sourceUrl` populated. If `deals` is not a recognised field, the CPT's `show_in_graphql` flag didn't save — re-check the plugin file and deactivate/reactivate via the mu-plugins directory.

- [ ] **Step 5: Commit**

```bash
git add mu-plugins/sweetleaves-deals.php
git commit -m "feat: register deal CPT for deals banner carousel"
```

---

### Task 2: Add the data layer

**Files:**
- Create: `lib/deals.ts`

- [ ] **Step 1: Create `lib/deals.ts`**

```ts
import { getWPData } from "./wp";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DealSlide {
  url: string;
  alt: string;
  width: number;
  height: number;
}

// ---------------------------------------------------------------------------
// GraphQL
// ---------------------------------------------------------------------------

const GET_DEALS_QUERY = `
  query GetDeals {
    deals(first: 20, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        title
        featuredImage {
          node {
            sourceUrl
            mediaDetails {
              width
              height
            }
          }
        }
      }
    }
  }
`;

// ---------------------------------------------------------------------------
// getDealsBannerSlides
// ---------------------------------------------------------------------------

export async function getDealsBannerSlides(): Promise<DealSlide[]> {
  const data = await getWPData(GET_DEALS_QUERY);
  const nodes: any[] = data?.deals?.nodes ?? [];
  return nodes
    .filter((node: any) => node?.featuredImage?.node?.sourceUrl)
    .map((node: any) => {
      const img = node.featuredImage.node;
      return {
        url: img.sourceUrl,
        alt: node.title ?? "",
        width: img.mediaDetails?.width ?? 1280,
        height: img.mediaDetails?.height ?? 320,
      };
    });
}
```

- [ ] **Step 2: Verify `getWPData` signature accepts zero `variables`**

Open `lib/wp.ts`. The signature is:

```ts
export async function getWPData(
  query: string,
  variables: Record<string, any> = {},
  options: WPFetchOptions = {}
)
```

Both `variables` and `options` have defaults so calling `getWPData(GET_DEALS_QUERY)` with one argument is valid. No change needed.

- [ ] **Step 3: Commit**

```bash
git add lib/deals.ts
git commit -m "feat: add getDealsBannerSlides data function"
```

---

### Task 3: Build the `DealsCarousel` client component

**Files:**
- Create: `app/components/home/DealsCarousel.tsx`

- [ ] **Step 1: Create `DealsCarousel.tsx`**

```tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import type { DealSlide } from "@/lib/deals";

interface Props {
  slides: DealSlide[];
}

export default function DealsCarousel({ slides }: Props) {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  const slide = slides[index];

  return (
    <div className="relative h-[273px] md:h-[320px] w-full max-w-[1280px] rounded-[40px] overflow-hidden">
      <Image
        src={slide.url}
        alt={slide.alt}
        fill
        className="object-cover object-center"
        sizes="(max-width: 768px) 100vw, 1280px"
        priority={index === 0}
      />
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-ivory/80 rounded-full w-10 h-10 flex items-center justify-center text-dark-green text-xl"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-ivory/80 rounded-full w-10 h-10 flex items-center justify-center text-dark-green text-xl"
            aria-label="Next slide"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
```

Note: `fill` mode requires the parent to have `position: relative` (covered by the `relative` class) and `overflow-hidden` to clip the image to the rounded corners. Prev/next controls are hidden when there is only one slide.

- [ ] **Step 2: Commit**

```bash
git add app/components/home/DealsCarousel.tsx
git commit -m "feat: add DealsCarousel client component"
```

---

### Task 4: Update `DealsBanner` to fetch and render

**Files:**
- Modify: `app/components/home/DealsBanner.tsx`

- [ ] **Step 1: Replace the placeholder**

Replace the entire contents of `app/components/home/DealsBanner.tsx` with:

```tsx
import { getDealsBannerSlides } from "@/lib/deals";
import DealsCarousel from "./DealsCarousel";

export default async function DealsBanner() {
  const slides = await getDealsBannerSlides();

  if (slides.length === 0) return null;

  return <DealsCarousel slides={slides} />;
}
```

- [ ] **Step 2: Verify the dev server renders the carousel**

```bash
npm run dev
```

Open `http://localhost:3000`. Scroll past the product grid — the deals banner should show the first slide image. If there are 2+ test posts, prev/next buttons should be visible and functional.

If the image fails to load with a hostname error, open `next.config.ts` and confirm the WP hostname is present in `remotePatterns`:

```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "cms.sweetleaves.co" },
  ],
},
```

If the banner renders nothing (empty state), confirm the test deal posts are **Published** (not Draft) and have a Featured Image set.

- [ ] **Step 3: Commit**

```bash
git add app/components/home/DealsBanner.tsx
git commit -m "feat: wire DealsBanner to WordPress deal CPT"
```
