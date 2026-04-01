"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface BlogPost {
  title: string;
  description: string;
  image: string;
  href: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    title: "Blog 1",
    description:
      "Pudding cake powder jujubes shortbread. Brownie carrot cake caramels sweet.",
    image: "/home/blog-placeholder.png",
    href: "/learn",
  },
  {
    title: "Blog 2",
    description:
      "Pudding cake powder jujubes shortbread. Brownie carrot cake caramels sweet.",
    image: "/home/blog-placeholder.png",
    href: "/learn",
  },
  {
    title: "Blog 3",
    description:
      "Pudding cake powder jujubes shortbread. Brownie carrot cake caramels sweet.",
    image: "/home/blog-placeholder.png",
    href: "/learn",
  },
];

export default function BlogSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const post = BLOG_POSTS[activeIndex];
  const total = BLOG_POSTS.length;

  function handlePrev() {
    setActiveIndex((i) => (i - 1 + total) % total);
  }

  function handleNext() {
    setActiveIndex((i) => (i + 1) % total);
  }

  return (
    <div className="bg-parchment border border-sage rounded-[30px] md:rounded-[40px] flex flex-col gap-[25px] items-center justify-center px-7 md:px-[30px] py-10 md:py-[45px] overflow-hidden flex-1">
      <h2 className="font-poppins-bold text-[30px] md:text-display text-orange-glow text-center w-full">
        Get to Know Cannabis
      </h2>

      <div className="bg-white rounded-[30px] md:rounded-[20px] p-3.5 w-full max-w-[608px] flex flex-col gap-2.5">
        <div className="relative w-full aspect-[16/9] rounded-[20px] md:rounded-[10px] overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-2.5 px-1">
          <h3 className="font-poppins-bold text-[25px] md:text-[30px] text-dark-sage">
            {post.title}
          </h3>
          <p className="font-poppins-regular text-[18px] text-dark">{post.description}</p>
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
    </div>
  );
}
