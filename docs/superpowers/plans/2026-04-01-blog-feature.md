# Blog Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a WordPress-backed blog at `/learn` with listing page, individual post pages, and real data in the homepage BlogSection.

**Architecture:** Server components fetch from WPGraphQL (`https://cms.sweetleaves.co/graphql`) using the existing `lib/wp.ts` `getWPData` helper. URL search params drive filtering, search, and pagination — only the search input needs `"use client"`. The homepage BlogSection splits into a server parent + thin client carousel child.

**Tech Stack:** Next.js 16, React 19, Tailwind 4, WPGraphQL (existing endpoint), no new dependencies.

**Figma references:** fileKey `rzcly0U0lJ52TjQ2OWAFBs`
- Blog home desktop: nodeId `274:2684`
- Blog home mobile: nodeId `384:2203`
- Blog post desktop: nodeId `274:3399`
- Blog post mobile: nodeId `384:2483`

**Design tokens (from `app/globals.css`):**
- `dark-green` (#0F2D25), `dark-sage` (#24433B), `sage` (#6D7E76), `ivory` (#E0D7B7)
- `parchment` (#F7F4EE), `almost-black` (#211A1D), `sky-blue` (#DAF5FF)
- `light-gold` (#F4E781), `orange-glow` (#FD7121), `dark` (#1E1E1E)
- Font utilities: `font-poppins-regular`, `font-poppins-semibold`, `font-poppins-bold`

**Existing infrastructure:**
- `lib/wp.ts` — `getWPData(query, variables, options)` handles fetch + ISR caching
- `lib/homepage.ts` — pattern to follow for new query modules
- `.env` already has `WP_GRAPHQL_ENDPOINT=https://cms.sweetleaves.co/graphql`
- `next.config.ts` — currently empty, needs `images.remotePatterns`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `lib/blog.ts` | Create | GraphQL queries, types, fetch functions for blog |
| `next.config.ts` | Modify | Add `images.remotePatterns` for `cms.sweetleaves.co` |
| `app/globals.css` | Modify | Add `.blog-content` styles for WP HTML rendering |
| `app/learn/page.tsx` | Rewrite | Blog listing page (server component) |
| `app/learn/components/BlogCard.tsx` | Create | Blog post card for listing grid |
| `app/learn/components/BlogSearch.tsx` | Create | Search input (client component) |
| `app/learn/components/CategoryFilter.tsx` | Create | Category pill filter links |
| `app/learn/components/Pagination.tsx` | Create | Numbered page navigation |
| `app/learn/[slug]/page.tsx` | Create | Single blog post page |
| `app/components/home/BlogSection.tsx` | Rewrite | Server component fetching real WP data |
| `app/components/home/BlogCarousel.tsx` | Create | Client component for carousel interaction |

---

## Task 1: Data Layer (`lib/blog.ts`)

**Files:**
- Create: `lib/blog.ts`

This task builds all the GraphQL queries and typed fetch functions. No UI — just the data layer.

- [ ] **Step 1: Create `lib/blog.ts` with types and `getPosts`**

```ts
import { getWPData } from "./wp";

// --- Types ---

export interface WPPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  content: string;
  featuredImage: {
    url: string;
    alt: string;
  } | null;
  categories: {
    name: string;
    slug: string;
  }[];
}

export interface WPCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface PostsResult {
  posts: WPPost[];
  pageCount: number;
}

// --- Queries ---

const POSTS_QUERY = `
query GetPosts($first: Int!, $after: String, $categoryName: String, $search: String) {
  posts(
    first: $first
    after: $after
    where: { categoryName: $categoryName, search: $search, orderby: { field: DATE, order: DESC } }
  ) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      id
      title
      slug
      excerpt
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
    }
  }
}
`;

const POST_QUERY = `
query GetPost($slug: ID!) {
  post(id: $slug, idType: SLUG) {
    id
    title
    slug
    excerpt
    date
    content
    featuredImage {
      node {
        sourceUrl
        altText
      }
    }
    categories {
      nodes {
        name
        slug
      }
    }
  }
}
`;

const CATEGORIES_QUERY = `
query GetCategories {
  categories(where: { hideEmpty: true, orderby: NAME }) {
    nodes {
      id
      name
      slug
      count
    }
  }
}
`;

const ADJACENT_POST_QUERY = `
query GetAdjacentPost($slug: ID!) {
  post(id: $slug, idType: SLUG) {
    previous {
      slug
      title
    }
    next {
      slug
      title
    }
  }
}
`;

// --- Helpers ---

function mapPost(node: any): WPPost {
  return {
    id: node.id,
    title: node.title ?? "",
    slug: node.slug,
    excerpt: node.excerpt ?? "",
    date: node.date,
    content: node.content ?? "",
    featuredImage: node.featuredImage?.node
      ? {
          url: node.featuredImage.node.sourceUrl,
          alt: node.featuredImage.node.altText ?? "",
        }
      : null,
    categories:
      node.categories?.nodes?.map((c: any) => ({
        name: c.name,
        slug: c.slug,
      })) ?? [],
  };
}

// --- Public API ---

export async function getPosts({
  page = 1,
  perPage = 6,
  categorySlug,
  search,
}: {
  page?: number;
  perPage?: number;
  categorySlug?: string;
  search?: string;
} = {}): Promise<PostsResult> {
  // WPGraphQL uses cursor-based pagination. To get page N, we fetch
  // all posts up to page*perPage then take the last `perPage` items.
  // For simplicity with numbered pages, we use the `offset` approach
  // by fetching with `first` and computing the after cursor.
  // However, WPGraphQL doesn't support offset natively, so we'll
  // use a two-step approach: first get total count, then fetch the page.

  // Step 1: Get total count via a lightweight query
  const countData = await getWPData(
    `query CountPosts($categoryName: String, $search: String) {
      posts(where: { categoryName: $categoryName, search: $search }) {
        pageInfo { total }
      }
    }`,
    {
      categoryName: categorySlug || null,
      search: search || null,
    }
  );

  const total = countData?.posts?.pageInfo?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), pageCount);

  // Step 2: Fetch the page using offset (WPGraphQL supports offsetPagination)
  const offsetData = await getWPData(
    `query GetPostsOffset($size: Int!, $offset: Int!, $categoryName: String, $search: String) {
      posts(
        where: {
          categoryName: $categoryName
          search: $search
          orderby: { field: DATE, order: DESC }
          offsetPagination: { size: $size, offset: $offset }
        }
      ) {
        nodes {
          id
          title
          slug
          excerpt
          date
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }`,
    {
      size: perPage,
      offset: (safePage - 1) * perPage,
      categoryName: categorySlug || null,
      search: search || null,
    }
  );

  const posts = (offsetData?.posts?.nodes ?? []).map(mapPost);
  return { posts, pageCount };
}

export async function getPost(slug: string): Promise<WPPost | null> {
  const data = await getWPData(POST_QUERY, { slug });
  const node = data?.post;
  if (!node) return null;
  return mapPost(node);
}

export async function getCategories(): Promise<WPCategory[]> {
  const data = await getWPData(CATEGORIES_QUERY);
  return (data?.categories?.nodes ?? [])
    .filter((c: any) => c.count > 0 && c.slug !== "uncategorized")
    .map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      count: c.count,
    }));
}

export async function getAdjacentPost(
  slug: string,
  direction: "next" | "previous"
): Promise<{ slug: string; title: string } | null> {
  const data = await getWPData(ADJACENT_POST_QUERY, { slug });
  const adjacent = data?.post?.[direction];
  if (!adjacent) return null;
  return { slug: adjacent.slug, title: adjacent.title };
}
```

Note: WPGraphQL's `offsetPagination` requires the [WPGraphQL Offset Pagination](https://github.com/valu-digital/wp-graphql-offset-pagination) plugin. If that plugin is not installed, the `getPosts` function will need to fall back to cursor-based pagination. The subagent implementing this task should test against the actual endpoint and adjust the query approach accordingly. A cursor-based fallback would use `first` + `after` arguments, fetching page-by-page until reaching the desired offset.

- [ ] **Step 2: Verify queries work against the live endpoint**

Run the Next.js dev server and test from a scratch route or Node script:

```bash
npx tsx -e "
const { getPosts, getCategories } = require('./lib/blog');
(async () => {
  const cats = await getCategories();
  console.log('Categories:', cats);
  const { posts, pageCount } = await getPosts({ perPage: 2 });
  console.log('Posts:', posts.length, 'Pages:', pageCount);
  if (posts[0]) {
    const { getPost } = require('./lib/blog');
    const single = await getPost(posts[0].slug);
    console.log('Single post:', single?.title);
  }
})();
"
```

If `offsetPagination` is not supported, adapt `getPosts` to use cursor-based pagination instead. The subagent should handle this adaptively.

- [ ] **Step 3: Commit**

```bash
git add lib/blog.ts
git commit -m "feat: add blog data layer with WPGraphQL queries"
```

---

## Task 2: Next.js Config & Blog Content Styles

**Files:**
- Modify: `next.config.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Add image remote patterns to `next.config.ts`**

Replace the current empty config:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cms.sweetleaves.co" },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 2: Add blog content styles to `app/globals.css`**

Append these styles at the end of `globals.css` (before the closing `}`):

```css
/* Blog post content (WP HTML) */
.blog-content p {
  font-family: var(--font-poppins);
  font-weight: 400;
  font-size: 18px;
  line-height: 1.6;
  color: var(--color-dark);
  margin-bottom: 1em;
}

.blog-content h2 {
  font-family: var(--font-poppins);
  font-weight: 700;
  font-size: 35px;
  line-height: 1.2;
  color: var(--color-orange-glow);
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.blog-content h3 {
  font-family: var(--font-poppins);
  font-weight: 700;
  font-size: 30px;
  line-height: 1.2;
  color: var(--color-sage);
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.blog-content ul,
.blog-content ol {
  font-family: var(--font-poppins);
  font-weight: 400;
  font-size: 18px;
  line-height: 1.6;
  color: var(--color-dark);
  margin-bottom: 1em;
  padding-left: 1.5em;
}

.blog-content ul {
  list-style-type: disc;
}

.blog-content ol {
  list-style-type: decimal;
}

.blog-content li {
  margin-bottom: 0.25em;
}

.blog-content a {
  color: var(--color-orange-glow);
  text-decoration: underline;
}

.blog-content img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  margin: 1em 0;
}
```

- [ ] **Step 3: Commit**

```bash
git add next.config.ts app/globals.css
git commit -m "feat: add image config and blog content styles"
```

---

## Task 3: Blog Listing Page Components

**Files:**
- Create: `app/learn/components/BlogCard.tsx`
- Create: `app/learn/components/BlogSearch.tsx`
- Create: `app/learn/components/CategoryFilter.tsx`
- Create: `app/learn/components/Pagination.tsx`

These are the building blocks for the listing page. Each is a focused, single-responsibility component. Reference the Figma designs for visual accuracy:
- Desktop: fileKey `rzcly0U0lJ52TjQ2OWAFBs`, nodeId `274:2684`
- Mobile: fileKey `rzcly0U0lJ52TjQ2OWAFBs`, nodeId `384:2203`

Use `mcp__figma__get_screenshot` to verify visual fidelity during implementation.

- [ ] **Step 1: Create `BlogCard.tsx`**

Server component. Displays a single blog post card in the listing grid.

```tsx
import Image from "next/image";
import Link from "next/link";
import type { WPPost } from "@/lib/blog";

interface Props {
  post: WPPost;
}

export default function BlogCard({ post }: Props) {
  const date = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const category = post.categories[0]?.name;

  return (
    <Link
      href={`/learn/${post.slug}`}
      className="bg-white rounded-[30px] p-[19px] flex flex-col gap-[22px] hover:shadow-lg transition-shadow"
    >
      <div className="relative w-full aspect-[16/9] rounded-[10px] overflow-hidden">
        {post.featuredImage ? (
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt || post.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-sage/20" />
        )}
      </div>
      <div className="flex flex-col gap-[10px]">
        <h2 className="font-poppins-bold text-[30px] md:text-[35px] text-dark leading-tight">
          {post.title}
        </h2>
        {(date || category) && (
          <p className="font-poppins text-[18px] text-sage italic">
            {date}
            {category && ` | ${category}`}
          </p>
        )}
        <div
          className="font-poppins-regular text-[18px] text-dark line-clamp-4"
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
        <span className="font-poppins-bold text-[20px] text-orange-glow uppercase">
          Read More &gt;
        </span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create `BlogSearch.tsx`**

Client component. Text input + submit button that navigates via search params.

```tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function BlogSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    router.push(`/learn${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="hidden md:flex bg-white rounded-[70px] h-[75px] items-center justify-between px-[10px] py-[15px] w-full"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search"
        className="font-poppins-regular text-[32px] text-sage placeholder:text-sage bg-transparent outline-none flex-1 px-4"
      />
      <button
        type="submit"
        className="bg-orange-glow rounded-full size-[55px] flex items-center justify-center shrink-0"
        aria-label="Search"
      >
        <span className="font-poppins-semibold text-[55px] text-white leading-none">
          &gt;
        </span>
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Create `CategoryFilter.tsx`**

Server component. Renders category pill links using URL search params.

```tsx
import Link from "next/link";
import type { WPCategory } from "@/lib/blog";

interface Props {
  categories: WPCategory[];
  activeSlug?: string;
}

export default function CategoryFilter({ categories, activeSlug }: Props) {
  const isAll = !activeSlug;

  return (
    <div className="flex gap-[9px] flex-wrap justify-center">
      <Link
        href="/learn"
        className={`rounded-full h-[50px] px-[25px] py-[14px] flex items-center justify-center font-poppins-regular text-[16px] uppercase whitespace-nowrap ${
          isAll ? "bg-dark-green text-white" : "bg-sage text-white"
        }`}
      >
        All Categories
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/learn?category=${cat.slug}`}
          className={`rounded-full h-[50px] px-[25px] py-[14px] flex items-center justify-center font-poppins-regular text-[16px] uppercase whitespace-nowrap ${
            activeSlug === cat.slug
              ? "bg-dark-green text-white"
              : "bg-sage text-white"
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create `Pagination.tsx`**

Server component. Renders numbered page links with arrow buttons.

```tsx
import Link from "next/link";

interface Props {
  currentPage: number;
  pageCount: number;
  basePath: string;
  searchParams?: Record<string, string>;
}

export default function Pagination({
  currentPage,
  pageCount,
  basePath,
  searchParams = {},
}: Props) {
  if (pageCount <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    const qs = params.toString();
    return `${basePath}${qs ? `?${qs}` : ""}`;
  }

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center py-[10px]">
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="bg-orange-glow rounded-full size-[47px] flex items-center justify-center shrink-0 rotate-180"
          aria-label="Previous page"
        >
          <span className="font-poppins-semibold text-[55px] text-white leading-none">
            &gt;
          </span>
        </Link>
      ) : (
        <div className="size-[47px]" />
      )}

      <div className="flex items-center justify-center font-poppins-bold text-[30px] text-dark-green uppercase mx-4 gap-4">
        {pages.map((p) => (
          <Link
            key={p}
            href={buildHref(p)}
            className={p === currentPage ? "underline" : "opacity-60"}
          >
            {p}
          </Link>
        ))}
      </div>

      {currentPage < pageCount ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="bg-orange-glow rounded-full size-[47px] flex items-center justify-center shrink-0"
          aria-label="Next page"
        >
          <span className="font-poppins-semibold text-[55px] text-white leading-none">
            &gt;
          </span>
        </Link>
      ) : (
        <div className="size-[47px]" />
      )}
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add app/learn/components/
git commit -m "feat: add blog listing components (card, search, categories, pagination)"
```

---

## Task 4: Blog Listing Page (`/learn`)

**Files:**
- Rewrite: `app/learn/page.tsx`

This page wires the components from Task 3 together with data from Task 1. Reference Figma for layout:
- Desktop: fileKey `rzcly0U0lJ52TjQ2OWAFBs`, nodeId `274:2684`
- Mobile: fileKey `rzcly0U0lJ52TjQ2OWAFBs`, nodeId `384:2203`

- [ ] **Step 1: Rewrite `app/learn/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { getPosts, getCategories } from "@/lib/blog";
import GardenClubPromo from "../components/home/GardenClubPromo";
import BlogCard from "./components/BlogCard";
import BlogSearch from "./components/BlogSearch";
import CategoryFilter from "./components/CategoryFilter";
import Pagination from "./components/Pagination";

export const metadata: Metadata = {
  title: "Our Blog",
  description:
    "Cannabis education, product spotlights, and community stories from Sweetleaves in Minneapolis.",
  alternates: { canonical: "/learn" },
};

interface Props {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
  }>;
}

export default async function LearnPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const categorySlug = params.category || undefined;
  const search = params.search || undefined;

  const [{ posts, pageCount }, categories] = await Promise.all([
    getPosts({ page, perPage: 6, categorySlug, search }),
    getCategories(),
  ]);

  // Preserve category and search in pagination links
  const paginationParams: Record<string, string> = {};
  if (categorySlug) paginationParams.category = categorySlug;
  if (search) paginationParams.search = search;

  return (
    <div className="max-w-[1366px] mx-auto px-4 md:px-[37px] py-8 flex flex-col gap-[30px] items-center">
      <h1 className="font-poppins-bold text-[35px] md:text-[55px] text-dark-green text-center leading-[0.9]">
        Our Blog
      </h1>

      <div className="w-full flex flex-col gap-[33px] items-center">
        <Suspense>
          <BlogSearch />
        </Suspense>
        <CategoryFilter categories={categories} activeSlug={categorySlug} />
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] md:gap-[25px] w-full">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="font-poppins-regular text-[18px] text-sage text-center py-12">
          No posts found.
        </p>
      )}

      <Pagination
        currentPage={page}
        pageCount={pageCount}
        basePath="/learn"
        searchParams={paginationParams}
      />

      <GardenClubPromo />
    </div>
  );
}
```

- [ ] **Step 2: Test the page locally**

```bash
npm run dev
```

Open `http://localhost:3000/learn` in a browser. Verify:
- Posts load from WP
- Category filtering works (click a pill, URL changes, posts filter)
- Pagination works (click page numbers)
- Search works (type query, submit, URL changes, posts filter)
- Responsive layout: single column on mobile, 3-column grid on desktop

- [ ] **Step 3: Commit**

```bash
git add app/learn/page.tsx
git commit -m "feat: implement blog listing page at /learn"
```

---

## Task 5: Blog Post Page (`/learn/[slug]`)

**Files:**
- Create: `app/learn/[slug]/page.tsx`

Reference Figma for layout:
- Desktop: fileKey `rzcly0U0lJ52TjQ2OWAFBs`, nodeId `274:3399`
- Mobile: fileKey `rzcly0U0lJ52TjQ2OWAFBs`, nodeId `384:2483`

- [ ] **Step 1: Create `app/learn/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getAdjacentPost } from "@/lib/blog";
import GardenClubPromo from "../../components/home/GardenClubPromo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const description = post.excerpt.replace(/<[^>]*>/g, "").slice(0, 160);

  return {
    title: post.title,
    description,
    alternates: { canonical: `/learn/${slug}` },
    openGraph: {
      title: post.title,
      description,
      ...(post.featuredImage && {
        images: [{ url: post.featuredImage.url }],
      }),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, nextPost] = await Promise.all([
    getPost(slug),
    getAdjacentPost(slug, "next"),
  ]);

  if (!post) notFound();

  return (
    <div className="max-w-[1366px] mx-auto px-4 md:px-[37px] py-8 flex flex-col gap-[30px] items-center">
      <article className="bg-white rounded-[50px] w-full px-5 md:px-[117px] pt-[40px] md:pt-[90px] pb-[40px] md:pb-[60px] flex flex-col gap-[40px] md:gap-[63px] items-center">
        {post.featuredImage && (
          <div className="relative w-full aspect-[16/9] rounded-[30px] md:rounded-[70px] overflow-hidden">
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="w-full flex flex-col gap-[39px]">
          <h1 className="font-poppins-bold text-[35px] md:text-[45px] text-dark-green leading-[0.9]">
            {post.title}
          </h1>
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-[10px]">
          <Link
            href="/learn"
            className="bg-light-gold text-dark-green font-poppins-semibold text-[16px] uppercase px-[25px] py-[14px] rounded-full hover:opacity-90 transition-opacity text-center w-full md:w-auto min-w-[250px]"
          >
            &lt; Back to Blog
          </Link>
          {nextPost && (
            <Link
              href={`/learn/${nextPost.slug}`}
              className="bg-light-gold text-dark-green font-poppins-semibold text-[16px] uppercase px-[25px] py-[14px] rounded-full hover:opacity-90 transition-opacity text-center w-full md:w-auto min-w-[250px]"
            >
              Next Post &gt;
            </Link>
          )}
        </div>
      </article>

      <GardenClubPromo />
    </div>
  );
}
```

- [ ] **Step 2: Test the page locally**

```bash
npm run dev
```

Navigate from the listing page to an individual post. Verify:
- Cover image renders
- Title renders in dark-green
- HTML content is styled correctly (h2 = orange-glow, h3 = sage, paragraphs, lists)
- "Back to Blog" links to `/learn`
- "Next Post" links to the next post
- 404 page shows for a non-existent slug (`/learn/does-not-exist`)
- Responsive: desktop has side-by-side buttons, mobile stacks them

- [ ] **Step 3: Commit**

```bash
git add app/learn/[slug]/
git commit -m "feat: implement single blog post page at /learn/[slug]"
```

---

## Task 6: Homepage BlogSection Update

**Files:**
- Rewrite: `app/components/home/BlogSection.tsx`
- Create: `app/components/home/BlogCarousel.tsx`

This replaces the hardcoded homepage blog section with real WP data. The server component fetches data and the client component handles carousel interaction.

- [ ] **Step 1: Create `app/components/home/BlogCarousel.tsx`**

Client component for carousel state only. Receives posts as props.

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface BlogPost {
  title: string;
  excerpt: string;
  image: string | null;
  href: string;
}

interface Props {
  posts: BlogPost[];
}

export default function BlogCarousel({ posts }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (posts.length === 0) return null;

  const post = posts[activeIndex];
  const total = posts.length;

  function handlePrev() {
    setActiveIndex((i) => (i - 1 + total) % total);
  }

  function handleNext() {
    setActiveIndex((i) => (i + 1) % total);
  }

  return (
    <>
      <div className="bg-white rounded-[30px] md:rounded-[20px] p-3.5 w-full max-w-[608px] flex flex-col gap-2.5">
        <div className="relative w-full aspect-[16/9] rounded-[20px] md:rounded-[10px] overflow-hidden">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-sage/20" />
          )}
        </div>
        <div className="flex flex-col gap-2.5 px-1">
          <h3 className="font-poppins-bold text-[25px] md:text-[30px] text-dark-sage">
            {post.title}
          </h3>
          <div
            className="font-poppins-regular text-[18px] text-dark line-clamp-2"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
          <Link
            href={post.href}
            className="font-poppins-bold text-[20px] text-orange-glow uppercase"
          >
            Read More &gt;
          </Link>
        </div>
      </div>

      <div className="flex gap-[10px] md:gap-[25px] items-center justify-center w-full">
        <button
          aria-label="Previous post"
          onClick={handlePrev}
          className="bg-orange-glow rounded-full size-[68px] flex items-center justify-center shrink-0 rotate-180"
        >
          <span className="font-poppins-semibold text-[55px] text-white leading-none">
            &gt;
          </span>
        </button>

        <Link
          href="/learn"
          className="bg-light-gold text-dark-green font-poppins-semibold uppercase text-base px-6 py-5 rounded-full hover:opacity-90 transition-opacity text-center flex-1 max-w-[404px]"
        >
          Browse Our Blog
        </Link>

        <button
          aria-label="Next post"
          onClick={handleNext}
          className="bg-orange-glow rounded-full size-[68px] flex items-center justify-center shrink-0"
        >
          <span className="font-poppins-semibold text-[55px] text-white leading-none">
            &gt;
          </span>
        </button>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Rewrite `app/components/home/BlogSection.tsx`**

Convert to server component that fetches real data.

```tsx
import { getPosts } from "@/lib/blog";
import BlogCarousel from "./BlogCarousel";

export default async function BlogSection() {
  const { posts } = await getPosts({ perPage: 3 });

  const carouselPosts = posts.map((post) => ({
    title: post.title,
    excerpt: post.excerpt,
    image: post.featuredImage?.url ?? null,
    href: `/learn/${post.slug}`,
  }));

  return (
    <div className="bg-parchment border border-sage rounded-[30px] md:rounded-[40px] flex flex-col gap-[25px] items-center justify-center px-7 md:px-[30px] py-10 md:py-[45px] overflow-hidden flex-1">
      <h2 className="font-poppins-bold text-[30px] md:text-display text-orange-glow text-center w-full">
        Get to Know Cannabis
      </h2>
      <BlogCarousel posts={carouselPosts} />
    </div>
  );
}
```

- [ ] **Step 3: Update barrel export**

The `app/components/home/index.ts` exports `BlogSection` — since we're keeping the same file name and default export, no changes needed to the barrel file or `app/page.tsx`. But note that `BlogSection` is now async (server component). Since `app/page.tsx` is also a server component, this works without changes.

Verify `app/page.tsx` does NOT have `"use client"` at the top (it doesn't — confirmed from exploration).

- [ ] **Step 4: Test locally**

```bash
npm run dev
```

Open `http://localhost:3000` and scroll to the blog section. Verify:
- Real post titles/excerpts/images display
- Carousel arrows cycle through 3 posts
- "Browse Our Blog" links to `/learn`
- "Read More" links to `/learn/[slug]`

- [ ] **Step 5: Commit**

```bash
git add app/components/home/BlogSection.tsx app/components/home/BlogCarousel.tsx
git commit -m "feat: update homepage BlogSection with real WP data"
```

---

## Task 7: Final Polish & Image Config Verification

**Files:**
- Verify all pages work end-to-end

- [ ] **Step 1: Verify `next/image` works with WP images**

Open a blog post with a featured image. If you see an error about unoptimized images or hostname not configured, confirm `next.config.ts` has the remote pattern from Task 2.

- [ ] **Step 2: Test full user flow**

1. Homepage → scroll to BlogSection → click "Read More" → lands on `/learn/[slug]`
2. Click "< Back to Blog" → lands on `/learn`
3. Click a category pill → URL updates, posts filter
4. Type in search bar, submit → URL updates, posts filter
5. Click page 2 → URL updates, next page of posts shows
6. Click a blog card → lands on individual post
7. Click "Next Post" → navigates to next post
8. Visit `/learn/does-not-exist` → 404 page

- [ ] **Step 3: Check responsive layout**

Use browser devtools to test at mobile (390px) and desktop (1440px) widths:
- Mobile: single column blog cards, stacked nav buttons, no search bar
- Desktop: 3-column grid, side-by-side nav buttons, search bar visible

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: polish blog feature after end-to-end testing"
```

Only commit if changes were made. Skip if everything passed.
