import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getAdjacentPost } from "@/lib/blog";
import LearnGardenClub from "@/app/learn/components/LearnGardenClub";

const SLUG = "cannabis-101-understanding-thc-cbd-and-more";

export const metadata: Metadata = {
  title: {
    absolute: "Cannabis 101: Understanding THC, CBD, and More | Sweetleaves",
  },
  description:
    "Discover the essentials of cannabis in Minnesota with this beginner-friendly guide. Learn about THC, CBD, CBG, strains, consumption methods, and tips for a safe and informed experience.",
  alternates: { canonical: "/cannabis-101-understanding-thc-cbd-and-more/" },
};

export default async function Cannabis101Page() {
  const [post, nextPost] = await Promise.all([
    getPost(SLUG),
    getAdjacentPost(SLUG, "next"),
  ]);

  if (!post) notFound();

  return (
    <div className="max-w-[1366px] mx-auto px-4 md:px-[37px] pt-8 md:pt-[120px] pb-8 flex flex-col gap-[30px] items-center">
      <article className="bg-white rounded-[50px] w-full px-5 md:px-[117px] pt-[20px] md:pt-[90px] pb-[40px] md:pb-[60px] flex flex-col gap-[40px] md:gap-[63px] items-center">
        {post.featuredImage && (
          <div className="relative w-full aspect-[16/9] rounded-[30px] md:rounded-[70px] overflow-hidden md:-mt-[183px]">
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              fill
              sizes="(max-width: 1366px) 100vw, 1132px"
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
            href="/blog/"
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

      <LearnGardenClub />
    </div>
  );
}
