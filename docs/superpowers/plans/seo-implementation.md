# SEO Implementation Tracker

Source: `seo-checklist.xlsx` (root of repo). This document is self-contained — a subagent should be able to pick up any workstream without re-reading the spreadsheet.

Production domain: `https://sweetleavesnorthloop.com`

Five workstreams below. Each has acceptance criteria, file paths, and full data. Update the checkbox columns and the "Status" line of each section as work lands.

---

## Workstream 1 — Infrastructure (redirects, robots, sitemap, GTM)

**Status:** Not started
**Owner:** unassigned
**Depends on:** nothing (do first)

### 1a. Redirects

Add a `redirects()` function to `next.config.ts` returning the list below. Strip the domain — Next.js `source` is path-only. Trailing slash handling: keep as written; Next.js matches them literally.

- Default: `permanent: true` (308)
- Marked `302`: `permanent: false` (307)

| Source path | Destination path | Permanent? |
|---|---|---|
| `/in-store-shopping/` | `/` | true |
| `/press/` | `/blog/` | true |
| `/author/sweetleavesadmin/` | `/` | true |
| `/cannabis-101/` | `/blog/` | true |
| `/cannabis-seeds/` | `/shop-now/` | true |
| `/cbd/` | `/shop-now/` | true |
| `/edina-mn/` | `/` | true |
| `/higher-education/` | `/blog/` | true |
| `/higher-love/` | `/blog/` | true |
| `/location/minneapolis/` | `/` | **false (302)** |
| `/minh-le-studio/` | `/shop-now/` | true |
| `/minneapolis-mn/` | `/` | **false (302)** |
| `/minnetonka-mn/` | `/` | **false (302)** |
| `/premium-cannabis-dispensary-edina-mn/` | `/` | true |
| `/premium-cannabis-dispensary-minneapolis-mn/` | `/` | **false (302)** |
| `/premium-cannabis-dispensary-minnetonka-mn/` | `/` | **false (302)** |
| `/premium-cannabis-dispensary-st-louis-park-mn/` | `/` | true |
| `/premium-cannabis-dispensary-st-paul-mn/` | `/` | true |
| `/recreational-cannabis/` | `/shop-now/` | true |
| `/richfield-mn/` | `/` | true |
| `/session-goods/` | `/shop-now/` | true |
| `/st-louis-park-mn/` | `/` | true |
| `/st-paul-mn/` | `/` | true |
| `/birchs-on-the-lake/` | `/brands/birchs-on-the-lake/` | true |
| `/blncd/` | `/` | true |
| `/cann/` | `/` | true |
| `/clrty/` | `/` | true |
| `/dogwalkers/` | `/brands/dogwalkers/` | true |
| `/find-wunder/` | `/` | true |
| `/gigli/` | `/brands/gigli/` | true |
| `/good-green/` | `/brands/good-green/` | true |
| `/grasslandz/` | `/brands/grasslandz/` | true |
| `/lakeside-cannabis-co/` | `/brands/lakeside-cannabis-co/` | true |
| `/mary-jane/` | `/brands/mary-jane/` | true |
| `/nebula/` | `/brands/nebula/` | true |
| `/nowadays/` | `/brands/nowadays/` | true |
| `/oliphant-brewing/` | `/brands/oliphant-brewing/` | true |
| `/ongrok/` | `/` | true |
| `/raw/` | `/` | true |
| `/rythm/` | `/brands/rythm/` | true |
| `/studio-tbd/` | `/` | true |
| `/sweetleaves/` | `/brands/sweetleaves/` | true |
| `/wild-state-cider-birdie/` | `/brands/wild-state-cider-birdie/` | true |
| `/wyld/` | `/brands/wyld/` | true |
| `/cannabis-accessories/` | `/` | true |
| `/cannabis-beverages/` | `/products/cannabis-beverages/` | true |
| `/disposable-vapes-and-carts/` | `/products/disposable-vapes-and-carts/` | true |
| `/edibles/` | `/products/edibles/` | true |
| `/flower/` | `/products/flower/` | true |
| `/pre-rolls/` | `/products/pre-rolls/` | true |

**Acceptance:** `curl -I` against each source path on a local build returns the expected 308/307 with the correct `Location` header.

- [ ] Redirects added to `next.config.ts`
- [ ] Verified locally

### 1b. robots.txt

Create `app/robots.ts` (Next.js metadata route):

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://sweetleavesnorthloop.com/sitemap.xml",
  };
}
```

Note: spreadsheet specifies `sitemap_index.xml`. Next.js convention is `sitemap.xml`. If split sitemaps are required, generate multiple and use a sitemap index — defer that decision to workstream 1c.

- [ ] Created `app/robots.ts`
- [ ] Verified `/robots.txt` serves expected content

### 1c. XML sitemap

Create `app/sitemap.ts` listing every static route plus dynamic brand and product slugs (pulled from `lib/brands.ts` — confirm path and add a similar `lib/products.ts` lookup if one exists). Exclude `/quick-links/` (noindex per checklist).

Routes to include (all under `https://sweetleavesnorthloop.com`):
- `/`, `/about-us/`, `/contact/`, `/careers/`, `/events/`, `/faqs/`, `/loyalty/`, `/online-ordering-in-store-pickup/`, `/wholesale-inquiry/`, `/shop-now/`, `/certificate-of-analysis/`, `/blog/`
- All `/brands/[slug]/` from `lib/brands.ts`
- All `/products/[slug]/` (slugs: `cannabis-beverages`, `disposable-vapes-and-carts`, `edibles`, `flower`, `concentrates`, `pre-rolls`)
- Blog posts: `/cannabis-101-understanding-thc-cbd-and-more/`, `/minnesota-cannabis-laws/`

If/when a headless CMS feed is wired, switch the blog list to a fetch.

- [ ] Created `app/sitemap.ts`
- [ ] Verified `/sitemap.xml` includes all expected URLs

### 1d. GTM

Add Google Tag Manager (`GTM-KW2H37S6`) to `app/layout.tsx` using `next/script`:

- `<Script id="gtm" strategy="afterInteractive">` in `<head>` with the standard GTM init snippet
- `<noscript><iframe ...></iframe></noscript>` immediately after `<body>`

Reference snippet (from spreadsheet):
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-KW2H37S6');</script>
<!-- noscript -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KW2H37S6" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
```

Coordinate with existing analytics in `app/components/AlpineIQProvider.tsx` and `PageViewTracker.tsx` to avoid duplicate page-view events.

- [ ] GTM head script added
- [ ] GTM noscript iframe added
- [ ] Verified in browser devtools that `dataLayer` initializes

---

## Workstream 2 — URL alignment

**Status:** Not started
**Owner:** unassigned
**Depends on:** decision from Noah on each mismatch below

Spreadsheet canonical URLs vs. current app routes:

| Spreadsheet URL | Current app route | Action |
|---|---|---|
| `/about-us/` | `app/about-us/` | ✓ matches |
| `/faqs/` | `app/faq/` | **Rename** `app/faq` → `app/faqs`; add internal redirect `/faq` → `/faqs/` |
| `/shop-now/` | `app/shop/` | **Rename** `app/shop` → `app/shop-now`; add internal redirect `/shop` → `/shop-now/` |
| `/loyalty/` | `app/loyalty/` | ✓ matches (note: `public/rewards/` directory is unrelated assets) |
| `/certificate-of-analysis/` | `app/certificate-of-analysis/` | ✓ matches |

Trailing slashes: spreadsheet uses trailing slashes. Decide globally — either set `trailingSlash: true` in `next.config.ts` (matches spreadsheet, simplifies canonicals) or leave default and use canonical metadata to assert no-trailing-slash. **Recommend `trailingSlash: true`** to match spreadsheet without further work.

- [ ] Decision recorded on `trailingSlash`
- [ ] `app/faq` → `app/faqs` rename + redirect
- [ ] `app/shop` → `app/shop-now` rename + redirect
- [ ] All internal `<Link href>` references updated to new paths

---

## Workstream 3 — Missing pages (templates not built)

**Status:** Not started
**Owner:** unassigned
**Depends on:** workstream 2 URL decisions

Each item below is a separate page to build. Pages marked "post-launch" can be deferred but should be tracked. Quick Links must be `noindex` (use `robots: { index: false }` in `generateMetadata`).

| Route | Page Type | Priority | Notes |
|---|---|---|---|
| `/contact/` | Contact | launch | Build template + content. Title: `Contact - Sweetleaves` |
| `/careers/` | Careers | launch | Build template + content. Title: `Careers - Sweetleaves` |
| `/quick-links/` | Quick Links | launch | New landing page mirroring site UI; **noindex**; for QR-code access |
| `/blog/` | Blog index | launch | Build index. Title: `Blog - Sweetleaves` |
| `/cannabis-101-understanding-thc-cbd-and-more/` | Blog post | launch | Template exists, content not implemented. Title + description in workstream 4 table |
| `/minnesota-cannabis-laws/` | Blog post | launch | Template exists, content not implemented. **2026 update** with hemp-derived regulation + disclaimer |
| `/certificate-of-analysis/` | COA | launch | In progress (recent commits). Confirm complete |
| `/online-ordering-in-store-pickup/` | Online Ordering | post-launch | Open question (Adam): may collapse into About page |
| `/wholesale-inquiry/` | Wholesale | post-launch | Build template + content |

Blog post URL structure may need revisiting — spreadsheet notes "Review URL structure after implementation; may need to adjust redirects and sitemap." If posts move to `/blog/[slug]/`, add redirects from the flat URLs.

- [ ] `/contact/`
- [ ] `/careers/`
- [ ] `/quick-links/` (noindex)
- [ ] `/blog/`
- [ ] `/cannabis-101-understanding-thc-cbd-and-more/`
- [ ] `/minnesota-cannabis-laws/`
- [ ] `/certificate-of-analysis/` (verify)
- [ ] `/online-ordering-in-store-pickup/` (post-launch)
- [ ] `/wholesale-inquiry/` (post-launch)

---

## Workstream 4 — Per-page metadata

**Status:** Not started
**Owner:** unassigned
**Depends on:** workstream 2 (final URLs)

Set `title` and `description` via `generateMetadata` (or static `metadata`) on each route. Brand and product slug pages already have `generateMetadata` wired ([app/brands/[slug]/page.tsx](app/brands/[slug]/page.tsx)) — verify the values in `lib/brands.ts` and the products lookup match the table below exactly.

For rows where Title or Description is missing in the spreadsheet, mark as **TBD** and ask Noah before shipping.

### Static pages

| Route | Title | Description |
|---|---|---|
| `/` | `Recreational Cannabis Dispensary in Minneapolis, MN \| Sweetleaves` | `Redefine your recreational cannabis at Sweetleaves, your trusted dispensary in Minneapolis, Minnesota. Shop quality products for all your cannabis needs.` |
| `/about-us/` | `About Us - Sweetleaves` | **TBD** |
| `/contact/` | `Contact - Sweetleaves` | **TBD** |
| `/careers/` | `Careers - Sweetleaves` | **TBD** |
| `/events/` | `Events - Sweetleaves` | **TBD** |
| `/faqs/` | `FAQs - Sweetleaves` | **TBD** |
| `/loyalty/` | `Loyalty - Sweetleaves` | **TBD** |
| `/online-ordering-in-store-pickup/` | `Order Cannabis Online in Minneapolis, Minnesota \| Sweetleaves` | `Order cannabis online and pick up curbside at Sweetleaves in Minneapolis, MN. Enjoy a convenient and quick online shopping experience.` |
| `/wholesale-inquiry/` | `Wholesale Inquiry - Sweetleaves` | **TBD** |
| `/shop-now/` | `Shop Now - Sweetleaves` | **TBD** |
| `/quick-links/` | (noindex; see Content Doc) | (noindex) |
| `/certificate-of-analysis/` | (see Content Doc) | (see Content Doc) |
| `/blog/` | `Blog - Sweetleaves` | **TBD** |

### Blog posts

| Route | Title | Description |
|---|---|---|
| `/cannabis-101-understanding-thc-cbd-and-more/` | `Cannabis 101: Understanding THC, CBD, and More \| Sweetleaves` | `Discover the essentials of cannabis in Minnesota with this beginner-friendly guide. Learn about THC, CBD, CBG, strains, consumption methods, and tips for a safe and informed experience.` |
| `/minnesota-cannabis-laws/` | `Minnesota Cannabis Laws in 2026 \| Sweetleaves` | `Explore Minnesota cannabis laws in 2026, including possession, home cultivation, purchase limits, and Minneapolis regulations for responsible adult use.` |

### Brand pages (`/brands/[slug]/`)

| Slug | Title | Description |
|---|---|---|
| `birchs-on-the-lake` | `Birch's on the Lake \| Edibles & THC Drinks in Minneapolis MN \| Sweetleaves` | `Birch's on the Lake brings healing THC edibles and drinks to Sweetleaves in Minneapolis, MN. Enjoy thoughtful, handcrafted products from Long Lake, Minnesota.` |
| `dogwalkers` | `Dogwalkers \| Pre-Rolls in Minneapolis MN \| Sweetleaves` | `Find Dogwalkers at Sweetleaves in Minneapolis. Quality pre-rolls crafted from premium flower that helps support animal rescue.` |
| `gigli` | `Gigli Cannabis Products \| Sweetleaves` | `Shop Gigli cannabis products for a premium experience. Explore our selection of high-quality products for ultimate relaxation.` |
| `good-green` | `Good Green \| Flower in Minneapolis MN \| Sweetleaves` | `Explore Good Green flower at Sweetleaves in Minneapolis. Premium cannabis with reliable quality and a mission to support communities in need.` |
| `grasslandz` | `Grasslandz \| Vapes in Minneapolis MN \| Sweetleaves` | `Explore Grasslandz cartridges at Sweetleaves in Minneapolis. Sun-grown, regenerative cannabis crafted with care, quality, and intention.` |
| `lakeside-cannabis-co` | `Lakeside Cannabis Co. \| Vapes in Minneapolis MN \| Sweetleaves` | `Explore Lakeside Cannabis Co. cartridges and disposables at Sweetleaves in Minneapolis. Easygoing, high-quality vapes crafted for relaxed moments.` |
| `mary-jane` | `Mary & Jane` | `Shop Mary & Jane cannabis products for a premium experience. Explore our selection of high-quality products for ultimate relaxation.` |
| `nebula` | `Nebula \| Vapes & Edibles in Minneapolis MN \| Sweetleaves` | `Explore Nebula cartridges and edibles at Sweetleaves in Minneapolis. Enjoy flavorful, and consistent cannabis experiences with Nebula.` |
| `nowadays` | `Nowadays Cannabis Products \| Sweetleaves` | `Shop Nowadays cannabis products for a premium experience. Explore our selection of high-quality products for ultimate relaxation.` |
| `oliphant-brewing` | `Oliphant Brewing \| THC Drinks in Minneapolis MN \| Sweetleaves` | `Try Oliphant Brewing THC drinks from Sweetleaves in Minneapolis, MN. Bold, creative beverages crafted by Wisconsin brewers, perfect for adventurous cannabis drinkers.` |
| `rythm` | `RYTHM \| Flower in Minneapolis MN \| Sweetleaves` | `Discover RYTHM flower at Sweetleaves in Minneapolis. Premium strains crafted to inspire, relax, and connect for every cannabis enthusiast.` |
| `sweetleaves` | `Sweetleaves Products \| Sweetleaves` | `Shop Sweetleaves cannabis products for Minneapolis, MN. Contact us today for more info about our cannabis products!` |
| `wild-state-cider-birdie` | `Birdie by Wild State Cider \| THC Drinks in Minneapolis MN \| Sweetleaves` | `Savor Wild State Cider's Birdie THC drinks from Sweetleaves in Minneapolis, MN. Made in Minnesota, these drinks offer a refreshing, flavorful cannabis experience.` |
| `wyld` | `WYLD \| Edibles in Minneapolis MN \| Sweetleaves` | `Shop WYLD edibles at Sweetleaves in Minneapolis, MN. Crafted with innovation and a commitment to sustainability, these edibles bring the science of cannabinoids to life.` |

### Product category pages (`/products/[slug]/`)

| Slug | Title | Description |
|---|---|---|
| `cannabis-beverages` | `THC Drinks in Minneapolis MN \| Sweetleaves` | `Refresh with THC-infused drinks from Sweetleaves in Minneapolis, MN. Enjoy cannabis in a flavorful and convenient beverage.` |
| `disposable-vapes-and-carts` | `Disposable Vapes & Carts in Minneapolis MN \| Sweetleaves` | `Sweetleaves in Minneapolis offers a curated selection of cannabis vapes and cartridges in a range of strains and potencies.` |
| `edibles` | `THC Edibles & Gummies in Minneapolis MN \| Sweetleaves` | `Shop THC edibles and gummies at Sweetleaves in Minneapolis, MN. Perfect for a simple and delicious cannabis experience.` |
| `flower` | `Flower in Minneapolis MN \| Sweetleaves` | `Explore premium Minnesota-grown flower at Sweetleaves in Minneapolis, offering a variety of strains and potencies for every individual.` |
| `concentrates` | `Concentrates in Minneapolis MN \| Sweetleaves` | `Looking for concentrates? Sweetleaves offers diverse strains and potencies to fit every preference. Visit us today.` |
| `pre-rolls` | `Pre-Rolls in Minneapolis MN \| Sweetleaves` | `Sweetleaves in Minneapolis has pre-rolls in a variety of strains and potencies. Stop in and find your favorite.` |

### Implementation notes
- Set `alternates.canonical` on every page to its own path.
- Every page must render exactly one `<h1>`. The spreadsheet leaves H1 blank for most rows — default to using the page Title (or its prefix before ` | `) as the H1 unless Noah specifies otherwise.
- Where spreadsheet shows `--`, defer to the Content Doc referenced in the row.

- [ ] Static pages updated
- [ ] Blog posts updated
- [ ] Brand pages verified against `lib/brands.ts`
- [ ] Product pages verified

---

## Workstream 5 — QA pass

**Status:** Not started
**Owner:** unassigned
**Depends on:** workstreams 1–4

For each row in the Sitemap Checklist, verify on a deployed (or local prod build) instance:

1. URL resolves with 200
2. `<title>` exactly matches spreadsheet
3. `<meta name="description">` exactly matches spreadsheet
4. Exactly one `<h1>` present
5. `<link rel="canonical">` points to the page's own canonical URL
6. Indexability correct (only `/quick-links/` should be noindex)
7. Internal links to the page use the canonical path (no broken `/faq/` etc.)

Track per-row in this table — flip the check when verified.

| URL | 200 | Title | Desc | H1 | Canonical | Index | Links |
|---|---|---|---|---|---|---|---|
| `/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/about-us/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/contact/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/careers/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/events/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/faqs/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/loyalty/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/online-ordering-in-store-pickup/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/wholesale-inquiry/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/shop-now/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/quick-links/` | ☐ | ☐ | ☐ | ☐ | ☐ | **noindex** | ☐ |
| `/certificate-of-analysis/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/blog/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/cannabis-101-understanding-thc-cbd-and-more/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/minnesota-cannabis-laws/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/brands/birchs-on-the-lake/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/brands/dogwalkers/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/brands/gigli/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/brands/good-green/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/brands/grasslandz/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/brands/lakeside-cannabis-co/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/brands/mary-jane/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/brands/nebula/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/brands/nowadays/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/brands/oliphant-brewing/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/brands/rythm/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/brands/sweetleaves/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/brands/wild-state-cider-birdie/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/brands/wyld/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/products/cannabis-beverages/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/products/disposable-vapes-and-carts/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/products/edibles/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/products/flower/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/products/concentrates/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/products/pre-rolls/` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

### Redirect verification

Spot-check a sample of redirects from workstream 1a (every `302` plus 5 `308`s) with `curl -I` after deploy.

- [ ] All `302` redirects verified
- [ ] Sample of `308` redirects verified

---

## Open questions for Noah

1. `trailingSlash: true` globally? (recommended — matches spreadsheet canonicals)
2. Blog URL structure — keep flat (`/cannabis-101-.../`) or move under `/blog/[slug]/`?
3. Several pages have **TBD** descriptions in workstream 4 — does the spreadsheet's empty Description column mean "no meta description" or "to be written"?
4. Online ordering page — Adam's note suggests collapsing into About. Confirm direction.
5. Any pages need OpenGraph images beyond the site default?
