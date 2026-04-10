# DealsBanner Carousel — Design Spec

**Date:** 2026-04-09

## Overview

Replace the placeholder `DealsBanner` component with a live carousel that displays promotional images managed by marketing in WordPress. Marketing controls slides by publishing/unpublishing `deal` custom post type entries. No ACF Pro or options page required — only WPGraphQL (already installed).

---

## WordPress Setup

### Custom Post Type: `deal`

Registered in a new mu-plugin: `mu-plugins/sweetleaves-deals.php`, following the same pattern as `sweetleaves-faq.php`. Key registration args:

- `public`: false — deals don't need front-end WP URLs
- `show_in_graphql`: true
- `graphql_single_name`: `deal`
- `graphql_plural_name`: `deals`
- `supports`: `['title', 'thumbnail']` — title is used as the slide's alt text, thumbnail is the slide image
- `show_ui`: true — visible in WP admin for marketing
- `menu_icon`: any appropriate dashicon (e.g. `dashicons-tag`)

No ACF fields needed. Alt text is sourced from the deal post's `title` field — marketing sets it directly on the post. WPGraphQL exposes this as `title` on the `Deal` node.

### Ordering

Display order is controlled by WordPress's built-in **Menu Order** field. Marketing sets it via Quick Edit on the Deals list screen. Front end queries deals ordered by `MENU_ORDER ASC`.

A drag-and-drop reorder plugin (e.g. Simple Page Ordering) can be added later to improve the ordering UX — no code changes required on the Next.js side.

### Adding Test Content

Once the CPT is registered:

1. In WP admin go to **Deals → Add New**
2. Set the **Title** to descriptive alt text (e.g. `"Spring deals on flower"`) — this becomes the `<img alt>` attribute
3. Set a **Featured Image** — upload any placeholder image
5. In **Quick Edit**, set **Order** to `1`, `2`, `3` etc. to control carousel sequence
6. Publish the post
7. Repeat for 2–3 slides

### Verify with WPGraphQL IDE

**GraphQL → GraphiQL IDE** in WP admin:

```graphql
{
  deals(first: 10, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
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

If slides come back, the GraphQL layer is ready for the Next.js implementation.

---

## Data Layer

**New file:** `lib/deals.ts`

Exports one function: `getDealsBannerSlides(): Promise<DealSlide[]>`

```ts
interface DealSlide {
  url: string;
  alt: string;
  width: number;
  height: number;
}
```

- Queries the `deals` CPT via `getWPData`, ordered by `MENU_ORDER ASC`, fetching `title` (used as alt text) and featured image `sourceUrl` and `mediaDetails { width, height }`
- Uses default `WP_REVALIDATE_SECONDS`
- Returns `[]` if no published deals exist — never throws on empty
- Filters out any nodes missing a featured image

---

## Components

### `DealsBanner.tsx` (server component)

- Calls `getDealsBannerSlides()`
- Returns `null` if slides is empty — no empty shell rendered
- Otherwise renders `<DealsCarousel slides={slides} />`
- No `"use client"`

### `DealsCarousel.tsx` (new client component)

- `"use client"`
- `Props: { slides: DealSlide[] }`
- Manages current slide index with `useState`
- Renders images with Next.js `<Image>` using provided `alt` and dimensions, with `object-cover` and `object-center` — height is fixed, image crops horizontally on narrow screens rather than scaling down. Marketing must provide images at a minimum **4:1 aspect ratio** (e.g. 1280×320px), with focal content centered so it survives cropping on narrow screens.
- Prev/next controls
- Dimensions: `h-[273px] md:h-[320px] w-full max-w-[1280px] rounded-[40px]` — max-w derived from 4:1 ratio at the desktop height (320 × 4 = 1280px)
- Tailwind tokens only — no raw hex or arbitrary values

---

## Empty State

`DealsBanner` returns `null` when there are no published deals. The home page layout gap handles spacing.

---

## Future Extensions

- **Link URL per slide:** Add a free ACF Text field `link_url` to the `deal` CPT. Update `DealSlide` type, wrap `<Image>` in a Next.js `<Link>`. No structural changes required.
- **Auto-advance:** Add an interval in `DealsCarousel`. No data layer changes.

---

## Out of Scope

- Slide transitions beyond basic prev/next
- Animation / auto-play
- Deep-linking to a specific slide
