import { getPosts } from "@/lib/blog";

const BASE = "https://sweetleavesnorthloop.com";

export const revalidate = 300;

export async function GET() {
  const { posts } = await getPosts({ perPage: 1000 });

  const urls = posts
    .map(
      (post) => `  <url>
    <loc>${BASE}/blog/${post.slug}/</loc>
    <lastmod>${new Date(post.date).toISOString().split("T")[0]}</lastmod>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
