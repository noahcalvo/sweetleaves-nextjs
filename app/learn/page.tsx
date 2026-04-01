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
