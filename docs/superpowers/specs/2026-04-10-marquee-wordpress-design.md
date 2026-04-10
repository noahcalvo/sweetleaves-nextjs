# Marquee WordPress Configuration — Design Spec

**Date:** 2026-04-10

## Overview

The scrolling marquee banner currently renders a hardcoded list of statements. This spec describes making those statements configurable via WordPress, so editors can add, remove, and reorder them without a code change.

## WordPress

Register a `marquee_item` custom post type with the following characteristics:

- **Title field** — the statement text displayed in the banner
- **`menuOrder`** — controls display order; editors reorder via the WP admin list view
- No custom fields required beyond the built-in title and menu order
- Editors manage items at: WP Admin → Marquee Items

## Data Layer — `lib/marquee.ts`

New file following the same pattern as `lib/deals.ts`.

- **GraphQL query:** `marqueeItems(first: 50, where: { orderby: { field: MENU_ORDER, order: ASC } })`, selecting `title` for each node
- **Exported function:** `getMarqueeItems(): Promise<string[]>` — returns an array of statement strings
- **Revalidation:** uses `WP_REVALIDATE_SECONDS` default (300s)

## Component — `app/components/nav/Marquee.tsx`

- `Marquee` becomes an `async` server component
- Calls `getMarqueeItems()` and passes the result to `MarqueeContent`
- If WordPress returns an empty array, the marquee renders nothing (no hardcoded fallback)
- Uppercase rendering and leaf icon separators are unchanged

## What Does Not Change

- `Nav.tsx` — no changes; already renders `<Marquee />` as a server component
- Marquee animation CSS — unchanged
- Visual appearance — unchanged; uppercase + leaf icon separators remain as-is
