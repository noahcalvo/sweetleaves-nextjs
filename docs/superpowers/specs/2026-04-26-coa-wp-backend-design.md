# COA Page — WordPress Backend Design

**Date:** 2026-04-26

## Overview

Move the COA page's product and batch data from hardcoded TypeScript constants into WordPress, so staff can add, edit, and delete COA entries without a code deploy. Only the gummies product line is in scope.

---

## WordPress Data Model

**CPT:** `coa_batch`  
**Label:** COA Batches

Three ACF free fields (no Pro required):

| Field key | Type | Notes |
|-----------|------|-------|
| `flavor` | Text | Must match a key in the frontend `FLAVOR_MAP` (e.g. "Pink Lemonade"). Matching is case-insensitive. |
| `batch_number` | Text | e.g. "B-26041-PLE" |
| `pdf_url` | URL | Link to the COA PDF. Leave blank until PDF is available. |

The WordPress **post title** is a human-readable admin label only (e.g. "Pink Lemonade — Apr 2026") and is not rendered on the frontend.

**Ordering:** Batches are ordered newest-first by WordPress post date. Staff controls order by setting the published date when creating the entry.

---

## `lib/coa.ts`

Three exports:

**`FLAVOR_MAP`** — static record keyed by the exact flavor string staff types in WP. Each entry:
```ts
{
  displayName: string   // e.g. "Chill · Pink Lemonade"
  imageSlug: string     // maps to /public/products/gummies/{imageSlug}.png
  halo: string          // hex background color behind the thumbnail
}
```
Adding a new flavor requires: (1) a new entry here, (2) a corresponding image in `/public/products/gummies/`. This is the only file that needs a code change when a new flavor is introduced.

Keys in `FLAVOR_MAP` are lowercase. Lookup normalizes the WP flavor value to lowercase before matching, so "Pink Lemonade", "pink lemonade", and "PINK LEMONADE" all resolve correctly. Flavors with no matching key are silently skipped — a WP typo won't break the page.

**`getCoaBatches()`** — fetches all `coa_batch` nodes from WPGraphQL, ordered by date descending. Requests `flavor`, `batchNumber`, `pdfUrl`. Revalidates on `WP_COA_REVALIDATE_SECONDS` env var (defaults to 300 seconds).

**`groupBatchesByFlavor(batches)`** — groups the flat batch array into:
```ts
{ flavor: string; meta: FlavorMeta; batches: CoaBatch[] }[]
```
Flavors appear in the order they first appear in the WP response. Unknown flavors are dropped.

---

## `app/coa/page.tsx`

- Becomes `async`, calls `getCoaBatches()` then `groupBatchesByFlavor()`
- Deletes all hardcoded `PRODUCTS` and `COA_BATCHES` constants
- Thumbnail `<Image>` src: `/products/gummies/{meta.imageSlug}.png`
- Layout, styling, and responsive behaviour are unchanged

---

## `app/coa/components/ViewReportButton.tsx`

- Renamed/repurposed to an `<a>` tag with `target="_blank" rel="noopener noreferrer"`
- Receives `pdfUrl: string` prop
- Only rendered when `pdfUrl` is non-empty — batches without a PDF show only the batch number

---

## Environment Variables

```
WP_COA_REVALIDATE_SECONDS=300
```

Added to `.env` alongside the existing WP revalidation vars.

---

## Out of Scope

- Search/filter UI (hidden in original design, omitted per YAGNI)
- Non-gummies product lines
- ACF Pro / repeater fields
- PDF upload via WordPress media library (staff links to externally hosted PDFs)
