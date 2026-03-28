"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SignInButton from "./SignInButton";
import { NAV_LINKS } from "./links";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="flex md:hidden w-full bg-dark-green sticky top-0 z-40 items-center justify-between px-6 py-4">
      <Link href="/">
        <Image
          src="/logos-and-icons/logo-hotizontal/Sweetleaves_Logo_Ivory_Horizontal_A.svg"
          alt="Sweetleaves"
          width={130}
          height={32}
          priority
        />
      </Link>

      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        className="text-parchment text-2xl leading-none"
      >
        {/* TODO: replace ☰ with hamburger icon asset from public/ */}
        <span aria-hidden="true">☰</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-dark-green flex flex-col px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <Image
                src="/logos-and-icons/logo-hotizontal/Sweetleaves_Logo_Ivory_Horizontal_A.svg"
                alt="Sweetleaves"
                width={130}
                height={32}
              />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="text-parchment text-2xl leading-none"
            >
              {/* TODO: replace ✕ with close icon asset from public/ */}
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          <div className="flex flex-col items-center gap-8 mt-12">
            <Link
              href="/shop"
              onClick={() => setIsOpen(false)}
              className="bg-ivory text-dark-green uppercase tracking-wide text-sm font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Shop Now
            </Link>
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="text-parchment uppercase tracking-wide text-sm hover:opacity-75 transition-opacity"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="mt-auto mb-6 flex justify-center">
            <SignInButton />
          </div>
        </div>
      )}
    </header>
  );
}
