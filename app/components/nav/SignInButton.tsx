"use client";

import { useState } from "react";

export default function SignInButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-light-gold font-poppins-bold text-[15px] uppercase"
      >
        {/* TODO: replace ⊙ with user icon asset from public/ */}
        <span aria-hidden="true">⊙</span>
        Sign In
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-almost-black/60"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative bg-ivory rounded-lg w-full max-w-md h-sign-in-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 text-sage hover:text-almost-black"
            >
              {/* TODO: replace ✕ with close icon asset from public/ */}
              <span aria-hidden="true">✕</span>
            </button>
            <iframe
              src="https://lab.alpineiq.com/wallet/3585"
              className="w-full h-full rounded-lg"
              title="Sign In"
            />
          </div>
        </div>
      )}
    </>
  );
}
