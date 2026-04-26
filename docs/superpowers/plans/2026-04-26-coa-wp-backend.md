# COA WordPress Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hardcoded COA batch data in `app/coa/page.tsx` with live data fetched from a WordPress `coa_batch` custom post type, so staff can add, edit, and delete entries without a code deploy.

**Architecture:** A new `lib/coa.ts` module owns all data-fetching and flavor mapping. The page becomes an async server component that calls `getCoaBatches()` and `groupBatchesByFlavor()`. `ViewReportButton` becomes a plain `<a>` tag that only renders when a PDF URL is present.

**Tech Stack:** WordPress + ACF (free) + WPGraphQL + WPGraphQL for ACF (free plugin), Next.js App Router server components, ISR via `next.revalidate`.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `lib/coa.ts` | Types, `FLAVOR_MAP`, `getCoaBatches()`, `groupBatchesByFlavor()` |
| Modify | `app/coa/page.tsx` | Async server component — remove hardcoded data, render from WP |
| Modify | `app/coa/components/ViewReportButton.tsx` | `<a target="_blank">` link, only rendered when pdfUrl is non-empty |
| Modify | `.env` | Add `WP_COA_REVALIDATE_SECONDS=300` |

---

## Task 1: WordPress — Register the CPT and ACF fields

> This task is done entirely in the WordPress admin. No Next.js code changes.

- [ ] **Step 1: Install CPT UI plugin (if not already installed)**

  In WP Admin → Plugins → Add New, search for "Custom Post Type UI" and activate it.

- [ ] **Step 2: Register the `coa_batch` CPT**

  WP Admin → CPT UI → Add/Edit Post Types:
  - Post Type Slug: `coa_batch`
  - Plural Label: `COA Batches`
  - Singular Label: `COA Batch`
  - Under "Settings": set **Show in GraphQL** to `true`, **GraphQL Single Name** to `coaBatch`, **GraphQL Plural Name** to `coaBatches`

- [ ] **Step 3: Install ACF (free) if not already active**

  WP Admin → Plugins → Add New, search "Advanced Custom Fields" (by WP Engine), activate it.

- [ ] **Step 4: Create the ACF field group**

  WP Admin → Custom Fields → Add New:
  - Field Group Title: `COA Batch Fields`
  - Add three fields:

  | Field Label | Field Name | Field Type | Notes |
  |-------------|------------|------------|-------|
  | Flavor | `flavor` | Text | Required |
  | Batch Number | `batch_number` | Text | Required |
  | PDF URL | `pdf_url` | URL | Optional |

  - Location rule: Post Type **is equal to** `coa_batch`
  - Under "Settings": enable **Show in GraphQL**, set **GraphQL Field Name** to `coaBatchFields`

- [ ] **Step 5: Install WPGraphQL for ACF (free)**

  WP Admin → Plugins → Add New, search "WPGraphQL for ACF", activate it.
  This plugin exposes ACF field groups automatically in the WPGraphQL schema.

- [ ] **Step 6: Verify the GraphQL schema**

  WP Admin → GraphQL → GraphiQL IDE, run:

  ```graphql
  query {
    coaBatches(first: 5, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        title
        coaBatchFields {
          flavor
          batchNumber
          pdfUrl
        }
      }
    }
  }
  ```

  Expected: a JSON response with `data.coaBatches.nodes` as an array (may be empty if no entries exist yet — that's fine). If the query errors, check that CPT UI has **Show in GraphQL** enabled and that WPGraphQL for ACF is active.

- [ ] **Step 7: Add a few test entries**

  WP Admin → COA Batches → Add New. Create 2–3 entries with different flavors (e.g. "Pink Lemonade", "pineapple", "PEACH") to cover the case-insensitive matching later. Leave PDF URL blank on one entry. Set the post title to something human-readable (e.g. "Pink Lemonade — Apr 2026").

---

## Task 2: Add env var

- [ ] **Step 1: Add `WP_COA_REVALIDATE_SECONDS` to `.env`**

  Open `.env` in the project root. After the existing revalidation vars, add:

  ```
  WP_COA_REVALIDATE_SECONDS=300
  ```

  The file should now look like:
  ```
  WP_REVALIDATE_SECONDS=300
  WP_HOME_REVALIDATE_SECONDS=300
  WP_SHOP_REVALIDATE_SECONDS=300
  WP_COA_REVALIDATE_SECONDS=300
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add .env
  git commit -m "Add WP_COA_REVALIDATE_SECONDS env var"
  ```

---

## Task 3: Create `lib/coa.ts`

- [ ] **Step 1: Create the file**

  Create `lib/coa.ts` with the following content:

  ```typescript
  import { getWPData } from "./wp";

  // ---------------------------------------------------------------------------
  // Types
  // ---------------------------------------------------------------------------

  export interface CoaBatch {
    flavor: string;
    batchNumber: string;
    pdfUrl: string | null;
  }

  export interface FlavorMeta {
    displayName: string;
    imageSlug: string;
    halo: string;
  }

  export interface CoaGroup {
    flavor: string;
    meta: FlavorMeta;
    batches: CoaBatch[];
  }

  // ---------------------------------------------------------------------------
  // Flavor map — keys must be lowercase
  // Adding a new flavor requires: (1) a new entry here, (2) a matching image
  // at /public/products/gummies/{imageSlug}.png
  // ---------------------------------------------------------------------------

  export const FLAVOR_MAP: Record<string, FlavorMeta> = {
    "pink lemonade":  { displayName: "Chill · Pink Lemonade", imageSlug: "chill-pink-lemonade", halo: "#f9d7e0" },
    "blackberry":     { displayName: "Sleep · Blackberry",    imageSlug: "sleep-blackberry",    halo: "#cedff7" },
    "passion fruit":  { displayName: "Passion Fruit",         imageSlug: "passion-fruit",       halo: "#d9c7ea" },
    "pineapple":      { displayName: "Pineapple",             imageSlug: "pineapple",           halo: "#f2e7b8" },
    "tropical mix":   { displayName: "Tropical Mix",          imageSlug: "tropical-mix",        halo: "#e8d8f0" },
    "peach":          { displayName: "Peach",                 imageSlug: "peach",               halo: "#fad4bf" },
  };

  // ---------------------------------------------------------------------------
  // Revalidation
  // ---------------------------------------------------------------------------

  const COA_REVALIDATE_SECONDS = Number(
    process.env.WP_COA_REVALIDATE_SECONDS ?? "300"
  );

  // ---------------------------------------------------------------------------
  // GraphQL
  // ---------------------------------------------------------------------------

  const GET_COA_BATCHES_QUERY = `
    query GetCoaBatches {
      coaBatches(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          coaBatchFields {
            flavor
            batchNumber
            pdfUrl
          }
        }
      }
    }
  `;

  // ---------------------------------------------------------------------------
  // getCoaBatches — fetch all batches from WP, newest first
  // ---------------------------------------------------------------------------

  export async function getCoaBatches(): Promise<CoaBatch[]> {
    const data = await getWPData(
      GET_COA_BATCHES_QUERY,
      {},
      { revalidateSeconds: COA_REVALIDATE_SECONDS }
    );

    const nodes: any[] = data?.coaBatches?.nodes ?? [];
    return nodes.map((node: any) => ({
      flavor:      node.coaBatchFields?.flavor      ?? "",
      batchNumber: node.coaBatchFields?.batchNumber ?? "",
      pdfUrl:      node.coaBatchFields?.pdfUrl      || null,
    }));
  }

  // ---------------------------------------------------------------------------
  // groupBatchesByFlavor — group flat batch list into per-flavor sections
  // Lookup is case-insensitive. Batches with unrecognised flavors are dropped.
  // ---------------------------------------------------------------------------

  export function groupBatchesByFlavor(batches: CoaBatch[]): CoaGroup[] {
    const groups = new Map<string, CoaGroup>();

    for (const batch of batches) {
      const key = batch.flavor.toLowerCase();
      const meta = FLAVOR_MAP[key];
      if (!meta) continue;

      if (!groups.has(key)) {
        groups.set(key, { flavor: batch.flavor, meta, batches: [] });
      }
      groups.get(key)!.batches.push(batch);
    }

    return Array.from(groups.values());
  }
  ```

- [ ] **Step 2: Type-check**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no output (clean).

- [ ] **Step 3: Commit**

  ```bash
  git add lib/coa.ts
  git commit -m "Add lib/coa.ts with WP data fetching and flavor map"
  ```

---

## Task 4: Update `ViewReportButton`

- [ ] **Step 1: Replace the file contents**

  Replace `app/coa/components/ViewReportButton.tsx` with:

  ```typescript
  interface Props {
    pdfUrl: string;
  }

  export default function ViewReportButton({ pdfUrl }: Props) {
    return (
      <a
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex gap-2 items-center bg-dark-green text-light-gold px-[18px] py-[10px] rounded-full text-[13px] font-semibold transition-all duration-200 hover:bg-light-gold hover:text-dark-green max-sm:px-[14px] max-sm:py-2 max-sm:text-[12px]"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3v13" />
          <path d="m7 11 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
        View Report
      </a>
    );
  }
  ```

  Note: the `"use client"` directive is removed — this is now a plain server component since it has no interactivity.

- [ ] **Step 2: Type-check**

  ```bash
  npx tsc --noEmit
  ```

  Expected: error on `app/coa/page.tsx` — it still passes `batch` (string) to `ViewReportButton` instead of `pdfUrl`. That's expected and will be fixed in Task 5.

- [ ] **Step 3: Commit**

  ```bash
  git add app/coa/components/ViewReportButton.tsx
  git commit -m "Refactor ViewReportButton to <a> link opening PDF in new tab"
  ```

---

## Task 5: Update `app/coa/page.tsx`

- [ ] **Step 1: Replace the file contents**

  Replace `app/coa/page.tsx` with:

  ```typescript
  import type { Metadata } from "next";
  import Image from "next/image";
  import { getCoaBatches, groupBatchesByFlavor } from "@/lib/coa";
  import ViewReportButton from "./components/ViewReportButton";

  export const metadata: Metadata = {
    title: "Certificates of Analysis",
    description:
      "Every Sweetleaves batch is independently tested by an ISO-accredited third-party lab for potency, residual solvents, pesticides, heavy metals, and microbials.",
    alternates: { canonical: "/coa" },
  };

  export default async function CoaPage() {
    const batches = await getCoaBatches();
    const groups = groupBatchesByFlavor(batches);

    return (
      <div className="font-poppins">
        {/* Hero */}
        <section className="text-center pt-[70px] pb-[40px] px-5 max-w-[880px] mx-auto">
          <div className="text-[13px] tracking-[0.14em] uppercase text-dark-sage font-semibold">
            Lab Results
          </div>
          <h1 className="font-poppins-bold text-[44px] sm:text-[55px] lg:text-[66px] text-dark-green leading-[0.95] mt-[10px] mb-5">
            Certificates of Analysis
          </h1>
          <p className="text-[16px] leading-[1.55] text-dark-sage max-w-[680px] mx-auto mb-[30px]">
            Every Sweetleaves batch is independently tested by an ISO-accredited
            third-party lab for potency, residual solvents, pesticides, heavy
            metals, and microbials. Find your batch below by product SKU.
          </p>
        </section>

        {/* Product list */}
        <section className="max-w-[1100px] mx-auto px-5 pt-5 pb-10 flex flex-col gap-[18px]">
          {groups.map((group) => (
            <div
              key={group.flavor}
              className="bg-white rounded-3xl overflow-hidden border border-dark-green/[0.08]"
            >
              {/* Product header */}
              <div className="grid grid-cols-[72px_1fr] gap-[18px] items-center px-6 py-5 border-b border-dark-green/10 max-sm:grid-cols-[56px_1fr]">
                <div
                  className="w-[72px] h-[72px] rounded-2xl grid place-items-center overflow-hidden shrink-0 max-sm:w-[56px] max-sm:h-[56px]"
                  style={{ background: group.meta.halo }}
                >
                  <Image
                    src={`/products/gummies/${group.meta.imageSlug}.png`}
                    alt={group.meta.displayName}
                    width={72}
                    height={72}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-2xl font-bold text-dark-green leading-[1.1]">
                  {group.meta.displayName}
                </div>
              </div>

              {/* Batch rows */}
              <div className="flex flex-col">
                {group.batches.map((batch, i) => (
                  <div
                    key={batch.batchNumber}
                    className={`flex justify-between items-center px-6 py-[18px] max-sm:px-[18px] max-sm:py-[14px]${
                      i < group.batches.length - 1
                        ? " border-b border-dark-green/[0.08]"
                        : ""
                    }`}
                  >
                    <div className="text-[14px] text-dark-sage max-sm:text-[13px]">
                      Batch{" "}
                      <span className="font-mono text-[15px] text-dark-green font-semibold ml-1.5">
                        {batch.batchNumber}
                      </span>
                    </div>
                    {batch.pdfUrl && <ViewReportButton pdfUrl={batch.pdfUrl} />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Footer note */}
        <section className="max-w-[880px] mx-auto mt-[30px] mb-[80px] px-5">
          <div className="bg-dark-green text-white rounded-[28px] px-10 py-9">
            <h3 className="font-poppins-bold text-[22px] text-light-gold mb-2.5">
              Why we test every batch
            </h3>
            <p className="text-[14px] leading-[1.55] opacity-[0.88]">
              Because you deserve to know what you&apos;re putting in your body.
              Our COAs confirm cannabinoid content within ±10% of label and
              screen for 60+ contaminants. Can&apos;t find the batch on your
              bag? Email{" "}
              <a
                href="mailto:info@sweetleavesnorthloop.com"
                className="text-light-gold underline"
              >
                info@sweetleavesnorthloop.com
              </a>{" "}
              with the lot number and we&apos;ll send the report directly.
            </p>
          </div>
        </section>
      </div>
    );
  }
  ```

- [ ] **Step 2: Type-check**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no output (clean).

- [ ] **Step 3: Build check**

  ```bash
  npm run build 2>&1 | tail -20
  ```

  Expected: `/coa` appears in the route list with no errors.

- [ ] **Step 4: Commit**

  ```bash
  git add app/coa/page.tsx
  git commit -m "Wire COA page to WordPress — fetch batches via WPGraphQL"
  ```

---

## Task 6: Manual verification

Once the WordPress CPT entries from Task 1 Step 7 are in place:

- [ ] **Step 1: Start dev server**

  ```bash
  npm run dev
  ```

- [ ] **Step 2: Check the page renders WP data**

  Open `http://localhost:3000/coa`. Verify:
  - Products shown match the WP entries created in Task 1
  - Flavors typed in mixed case (e.g. "PEACH", "pineapple") resolve correctly to their display name and image
  - Batches with a PDF URL show the "View Report" link; batches without do not
  - Clicking "View Report" opens the PDF URL in a new tab

- [ ] **Step 3: Test adding a new batch in WP**

  In WP Admin → COA Batches → Add New, add a new entry for an existing flavor. Hard-refresh `http://localhost:3000/coa` after 5 minutes (ISR window) or restart the dev server to see it immediately.

- [ ] **Step 4: Test deleting a batch in WP**

  Trash an entry in WP Admin. Confirm it disappears from the page after the ISR window.
