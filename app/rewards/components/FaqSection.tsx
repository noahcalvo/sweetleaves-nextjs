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
        className="w-full flex items-center justify-between gap-7 p-2.5"
      >
        <span className="font-poppins-bold text-xl text-dark-green pl-6 text-left">
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
    question: "How much does it cost to join?",
    answer:
      "The Garden Club is completely free to join. Simply provide your phone number or email at checkout to start earning points.",
  },
  {
    question: "How do I sign up?",
    answer:
      "You can sign up in-store at checkout or online through our rewards portal. Just provide your phone number or email to get started.",
  },
  {
    question: "Do my points expire?",
    answer:
      "Points remain active as long as you make at least one purchase every 6 months. After 6 months of inactivity, points may expire.",
  },
  {
    question: "Can I check my points balance?",
    answer:
      "Yes! You can check your points balance by signing in to your account on our website or by asking a team member at checkout.",
  },
  {
    question: "What if I forget to use my phone number?",
    answer:
      "No worries — just let a team member know on your next visit and they can look up your recent purchases and apply the points retroactively.",
  },
  {
    question: "What if I return something?",
    answer:
      "If you return a product, the points earned from that purchase will be deducted from your balance.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-parchment border border-sage rounded-[40px] flex flex-col gap-12 items-center px-10 py-12">
      <div className="flex items-center justify-between w-full">
        <h2 className="font-poppins-bold text-display text-orange-glow">
          Common Questions
        </h2>
        <Link
          href="/learn"
          className="bg-light-gold text-dark-green font-poppins-semibold uppercase text-base px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity"
        >
          View all FAQ
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-5 w-full">
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
    </section>
  );
}
