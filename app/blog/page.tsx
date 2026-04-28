import type { Metadata } from "next";
import { getPosts } from "@/lib/blog";
import BlogCard from "@/app/learn/components/BlogCard";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Cannabis education, product spotlights, and community stories from Sweetleaves in Minneapolis.",
  alternates: { canonical: "/blog/" },
};

export default async function BlogPage() {
  const { posts } = await getPosts({ page: 1, perPage: 6 });

  return (
    <div className="max-w-[1366px] mx-auto px-4 md:px-[37px] py-8 flex flex-col gap-[30px] items-center">
      <h1 className="font-poppins-bold text-[35px] md:text-[55px] text-dark-green text-center leading-[0.9]">
        Blog
      </h1>

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
    </div>
  );
}
