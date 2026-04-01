"use client";

import { useState } from "react";

const GOOGLE_REVIEW_URL =
  "https://search.google.com/local/writereview?placeid=ChIJrQjHvHYzs1IRgEbpaU30vFE";

type Review = {
  author: string;
  text: string;
};

const REVIEWS: Review[] = [
  {
    author: "Katie W.",
    text: "This is the place for your cannabis needs. I love the variety of options! The employees are super knowledgeable and helped me find the perfect product for me!",
  },
  {
    author: "Ella T.",
    text: "Beautiful store and best experience. Great product selection and even better customer service! The employees are knowledgeable and answered all my questions. 10/10 will be back!",
  },
  {
    author: "Luis N.",
    text: "This is the spot. If you enjoy great customer service and knowledgeable staff, you're in luck. Great assortment and impressive store layout. 10/10.",
  },
];

export default function ReviewsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const review = REVIEWS[activeIndex];

  function prev() {
    setActiveIndex((i) => (i - 1 + REVIEWS.length) % REVIEWS.length);
  }

  function next() {
    setActiveIndex((i) => (i + 1) % REVIEWS.length);
  }

  return (
    <section className="bg-parchment border border-sage rounded-[30px] md:rounded-[40px] flex flex-col gap-[25px] items-center justify-between px-7 md:px-[30px] py-10 md:py-[45px] overflow-hidden flex-1">
      <h2 className="font-poppins-bold text-[30px] md:text-display text-orange-glow text-center w-full">
        From the Community
      </h2>

      <a
        href={GOOGLE_REVIEW_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white rounded-[20px] px-8 md:px-9 py-8 md:py-9 w-full max-w-[608px] text-left block"
      >
        <p className="font-poppins text-[28px] md:text-[38px] text-orange-glow italic leading-normal">
          ★★★★★
        </p>
        <p className="font-poppins text-[16px] md:text-[18px] text-almost-black italic leading-normal mt-2.5">
          {review.text}
        </p>
        <p className="font-poppins-bold text-[16px] md:text-[18px] text-almost-black mt-2.5 not-italic">
          - {review.author}
        </p>
      </a>

      <div className="flex gap-[10px] md:gap-[25px] items-center justify-center w-full">
        <button
          onClick={prev}
          aria-label="Previous review"
          className="bg-orange-glow rounded-full size-[68px] flex items-center justify-center shrink-0 rotate-180"
        >
          <span className="font-poppins-semibold text-[55px] text-white leading-none">
            &gt;
          </span>
        </button>

        <a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-light-gold text-dark-green font-poppins-semibold uppercase text-base px-6 py-5 rounded-full hover:opacity-90 transition-opacity text-center flex-1 max-w-[404px]"
        >
          Leave us a review
        </a>

        <button
          onClick={next}
          aria-label="Next review"
          className="bg-orange-glow rounded-full size-[68px] flex items-center justify-center shrink-0"
        >
          <span className="font-poppins-semibold text-[55px] text-white leading-none">
            &gt;
          </span>
        </button>
      </div>
    </section>
  );
}
