"use client";

import { useState } from "react";
import Link from "next/link";

export default function Nav() {
    const [open, setOpen] = useState(false);

    return (
        <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
            <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
                <Link href="/" className="text-xl font-semibold text-black dark:text-zinc-50">SweetLeaves</Link>

                <nav className="hidden sm:flex space-x-4">
                    <Link href="/" className="text-sm text-zinc-700 hover:text-black dark:text-zinc-300 px-4">Home</Link>
                    <Link href="/shop" className="text-sm text-zinc-700 hover:text-black dark:text-zinc-300">Shop</Link>
                </nav>

                <div className="sm:hidden">
                    <button
                        onClick={() => setOpen(!open)}
                        aria-label="Toggle menu"
                        className="inline-flex items-center justify-center rounded-md p-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                            {open ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {open && (
                <div className="sm:hidden border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-black">
                    <div className="px-6 py-4 space-y-3">
                        <Link href="/" className="block text-base text-zinc-700 dark:text-zinc-300">Home</Link>
                        <Link href="/shop" className="block text-base text-zinc-700 dark:text-zinc-300">Shop</Link>
                    </div>
                </div>
            )}
        </header>
    );
}
