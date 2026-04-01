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
