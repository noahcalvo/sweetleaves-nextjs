import { getWPData } from "./wp";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Revalidation
// ---------------------------------------------------------------------------

const BLOG_REVALIDATE_SECONDS = Number(
  process.env.WP_BLOG_REVALIDATE_SECONDS ?? "300"
);

// ---------------------------------------------------------------------------
// GraphQL queries
// ---------------------------------------------------------------------------

const POST_FIELDS = `
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
`;

const GET_POSTS_QUERY = `
  query GetPosts($first: Int!, $after: String, $categoryName: String, $search: String) {
    posts(
      first: $first
      after: $after
      where: {
        categoryName: $categoryName
        search: $search
        orderby: { field: DATE, order: DESC }
      }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ${POST_FIELDS}
      }
    }
  }
`;

// Fetches only IDs — used to count total posts matching a filter set.
const COUNT_POSTS_QUERY = `
  query CountPosts($categoryName: String, $search: String) {
    posts(
      first: 1000
      where: {
        categoryName: $categoryName
        search: $search
      }
    ) {
      nodes {
        id
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

// Fetches cursor IDs only — used to skip to a specific page offset.
const GET_CURSOR_QUERY = `
  query GetCursor($skip: Int!, $categoryName: String, $search: String) {
    posts(
      first: $skip
      where: {
        categoryName: $categoryName
        search: $search
        orderby: { field: DATE, order: DESC }
      }
    ) {
      pageInfo {
        endCursor
      }
    }
  }
`;

const GET_POST_QUERY = `
  query GetPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      ${POST_FIELDS}
    }
  }
`;

const GET_CATEGORIES_QUERY = `
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

const GET_ADJACENT_POST_QUERY = `
  query GetAdjacentPosts($categoryName: String, $search: String) {
    posts(
      first: 1000
      where: {
        categoryName: $categoryName
        search: $search
        orderby: { field: DATE, order: DESC }
      }
    ) {
      nodes {
        slug
        title
      }
    }
  }
`;

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function mapPost(node: any): WPPost {
  const img = node?.featuredImage?.node ?? null;
  return {
    id: node.id ?? "",
    title: node.title ?? "",
    slug: node.slug ?? "",
    excerpt: node.excerpt ?? "",
    date: node.date ?? "",
    content: node.content ?? "",
    featuredImage: img
      ? { url: img.sourceUrl ?? "", alt: img.altText ?? "" }
      : null,
    categories: (node.categories?.nodes ?? []).map((c: any) => ({
      name: c.name ?? "",
      slug: c.slug ?? "",
    })),
  };
}

// ---------------------------------------------------------------------------
// getPosts
// ---------------------------------------------------------------------------

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
  const categoryName = categorySlug ?? null;
  const searchTerm = search ?? null;

  // 1. Count total posts matching the filters.
  const countData = await getWPData(
    COUNT_POSTS_QUERY,
    { categoryName, search: searchTerm },
    { revalidateSeconds: BLOG_REVALIDATE_SECONDS }
  );
  const allIds: any[] = countData?.posts?.nodes ?? [];
  const total = allIds.length;
  const pageCount = total === 0 ? 1 : Math.ceil(total / perPage);

  // 2. Determine the cursor to start from for the requested page.
  let afterCursor: string | null = null;
  const skipCount = (page - 1) * perPage;
  if (skipCount > 0) {
    const cursorData = await getWPData(
      GET_CURSOR_QUERY,
      { skip: skipCount, categoryName, search: searchTerm },
      { revalidateSeconds: BLOG_REVALIDATE_SECONDS }
    );
    afterCursor = cursorData?.posts?.pageInfo?.endCursor ?? null;
  }

  // 3. Fetch the actual page of posts.
  const postsData = await getWPData(
    GET_POSTS_QUERY,
    { first: perPage, after: afterCursor, categoryName, search: searchTerm },
    { revalidateSeconds: BLOG_REVALIDATE_SECONDS }
  );
  const nodes: any[] = postsData?.posts?.nodes ?? [];

  return {
    posts: nodes.map(mapPost),
    pageCount,
  };
}

// ---------------------------------------------------------------------------
// getPost
// ---------------------------------------------------------------------------

export async function getPost(slug: string): Promise<WPPost | null> {
  const data = await getWPData(
    GET_POST_QUERY,
    { slug },
    { revalidateSeconds: BLOG_REVALIDATE_SECONDS }
  );
  const node = data?.post ?? null;
  return node ? mapPost(node) : null;
}

// ---------------------------------------------------------------------------
// getCategories
// ---------------------------------------------------------------------------

export async function getCategories(): Promise<WPCategory[]> {
  const data = await getWPData(
    GET_CATEGORIES_QUERY,
    {},
    { revalidateSeconds: BLOG_REVALIDATE_SECONDS }
  );
  const nodes: any[] = data?.categories?.nodes ?? [];
  return nodes
    .filter(
      (c) => c.slug !== "uncategorized" && typeof c.count === "number" && c.count > 0
    )
    .map((c) => ({
      id: c.id ?? "",
      name: c.name ?? "",
      slug: c.slug ?? "",
      count: c.count ?? 0,
    }));
}

// ---------------------------------------------------------------------------
// getAdjacentPost
// ---------------------------------------------------------------------------

export async function getAdjacentPost(
  slug: string,
  direction: "next" | "previous"
): Promise<{ slug: string; title: string } | null> {
  // WPGraphQL does not expose previous/next fields on Post, so we fetch all
  // posts ordered by date DESC and find neighbors by position.
  const data = await getWPData(
    GET_ADJACENT_POST_QUERY,
    { categoryName: null, search: null },
    { revalidateSeconds: BLOG_REVALIDATE_SECONDS }
  );
  const nodes: { slug: string; title: string }[] = data?.posts?.nodes ?? [];
  const index = nodes.findIndex((p) => p.slug === slug);

  if (index === -1) return null;

  // Posts are ordered newest-first (DESC).
  // "next" in reading direction = newer post = lower index.
  // "previous" in reading direction = older post = higher index.
  const neighborIndex = direction === "next" ? index - 1 : index + 1;

  if (neighborIndex < 0 || neighborIndex >= nodes.length) return null;

  const neighbor = nodes[neighborIndex];
  return { slug: neighbor.slug, title: neighbor.title };
}
