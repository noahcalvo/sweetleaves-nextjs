"use client";

import Image from "next/image";
import { useState } from "react";
import type { DealSlide } from "@/lib/deals";

interface Props {
  slides: DealSlide[];
}

export default function DealsCarousel({ slides }: Props) {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  const slide = slides[index];

  return (
    <div className="relative h-[273px] md:h-[320px] w-full max-w-[1280px] rounded-[40px] overflow-hidden">
      <Image
        src={slide.url}
        alt={slide.alt}
        fill
        className="object-cover object-center"
        sizes="(max-width: 768px) 100vw, 1280px"
        priority={index === 0}
      />
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-ivory/80 rounded-full w-10 h-10 flex items-center justify-center text-dark-green text-xl"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-ivory/80 rounded-full w-10 h-10 flex items-center justify-center text-dark-green text-xl"
            aria-label="Next slide"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
