import { getPosts } from "@/lib/blog";
import BlogCarousel from "./BlogCarousel";

export default async function BlogSection() {
  const { posts } = await getPosts({ perPage: 3 });

  const carouselPosts = posts.map((post) => ({
    title: post.title,
    excerpt: post.excerpt,
    image: post.featuredImage?.url ?? null,
    href: `/blog/${post.slug}`,
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
