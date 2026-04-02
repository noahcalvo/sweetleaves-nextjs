"use client";

import { useState, useEffect } from "react";

export default function SignInButton() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

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
            className="relative bg-ivory rounded-lg w-full max-w-md overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 text-sage hover:text-almost-black z-10"
            >
              {/* TODO: replace ✕ with close icon asset from public/ */}
              <span aria-hidden="true">✕</span>
            </button>
            <iframe
              src="https://lab.alpineiq.com/wallet/3585"
              className="w-full rounded-lg"
              style={{ height: "min(1200px, 90vh)" }}
              title="Sign In"
            />
          </div>
        </div>
      )}
    </>
  );
}
