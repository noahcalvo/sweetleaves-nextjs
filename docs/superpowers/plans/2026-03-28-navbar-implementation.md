# Navbar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing monolithic `Nav.tsx` with a server-first navbar composed of `DesktopNav.tsx`, `MobileNav.tsx`, and a shared `SignInButton.tsx` client component.

**Architecture:** `Nav.tsx` becomes a thin server orchestrator rendering both layout components side-by-side; CSS breakpoints (`hidden md:flex` / `flex md:hidden`) handle visibility. Only `MobileNav.tsx` and `SignInButton.tsx` are client components — all other nav code is server-rendered. Nav links are defined once in `links.ts` and shared between both layout components.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, TypeScript

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `app/about/page.tsx` | Placeholder About route |
| Create | `app/learn/page.tsx` | Placeholder Learn route |
| Create | `app/rewards/page.tsx` | Placeholder Rewards route |
| Create | `app/components/nav/links.ts` | Shared nav link definitions |
| Create | `app/components/nav/SignInButton.tsx` | Client: sign-in button + AlpineIQ iframe modal |
| Create | `app/components/nav/DesktopNav.tsx` | Server: desktop nav shell |
| Create | `app/components/nav/MobileNav.tsx` | Client: mobile nav + hamburger overlay |
| Modify | `app/components/Nav.tsx` | Replace with thin server orchestrator |

---

### Task 1: Create placeholder pages

**Files:**
- Create: `app/about/page.tsx`
- Create: `app/learn/page.tsx`
- Create: `app/rewards/page.tsx`

- [ ] **Step 1: Create `app/about/page.tsx`**

```tsx
export default function AboutPage() {
  return (
    <main>
      <h1>About</h1>
    </main>
  );
}
```

- [ ] **Step 2: Create `app/learn/page.tsx`**

```tsx
export default function LearnPage() {
  return (
    <main>
      <h1>Learn</h1>
    </main>
  );
}
```

- [ ] **Step 3: Create `app/rewards/page.tsx`**

```tsx
export default function RewardsPage() {
  return (
    <main>
      <h1>Rewards</h1>
    </main>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/about/page.tsx app/learn/page.tsx app/rewards/page.tsx
git commit -m "feat: add placeholder About, Learn, Rewards pages"
```

---

### Task 2: Create shared nav links

**Files:**
- Create: `app/components/nav/links.ts`

- [ ] **Step 1: Create `app/components/nav/links.ts`**

```ts
export const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/learn", label: "Learn" },
  { href: "/rewards", label: "Rewards" },
] as const;
```

- [ ] **Step 2: Commit**

```bash
git add app/components/nav/links.ts
git commit -m "feat: add shared nav links definition"
```

---

### Task 3: Build SignInButton

**Files:**
- Create: `app/components/nav/SignInButton.tsx`

- [ ] **Step 1: Create `app/components/nav/SignInButton.tsx`**

```tsx
"use client";

import { useState } from "react";

export default function SignInButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-parchment uppercase tracking-wide text-sm"
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
```

- [ ] **Step 2: Commit**

```bash
git add app/components/nav/SignInButton.tsx
git commit -m "feat: add SignInButton with AlpineIQ iframe modal"
```

---

### Task 4: Build DesktopNav

**Files:**
- Create: `app/components/nav/DesktopNav.tsx`

- [ ] **Step 1: Create `app/components/nav/DesktopNav.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import SignInButton from "./SignInButton";
import { NAV_LINKS } from "./links";

export default function DesktopNav() {
  return (
    <header className="hidden md:flex w-full bg-dark-green sticky top-0 z-40 items-center justify-between px-8 py-4">
      <Link href="/">
        <Image
          src="/logos-and-icons/logo-hotizontal/Sweetleaves_Logo_Ivory_Horizontal_A.svg"
          alt="sweetleaves"
          width={160}
          height={40}
          priority
        />
      </Link>

      <nav className="flex items-center gap-8">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-parchment uppercase tracking-wide text-sm hover:opacity-75 transition-opacity"
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        <SignInButton />
        <Link
          href="/shop"
          className="bg-ivory text-dark-green uppercase tracking-wide text-sm font-semibold px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
        >
          Shop Now
        </Link>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/nav/DesktopNav.tsx
git commit -m "feat: add DesktopNav server component"
```

---

### Task 5: Build MobileNav

**Files:**
- Create: `app/components/nav/MobileNav.tsx`

- [ ] **Step 1: Create `app/components/nav/MobileNav.tsx`**

```tsx
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
          alt="sweetleaves"
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
                alt="sweetleaves"
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
```

- [ ] **Step 2: Commit**

```bash
git add app/components/nav/MobileNav.tsx
git commit -m "feat: add MobileNav client component with hamburger overlay"
```

---

### Task 6: Replace Nav.tsx with thin orchestrator

**Files:**
- Modify: `app/components/Nav.tsx`

- [ ] **Step 1: Replace the contents of `app/components/Nav.tsx`**

```tsx
import DesktopNav from "./nav/DesktopNav";
import MobileNav from "./nav/MobileNav";

export default function Nav() {
  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/Nav.tsx
git commit -m "refactor: replace Nav with thin server orchestrator"
```

---

### Task 7: Verify production build

- [ ] **Step 1: Run the build**

```bash
npm run build
```

Expected: completes with no errors.

- [ ] **Step 2: Spot-check in browser**

```bash
npm run dev
```

Open `http://localhost:3000` and verify:
- Desktop (≥768px): dark green bar, ivory logo left, ABOUT/LEARN/REWARDS centered, SIGN IN + SHOP NOW pill right
- Mobile (<768px): dark green bar, logo left, hamburger right; tap to open full-screen overlay with SHOP NOW, nav links, SIGN IN at bottom
- SIGN IN opens the AlpineIQ iframe modal; clicking backdrop or X closes it
- ABOUT, LEARN, REWARDS routes load placeholder pages without errors
