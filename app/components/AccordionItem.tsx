"use client";

import { useState } from "react";

interface Props {
  title: string;
  content: string;
}

export default function AccordionItem({ title, content }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-w-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex gap-[25px] items-start w-full text-left cursor-pointer"
      >
        <span className="bg-orange-glow size-[44px] rounded-full shrink-0 flex items-center justify-center font-poppins-semibold text-[35px] text-white leading-none">
          {open ? "−" : "+"}
        </span>
        <span className="font-poppins-bold text-[20px] text-dark-green leading-none pt-[10px]">
          {title}
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div
            className="font-poppins-regular text-[18px] text-dark-green leading-[1.6] pl-[49px] pt-[10px]"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
}
