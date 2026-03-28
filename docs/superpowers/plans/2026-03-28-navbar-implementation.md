# Navbar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing monolithic `Nav.tsx` with a server-first navbar composed of `DesktopNav.tsx`, `MobileNav.tsx`, and a shared `SignInButton.tsx` client component.

**Architecture:** `Nav.tsx` becomes a thin server orchestrator rendering both layout components side-by-side; CSS breakpoints (`hidden md:flex` / `flex md:hidden`) handle visibility. Only `MobileNav.tsx` and `SignInButton.tsx` are client components — all other nav code is server-rendered.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, TypeScript, Jest + React Testing Library

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `app/about/page.tsx` | Placeholder About route |
| Create | `app/learn/page.tsx` | Placeholder Learn route |
| Create | `app/rewards/page.tsx` | Placeholder Rewards route |
| Create | `jest.config.ts` | Jest configuration |
| Create | `jest.setup.ts` | jest-dom matchers setup |
| Create | `app/components/SignInButton.tsx` | Client: sign-in button + AlpineIQ iframe modal |
| Create | `app/components/__tests__/SignInButton.test.tsx` | Tests for SignInButton |
| Create | `app/components/DesktopNav.tsx` | Server: desktop nav shell |
| Create | `app/components/MobileNav.tsx` | Client: mobile nav + hamburger overlay |
| Create | `app/components/__tests__/MobileNav.test.tsx` | Tests for MobileNav |
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

### Task 2: Set up Jest + React Testing Library

**Files:**
- Create: `jest.config.ts`
- Create: `jest.setup.ts`
- Modify: `package.json` (add test script)

- [ ] **Step 1: Install dependencies**

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @types/jest
```

- [ ] **Step 2: Create `jest.config.ts`**

```ts
import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
};

export default createJestConfig(config);
```

- [ ] **Step 3: Create `jest.setup.ts`**

```ts
import '@testing-library/jest-dom';
```

- [ ] **Step 4: Add test script to `package.json`**

Add `"test": "jest"` to the `scripts` block:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "jest"
}
```

- [ ] **Step 5: Verify Jest runs (no tests yet)**

```bash
npm test -- --passWithNoTests
```

Expected output: `No tests found, exiting with code 0` or similar pass.

- [ ] **Step 6: Commit**

```bash
git add jest.config.ts jest.setup.ts package.json package-lock.json
git commit -m "chore: set up Jest and React Testing Library"
```

---

### Task 3: Build SignInButton with TDD

**Files:**
- Create: `app/components/__tests__/SignInButton.test.tsx`
- Create: `app/components/SignInButton.tsx`

- [ ] **Step 1: Write the failing tests**

Create `app/components/__tests__/SignInButton.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import SignInButton from '../SignInButton';

describe('SignInButton', () => {
  it('renders the sign in button', () => {
    render(<SignInButton />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('opens the modal when sign in button is clicked', () => {
    render(<SignInButton />);
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByTitle('Sign In')).toBeInTheDocument();
  });

  it('modal contains iframe pointing to AlpineIQ wallet', () => {
    render(<SignInButton />);
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    const iframe = screen.getByTitle('Sign In');
    expect(iframe).toHaveAttribute('src', 'https://lab.alpineiq.com/wallet/3585');
  });

  it('closes the modal when close button is clicked', () => {
    render(<SignInButton />);
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByTitle('Sign In')).not.toBeInTheDocument();
  });

  it('closes the modal when backdrop is clicked', () => {
    render(<SignInButton />);
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    fireEvent.click(screen.getByTestId('modal-backdrop'));
    expect(screen.queryByTitle('Sign In')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- SignInButton
```

Expected: FAIL — `Cannot find module '../SignInButton'`

- [ ] **Step 3: Create `app/components/SignInButton.tsx`**

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        Sign In
      </button>

      {isOpen && (
        <div
          data-testid="modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative bg-white rounded-lg w-full max-w-md h-[600px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
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

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- SignInButton
```

Expected: PASS — 5 tests passing

- [ ] **Step 5: Commit**

```bash
git add app/components/SignInButton.tsx app/components/__tests__/SignInButton.test.tsx
git commit -m "feat: add SignInButton with AlpineIQ iframe modal"
```

---

### Task 4: Build DesktopNav

**Files:**
- Create: `app/components/DesktopNav.tsx`

No logic to test — this is static server-rendered markup.

- [ ] **Step 1: Create `app/components/DesktopNav.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import SignInButton from "./SignInButton";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/learn", label: "Learn" },
  { href: "/rewards", label: "Rewards" },
];

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
git add app/components/DesktopNav.tsx
git commit -m "feat: add DesktopNav server component"
```

---

### Task 5: Build MobileNav with TDD

**Files:**
- Create: `app/components/__tests__/MobileNav.test.tsx`
- Create: `app/components/MobileNav.tsx`

- [ ] **Step 1: Write the failing tests**

Create `app/components/__tests__/MobileNav.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import MobileNav from '../MobileNav';

describe('MobileNav', () => {
  it('renders the hamburger button when closed', () => {
    render(<MobileNav />);
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
  });

  it('does not show nav links when closed', () => {
    render(<MobileNav />);
    expect(screen.queryByRole('link', { name: /about/i })).not.toBeInTheDocument();
  });

  it('shows the overlay with nav links when hamburger is clicked', () => {
    render(<MobileNav />);
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /learn/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /rewards/i })).toBeInTheDocument();
  });

  it('shows Shop Now link in the overlay', () => {
    render(<MobileNav />);
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    expect(screen.getByRole('link', { name: /shop now/i })).toBeInTheDocument();
  });

  it('closes the overlay when the close button is clicked', () => {
    render(<MobileNav />);
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    fireEvent.click(screen.getByRole('button', { name: /close menu/i }));
    expect(screen.queryByRole('link', { name: /about/i })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- MobileNav
```

Expected: FAIL — `Cannot find module '../MobileNav'`

- [ ] **Step 3: Create `app/components/MobileNav.tsx`**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SignInButton from "./SignInButton";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/learn", label: "Learn" },
  { href: "/rewards", label: "Rewards" },
];

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
        className="text-parchment"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
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
              className="text-parchment"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
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

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- MobileNav
```

Expected: PASS — 5 tests passing

- [ ] **Step 5: Commit**

```bash
git add app/components/MobileNav.tsx app/components/__tests__/MobileNav.test.tsx
git commit -m "feat: add MobileNav client component with hamburger overlay"
```

---

### Task 6: Replace Nav.tsx with thin orchestrator

**Files:**
- Modify: `app/components/Nav.tsx`

- [ ] **Step 1: Replace the contents of `app/components/Nav.tsx`**

Remove all existing content and replace with:

```tsx
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

export default function Nav() {
  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  );
}
```

Note: `"use client"` is intentionally omitted — this is a server component.

- [ ] **Step 2: Run all tests**

```bash
npm test
```

Expected: PASS — all tests passing

- [ ] **Step 3: Commit**

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

Expected: Build completes with no errors. You may see warnings about missing `width`/`height` on SVG images — these are safe to ignore if present.

- [ ] **Step 2: Spot-check in browser**

```bash
npm run dev
```

Open `http://localhost:3000` and verify:
- Desktop (≥768px): dark green bar, ivory logo, ABOUT/LEARN/REWARDS links centered, SIGN IN + SHOP NOW pill on right
- Mobile (<768px): dark green bar, logo left, hamburger right; tap hamburger to open full-screen overlay with SHOP NOW, nav links, and SIGN IN at bottom
- SIGN IN opens the AlpineIQ iframe modal; clicking backdrop or X closes it
- ABOUT, LEARN, REWARDS routes load placeholder pages without errors
