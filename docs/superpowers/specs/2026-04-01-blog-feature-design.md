# Blog Feature Design Spec

## Overview

Blog feature for Sweetleaves pulling content from WordPress via WPGraphQL. Two screens: a blog listing page at `/learn` and individual post pages at `/learn/[slug]`. Also updates the existing homepage BlogSection to use real WP data.

## Data Source

- **Endpoint:** `WP_GRAPHQL_ENDPOINT=https://cms.sweetleaves.co/graphql`
- **Approach:** Server-side `fetch` with raw GraphQL queries — no new dependencies
- **Env var** added to `.env.local` (and documented)

## Data Layer — `lib/wordpress.ts`

### Types

```ts
interface WPPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;       // HTML string from WP
  date: string;          // ISO date
  content: string;       // Full HTML body
  featuredImage: {
    url: string;
    alt: string;
  } | null;
  categories: {
    name: string;
    slug: string;
  }[];
}

interface WPCategory {
  id: string;
  name: string;
  slug: string;
  count: number;         // number of published posts
}

interface PostsResult {
  posts: WPPost[];
  pageCount: number;
}
```

### Functions

| Function | Args | Returns | Notes |
|----------|------|---------|-------|
| `getPosts` | `{ page?, perPage?, categorySlug?, search? }` | `PostsResult` | Defaults: page=1, perPage=6 |
| `getPost` | `slug: string` | `WPPost \| null` | Full content for single post |
| `getCategories` | none | `WPCategory[]` | Only categories with count > 0, alphabetical |
| `getAdjacentPost` | `slug: string, direction: 'next' \| 'previous'` | `{ slug, title } \| null` | For prev/next navigation on post page |

All functions read `process.env.WP_GRAPHQL_ENDPOINT`. Fetch calls use `{ next: { revalidate: 300 } }` for ISR (5-minute cache).

## Blog Home — `/learn`

### Route

`app/learn/page.tsx` — server component. Reads `searchParams`: `page`, `category`, `search`.

### Desktop Layout (from Figma 274:2684)

1. **Heading** — "Our Blog", Poppins Bold 55px, dark-green, centered
2. **Search bar** — white pill (rounded-[70px]), "Search" placeholder in sage, orange arrow submit button. Form submits as GET to `/learn?search=...`
3. **Category pills** — row of sage-bg pills. "All Categories" hardcoded first (links to `/learn`), then dynamic categories from WP. Active category visually distinguished. Each pill is a `<Link>` to `/learn?category=[slug]`
4. **Blog grid** — 3-column grid, gap-[25px], 6 cards per page (2 rows of 3)
5. **Pagination** — orange arrow buttons + numbered pages. Links to `/learn?page=N` (preserving active category/search params)
6. **Garden Club promo** — existing component reused
7. **Footer** — existing component

### Mobile Layout (from Figma 384:2203)

- Heading: Poppins Bold 35px
- Category pills: horizontal scroll
- Blog grid: single column
- Pagination: same component, responsive
- No search bar on mobile (hidden via responsive class)

### File Structure

```
app/learn/
  page.tsx                 # Server component — fetches data, renders layout
  [slug]/
    page.tsx               # Server component — single post
  components/
    BlogCard.tsx           # Server component — card in listing
    BlogSearch.tsx         # Client component — search input + form
    CategoryFilter.tsx     # Server component — category pill links
    Pagination.tsx         # Server component — page nav links
```

### BlogCard Component

- White bg, rounded-[30px], p-[19px]
- Featured image: rounded-[10px], aspect ~16:9, `next/image` with `fill` + `object-cover`
- Title: Poppins Bold, 35px desktop / 30px mobile, dark text
- Date + Category: Poppins Italic, 18px, sage — format: "April 1, 2026 | Cannabis 101"
- Excerpt: Poppins Regular, 18px, dark, clamped to ~5 lines
- "Read More >": Poppins Bold, 20px, orange-glow, uppercase, `<Link>` to `/learn/[slug]`
- Entire card clickable (wrap in Link or use CSS trick)

## Blog Post — `/learn/[slug]`

### Route

`app/learn/[slug]/page.tsx` — server component. Fetches post by slug.

### Desktop Layout (from Figma 274:3399)

- White container: rounded-[50px], px-[117px], py-[60px] top / py-[90px] bottom
- Cover image: full width, rounded-[70px], aspect ~16:9
- Title: Poppins Bold, 45px, dark-green
- Content: rendered via `dangerouslySetInnerHTML`
- Navigation: "< Back to Blog" + "Next Post >" yellow pill buttons, side-by-side

### Mobile Layout (from Figma 384:2483)

- White container: rounded-[50px], tighter padding (~px-[20px])
- Cover image: rounded-[30px]
- Navigation buttons: stacked vertically
- Same typography

### Content Styling

WP returns HTML. Style with a scoped class in `globals.css`:

```css
.blog-content p { /* Poppins Regular 18px, dark */ }
.blog-content h2 { /* Poppins Bold 35px, orange-glow */ }
.blog-content h3 { /* Poppins Bold 30px, sage */ }
.blog-content ul { /* disc markers, 18px */ }
.blog-content li { /* standard spacing */ }
```

### SEO

`generateMetadata` returns title, description (from excerpt), and OpenGraph data. The post title uses the template from `layout.tsx`: "Post Title | Sweetleaves".

### Error Handling

If `getPost(slug)` returns null, call `notFound()` to render the Next.js 404 page.

## Homepage BlogSection Update

### Current State

`app/components/home/BlogSection.tsx` — client component with hardcoded `BLOG_POSTS` array and `useState` carousel.

### New Architecture

Split into two parts:
- **`BlogSection.tsx`** (server) — fetches latest 3 posts via `getPosts({ perPage: 3 })`, passes to client child
- **`BlogCarousel.tsx`** (client) — receives posts as props, manages `activeIndex` state with prev/next arrows

Visual design stays the same: parchment card, single-card carousel, "Browse Our Blog" button linking to `/learn`, "Read More >" linking to `/learn/[slug]`.

## Image Handling

WP featured images served from `cms.sweetleaves.co`. Add to `next.config.ts`:

```ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'cms.sweetleaves.co' }
  ]
}
```

Use `next/image` with `fill` + `object-cover` for all blog images.

## Environment Variables

| Variable | Value | Where |
|----------|-------|-------|
| `WP_GRAPHQL_ENDPOINT` | `https://cms.sweetleaves.co/graphql` | `.env.local` |

## Out of Scope

- Blog post comments
- Social sharing buttons
- Related posts section
- RSS feed
- Dark mode variants
- Blog post search on mobile (hidden per design)
