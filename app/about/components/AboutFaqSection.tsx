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
    <div className="bg-white rounded-[50px] overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-1 md:gap-7 pl-4 md:pl-8 pr-2.5 py-2.5"
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
      {isOpen && (
        <div className="px-8 pb-6">
          <p className="font-poppins-regular text-lg text-dark-green">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

const FAQ_ITEMS = [
  {
    question: "What forms of payment do you accept?",
    answer:
      "We accept cash, debit cards, and CanPay. We do not accept traditional credit cards at this time.",
  },
  {
    question: "Do I need a medical card?",
    answer:
      "No. Sweetleaves is a recreational dispensary open to all adults 21 and over. No medical card is required.",
  },
  {
    question: "What should I bring?",
    answer:
      "Just a valid government-issued photo ID showing you are 21 or older. We accept driver\u2019s licenses, passports, and state IDs.",
  },
  {
    question: "Can I shop online?",
    answer:
      "Yes! You can browse our full menu and place an order for in-store pickup through our online ordering system.",
  },
];

export default function AboutFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-parchment border border-sage rounded-[40px] flex flex-col gap-5 md:gap-12 items-center px-4 md:px-10 py-8 md:py-12">
      <div className="flex items-center justify-between w-full">
        <h2 className="font-poppins-bold text-3xl md:text-display text-orange-glow text-center md:text-left flex-1 md:flex-none">
          Common Questions
        </h2>
        <Link
          href="/learn"
          className="hidden md:flex bg-light-gold text-dark-green font-poppins-semibold uppercase text-base px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity"
        >
          View all FAQ
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-5 w-full">
        {FAQ_ITEMS.map((item, i) => (
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
        href="/learn"
        className="md:hidden bg-light-gold text-dark-green font-poppins-semibold uppercase text-base px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity w-full text-center"
      >
        View all FAQ
      </Link>
    </section>
  );
}
