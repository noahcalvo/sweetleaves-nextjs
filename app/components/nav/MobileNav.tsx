"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "./links";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  return (
    <div className="md:hidden sticky top-0 z-40">
      <div className="relative bg-dark-green px-5 pt-4 pb-4">
        {/* Top row: logo + hamburger */}
        <div className="flex items-center justify-between">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <Image
              src="/logos-and-icons/logo-hotizontal/Sweetleaves_Logo_White_Horizontal_B.svg"
              alt="Sweetleaves"
              width={234}
              height={33}
              priority
            />
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="w-[47px] h-[25px] relative flex flex-col justify-between"
          >
            <span
              className={`block w-full h-[3px] bg-light-gold rounded-full transition-transform duration-300 origin-center ${
                isOpen ? "translate-y-[11px] rotate-45" : ""
              }`}
            />
            <span
              className={`block w-full h-[3px] bg-light-gold rounded-full transition-opacity duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-full h-[3px] bg-light-gold rounded-full transition-transform duration-300 origin-center ${
                isOpen ? "-translate-y-[11px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>

        {/* Shop Now button — always visible */}
        <Link
          href="/shop"
          onClick={() => setIsOpen(false)}
          className="mt-4 flex items-center justify-center bg-light-gold text-dark-green font-poppins-semibold uppercase text-base py-3.5 rounded-full hover:opacity-90 transition-opacity w-full"
        >
          Shop Now
        </Link>

        {/* Expanded menu */}
        <div
          ref={menuRef}
          className="absolute left-0 right-0 top-full bg-dark-green overflow-hidden transition-[max-height] duration-300 ease-in-out"
          style={{
            maxHeight: isOpen
              ? `${menuRef.current?.scrollHeight ?? 300}px`
              : "0px",
          }}
        >
          <div className="px-5 pb-5 pt-2 flex flex-col items-center gap-3">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="font-poppins-bold text-[15px] text-white uppercase hover:opacity-75 transition-opacity py-1"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
