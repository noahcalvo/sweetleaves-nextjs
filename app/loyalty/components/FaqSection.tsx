"use client";

import { useState } from "react";
import Link from "next/link";

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqItem({ question, answer, isOpen, onToggle }: FaqItemProps) {
  return (
    <div className="bg-white rounded-[50px] overflow-clip self-start">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-2.5 md:gap-7 pl-6 md:pl-8 pr-2.5 py-2.5"
      >
        <span className="font-poppins-bold text-xl text-dark-green text-left">
          {question}
        </span>
        <span
          className={`bg-orange-glow text-white rounded-full size-[68px] flex items-center justify-center font-poppins-semibold text-5xl shrink-0 transition-transform ${
            isOpen ? "rotate-90" : ""
          }`}
        >
          &gt;
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div
            className="font-poppins-regular text-lg text-dark-green px-8 pb-6"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </div>
      </div>
    </div>
  );
}

interface Props {
  faqs: { question: string; answer: string }[];
}

export default function FaqSection({ faqs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-parchment border border-sage rounded-[40px] flex flex-col gap-5 md:gap-12 items-center px-6 md:px-10 py-8 md:py-12">
      <div className="flex items-center justify-between w-full">
        <h2 className="font-poppins-bold text-3xl md:text-display text-orange-glow text-center md:text-left flex-1 md:flex-none">
          Common Questions
        </h2>
        <Link
          href="/faqs/"
          className="hidden md:flex bg-light-gold text-dark-green font-poppins-semibold uppercase text-base px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity"
        >
          View all FAQ
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-5 w-full">
        {faqs.map((item, i) => (
          <FaqItem
            key={item.question}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
      <Link
        href="/faqs/"
        className="md:hidden bg-light-gold text-dark-green font-poppins-semibold uppercase text-base px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity w-full text-center"
      >
        View all FAQ
      </Link>
    </section>
  );
}
