---
applyTo: '**'
---

# Sweetleaves Web App — Design Doc

## 0) TL;DR

A fast, SEO-friendly Next.js site powered by a headless WordPress (WPGraphQL) CMS, embedding or reverse-proxying Dutchie for e‑commerce, and integrating AlpineIQ for loyalty/analytics. Priorities: **simplicity**, **performance**, **stability**, **clear ownership boundaries**.

---

## 1) Goals

1. **Performance-first** marketing site (Core Web Vitals, fast TTFB/LCP, minimal JS).
2. **SEO-friendly** pages with clean metadata, SSR/SSG where appropriate.
3. Content managed in **WordPress** with a small set of reusable page models (ACF fields exposed via WPGraphQL).
4. E-commerce powered by **Dutchie** with minimal custom logic.
5. Loyalty/marketing instrumentation via **AlpineIQ** (track key events without bloating the app).
6. Clear upgrade path: handle new promo sections, new page templates, new Dutchie capabilities without rewrites.

## 2) Non-goals

* Building a custom cart/checkout (Dutchie owns it).
* Building a custom CMS.
* Storing PII beyond what Dutchie/AlpineIQ already handle.
* Perfect offline support or complex client-side state.

---

## 3) Tech Stack

### Frontend

* **Next.js (App Router)** + TypeScript
* Tailwind (or site’s existing styling system)
* Server Components by default; Client Components only where necessary

### CMS

* WordPress (headless)
* **WPGraphQL** as the content API
* **ACF** (or similar) for structured fields

### E-commerce

* **Dutchie**

  * Current: embedded menu/checkout (iframe)
  * Future: Dutchie Pro “reverse proxy” option (preferred for SEO/control)

### Loyalty / Analytics

* **AlpineIQ**

  * Track user actions (e.g., view menu, join loyalty, click promos)
  * Keep the integration minimal and isolated

---

## 4) High-level Architecture

### 4.1 Components

1. **Next.js App**

   * Renders marketing pages and any content pages
   * Hosts the Age Gate and global site shell
   * Integrates Dutchie and AlpineIQ

2. **WordPress (CMS)**

   * Authors create/edit pages and structured fields
   * WPGraphQL exposes only required content

3. **Dutchie (Commerce)**

   * Owns product catalog, menu, cart, checkout
   * Embedded UI or reverse-proxied pages

4. **AlpineIQ (Loyalty/Marketing)**

   * Receives event tracking and attribution

### 4.2 Ownership Boundaries (important)

* **WordPress** owns: marketing content, page structure inputs, promos, store info, FAQs.
* **Next.js** owns: performance, layout, routing, SEO tags, caching strategy.
* **Dutchie** owns: commerce UX, inventory, pricing, cart/checkout, compliance flows.
* **AlpineIQ** owns: loyalty actions, marketing analytics/segments.

---

## 5) Rendering Strategy (Performance Best Practices)

### 5.1 Default Render Mode

* Prefer **SSG/ISR** for most CMS pages (fast, cacheable, reliable).
* Use **SSR** only where content must be truly dynamic per-request.

### 5.2 Caching

* For WPGraphQL:

  * Use Next.js `fetch` caching + `revalidate` for ISR.
  * Use webhook-based revalidation (ideal): WP triggers revalidate on publish/update.
* For Dutchie:

  * If iframe: treat as third-party embed; minimize surrounding JS.
  * If reverse proxy: cache aggressively at CDN edge; only bypass cache where required.

### 5.3 Client JS Budget

* Aim for minimal client JS:

  * Server Components for pages
  * Client Components only for: Age Gate, mobile nav toggle, small interactive widgets
* Avoid heavy UI libs unless already required.

### 5.4 Images

* Use `next/image` for all local/known remote images.
* Provide explicit sizes, use modern formats, keep hero images optimized.
* Lazy-load below-the-fold.

---

## 6) Content Modeling (WP)

### 6.1 Page Types

Keep it small and composable.

* **Standard Page**: title, hero, rich text, optional sections
* **Home**: curated modules (hero, promos, featured categories, store highlights)
* **Promotions**: promo list items with start/end dates, CTA, optional image
* **Store Info**: hours, location, contact, parking info

### 6.2 ACF Field Rules

* Prefer **structured fields** over big HTML blobs.
* Only add fields when the UI needs true structure (e.g., promo tiles, multi-CTA).
* Avoid per-page unique schema. Favor reusable section components.

### 6.3 WPGraphQL Contract

* Keep a stable query layer in Next.js:

  * A single “getPageBySlug” query
  * Modular fragments for section types
  * Map each section type → a Next.js component

---

## 7) Dutchie Integration

### Option A — Iframe (Simple, fastest to ship)

* Dedicated `/menu` route in Next.js that renders:

  * Site chrome (header/footer)
  * A responsive iframe container
* Performance notes:

  * Avoid extra scripts on the menu page
  * Defer non-critical tracking

### Option B — Reverse Proxy (Preferred long-term)

* Dutchie content served under the site domain path (better control + potentially better SEO).
* Requirements:

  * Ensure caching/CDN rules are correct
  * Confirm how Dutchie handles auth/session/cookies under proxy
* Design principle:

  * Still keep Dutchie UI “owned” by Dutchie; don’t fork it.

---

## 8) AlpineIQ Integration

### 8.1 What we track (minimal set)

* Page views (site-wide)
* CTA clicks (promos, join loyalty, menu clicks)
* Menu entry events (enter menu page)
* Loyalty join click-through

### 8.2 Implementation rules

* One isolated analytics module:

  * `lib/analytics/alpineiq.ts`
  * Provides `track(eventName, payload)`
* Load AlpineIQ script **deferred** and only once.
* Never block rendering on analytics.

---

## 9) SEO & Metadata

* Use per-page SEO fields from WP:

  * title, meta description, OG image
* Generate:

  * canonical URLs
  * OpenGraph and Twitter card tags
* Ensure clean indexability:

  * marketing pages indexable
  * avoid indexing duplicate Dutchie paths (depends on integration mode)

---

## 10) Compliance & Safety

* **21+ Age Gate** required site-wide before content is visible.
* No cannabis content should be visible prior to consent.
* Age gate TTL is configurable.

---

## 11) Error Handling

* CMS outages should degrade gracefully:

  * Render a friendly error page or fallback cached content
* WPGraphQL errors should be logged with request context.

---

## 12) Deployment & Environments

* Environments: `dev`, `staging`, `prod`
* Env vars:

  * `WP_GRAPHQL_ENDPOINT`
  * `NEXT_PUBLIC_AGE_GATE_TTL_HOURS`
  * (Optional) `NEXT_PUBLIC_ALPINEIQ_*`
  * Dutchie config keys as needed
* Use a CDN in front of Next.js if not already (Vercel edge caching, etc.).

---

## 13) Performance Acceptance Criteria

* Lighthouse (mobile) targets:

  * LCP < 2.5s (on key marketing pages)
  * CLS minimal
  * JS bundle small; avoid large client frameworks
* Menu page:

  * fast shell render; iframe loads independently

---

## 14) Implementation Plan (Simple)

1. Foundation: Next.js app shell, routing, global SEO, age gate.
2. CMS integration: WPGraphQL page fetch + 2–3 page templates.
3. Promo modules + structured fields.
4. Dutchie menu route (iframe first).
5. AlpineIQ minimal event tracking.
6. Hardening: caching, revalidation hooks, monitoring.

---

## 15) Open Questions (track as decisions)

* Dutchie Pro reverse proxy: timeline, requirements, SEO implications.
* Which pages are indexable vs noindex.
* Hosting details (Vercel/WP Engine/etc.) and revalidation webhook support.
