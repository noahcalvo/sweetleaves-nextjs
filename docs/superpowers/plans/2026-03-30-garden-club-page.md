# Garden Club (Rewards) Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Garden Club rewards page from the Figma design, replacing the placeholder rewards page with a full-featured loyalty program page, and build the site-wide footer component.

**Architecture:** The page is a server-rendered Next.js page at `/rewards` with one client component (FAQ accordion). Page-specific components live in `app/rewards/components/`. The footer is a shared component in `app/components/`. The page uses a full-width layout with a light blue background and decorative circle pattern.

**Tech Stack:** Next.js 15, React, Tailwind CSS v4 (with `@theme` tokens in `globals.css`), Poppins font (Google Fonts)

**Figma source:** https://www.figma.com/design/rzcly0U0lJ52TjQ2OWAFBs/SweetLeaves-Site-Refresh_Final?node-id=274-2546&m=dev

---

## File Map

### New Files
| File | Responsibility |
|------|---------------|
| `app/rewards/components/GardenClubHero.tsx` | Hero banner — logo, Garden Club image, heading, CTA (server) |
| `app/rewards/components/PointsInfo.tsx` | Left column — "It's Simple", "Using Points", "What You Get" (server) |
| `app/rewards/components/SignUpSection.tsx` | Right column — sign-up heading + form embed placeholder (server) |
| `app/rewards/components/FaqSection.tsx` | FAQ accordion with expand/collapse (client) |
| `app/components/Footer.tsx` | Site-wide footer — logo, links, hours, map, social, compliance (server) |
| `public/rewards/garden-club-text.png` | "Garden Club" script text image (downloaded from Figma) |
| `public/rewards/circles-bg.png` | Decorative circles background image (downloaded from Figma) |
| `public/social/instagram-white.png` | Instagram icon for footer (downloaded from Figma) |
| `public/social/google-logo.png` | Google icon for footer (downloaded from Figma) |
| `public/compliance/mocc-logo.png` | MN Office of Cannabis Management logo (downloaded from Figma) |

### Modified Files
| File | Change |
|------|--------|
| `app/globals.css` | Add `--color-sky-blue` token, Poppins font utilities |
| `app/layout.tsx` | Add Poppins weights 400+600, remove `max-w-3xl` wrapper from main, replace inline footer with `<Footer />` |
| `app/rewards/page.tsx` | Replace placeholder with full Garden Club page |

---

## Out of Scope

These elements appear in the Figma but are **not part of this plan**:
- **Looping marquee banner** — site-wide element, separate task
- **Category pill buttons** (Flower, Pre-rolls, etc.) — site-wide element below nav, separate task
- **Nav bar redesign** (rounded pill shape) — the existing nav works, restyling is separate

---

### Task 1: Foundation — Font Weights, Color Token, Layout Wrapper

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add Poppins font weights 400 and 600**

In `app/layout.tsx`, update the Poppins import to include all three weights used in the design:

```tsx
const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});
```

- [ ] **Step 2: Add sky-blue color token and Poppins weight utilities**

In `app/globals.css`, add the new color token inside the existing `@theme {}` block:

```css
--color-sky-blue: #DAF5FF;
```

Add new font-weight utilities after the existing `@utility font-poppins` block:

```css
@utility font-poppins-regular {
  font-family: var(--font-poppins);
  font-weight: 400;
}

@utility font-poppins-semibold {
  font-family: var(--font-poppins);
  font-weight: 600;
}

@utility font-poppins-bold {
  font-family: var(--font-poppins);
  font-weight: 700;
}
```

- [ ] **Step 3: Remove constraining wrapper from layout.tsx main**

In `app/layout.tsx`, change:

```tsx
<main className="flex-1 w-full">
  <div className="mx-auto w-full max-w-3xl px-6 py-8">{children}</div>
</main>
```

To:

```tsx
<main className="flex-1 w-full">{children}</main>
```

Each page already controls its own container (home page has `max-w-4xl`), and the new rewards page needs full-width layout. The placeholder pages (about, learn) will be fine without the wrapper — they'll get their own containers when built out.

- [ ] **Step 4: Verify the dev server starts without errors**

Run: `npm run dev`

Visit the home page — it should render unchanged since it has its own container.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: add Poppins 400/600 weights, sky-blue token, remove layout wrapper"
```

---

### Task 2: Download and Place Image Assets

**Files:**
- Create: `public/rewards/garden-club-text.png`
- Create: `public/rewards/circles-bg.png`
- Create: `public/social/instagram-white.png`
- Create: `public/social/google-logo.png`
- Create: `public/compliance/mocc-logo.png`

These assets come from the Figma MCP server. The URLs expire in 7 days from 2026-03-30.

- [ ] **Step 1: Create directories**

```bash
mkdir -p public/rewards public/social public/compliance
```

- [ ] **Step 2: Download assets from Figma**

```bash
curl -L -o public/rewards/garden-club-text.png "https://www.figma.com/api/mcp/asset/c9c4282e-d951-41a4-a0c3-922c8473b98d"
curl -L -o public/rewards/circles-bg.png "https://www.figma.com/api/mcp/asset/9c216b47-ed8a-4cb9-acd3-6ba50c680b69"
curl -L -o public/social/instagram-white.png "https://www.figma.com/api/mcp/asset/a4968b7f-7d1b-44cc-a63b-91a6f8f4c9b8"
curl -L -o public/social/google-logo.png "https://www.figma.com/api/mcp/asset/73712761-4a28-4340-8f69-b229813a38f1"
curl -L -o public/compliance/mocc-logo.png "https://www.figma.com/api/mcp/asset/10fe1edd-61f4-4f95-864c-8606fd4fc6a5"
```

- [ ] **Step 3: Verify assets downloaded correctly**

```bash
file public/rewards/garden-club-text.png
file public/rewards/circles-bg.png
file public/social/instagram-white.png
file public/social/google-logo.png
file public/compliance/mocc-logo.png
```

Each should report as a PNG/image file, not HTML (which would indicate a failed download).

- [ ] **Step 4: Commit**

```bash
git add public/rewards/ public/social/ public/compliance/
git commit -m "feat: add Garden Club page and footer image assets"
```

---

### Task 3: GardenClubHero Component

**Files:**
- Create: `app/rewards/components/GardenClubHero.tsx`

This is the dark green hero banner with the Sweetleaves logo, "Garden Club" script text, "Loyalty Perks & Points" heading, and "Check Your Rewards" CTA button.

- [ ] **Step 1: Create the component**

```tsx
// app/rewards/components/GardenClubHero.tsx
import Image from "next/image";
import Link from "next/link";

export default function GardenClubHero() {
  return (
    <section className="bg-dark-green rounded-[40px] flex flex-col items-center justify-center px-10 py-10 gap-0">
      <Image
        src="/logos-and-icons/logo-hotizontal/Sweetleaves_Logo_White_Horizontal_B.svg"
        alt="Sweetleaves"
        width={478}
        height={68}
      />
      <Image
        src="/rewards/garden-club-text.png"
        alt="Garden Club"
        width={817}
        height={143}
        className="max-w-full h-auto"
      />
      <h1 className="font-poppins-bold text-display text-white text-center">
        Loyalty Perks &amp; Points
      </h1>
      <Link
        href="/rewards#signup"
        className="mt-4 bg-light-gold text-dark-green font-poppins-semibold uppercase text-base px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity"
      >
        Check Your Rewards
      </Link>
    </section>
  );
}
```

- [ ] **Step 2: Verify it renders**

Run: `npm run dev`

The component isn't wired up yet, but verify no TypeScript errors with: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add app/rewards/components/GardenClubHero.tsx
git commit -m "feat: add GardenClubHero component"
```

---

### Task 4: PointsInfo Component (Left Column)

**Files:**
- Create: `app/rewards/components/PointsInfo.tsx`

This is the left column containing three sections: "It's Simple" (with the $1 = 1 point pill), "Using Points" (two reward cards), and "What You Get" (four benefit cards).

- [ ] **Step 1: Create the component**

```tsx
// app/rewards/components/PointsInfo.tsx

interface BenefitCardProps {
  title: string;
  description: string;
}

function BenefitCard({ title, description }: BenefitCardProps) {
  return (
    <div className="bg-white rounded-[30px] p-3.5 flex flex-col gap-5 flex-1 items-center">
      <div className="bg-light-gold rounded-full px-6 py-3 w-full flex items-center justify-center">
        <span className="font-poppins-bold text-xl text-dark-sage text-center">
          {title}
        </span>
      </div>
      <p className="font-poppins-regular text-lg text-center">{description}</p>
    </div>
  );
}

export default function PointsInfo() {
  return (
    <div className="bg-parchment border border-sage rounded-[50px] py-2.5 flex flex-col gap-2.5 flex-1">
      {/* It's Simple */}
      <div className="flex flex-col items-center justify-center gap-7 px-10 py-12">
        <h2 className="font-poppins-bold text-display text-dark-green text-center">
          It&apos;s Simple
        </h2>
        <div className="bg-light-gold rounded-full px-2.5 py-5 w-full max-w-xl flex items-center justify-center">
          <span className="font-poppins-bold text-5xl text-dark-green uppercase text-center">
            $1 Spent = 1 point
          </span>
        </div>
        <p className="font-poppins-regular text-lg text-dark-green text-center max-w-lg">
          Points add up automatically when you use your phone number or email at
          checkout. You must be subscribed to our marketing communications to be
          in the Garden Club.
        </p>
      </div>

      {/* Using Points */}
      <div className="flex flex-col items-center justify-center gap-4 px-9 py-10">
        <h2 className="font-poppins-bold text-display text-dark-green text-center">
          Using Points
        </h2>
        <div className="flex gap-2.5 w-full">
          <div className="bg-white rounded-[40px] px-5 py-6 flex items-center flex-1">
            <p className="font-poppins-bold text-2xl text-orange-glow text-center flex-1">
              100 points = $3 off any purchase
            </p>
          </div>
          <div className="bg-white rounded-[40px] px-5 py-6 flex items-center flex-1">
            <p className="font-poppins-bold text-2xl text-orange-glow text-center flex-1">
              75 points = $5 off any Sweetleaves edible
            </p>
          </div>
        </div>
      </div>

      {/* What You Get */}
      <div className="flex flex-col items-start gap-9 px-10 py-10">
        <h2 className="font-poppins-bold text-display text-dark-green text-center w-full">
          What You Get
        </h2>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex gap-2.5">
            <BenefitCard
              title="Double Points Days"
              description="Members will be included in exclusive double points days, we'll text or email you when it's happening."
            />
            <BenefitCard
              title="Birthday Reward"
              description="Complimentary Edible. Redeemable for 5 days before and after your birthday."
            />
          </div>
          <div className="flex gap-2.5">
            <BenefitCard
              title="Early Access"
              description="Get first dibs when new products drop or popular items restock. Members hear first."
            />
            <BenefitCard
              title="Quarterly Giveaways"
              description="Any Garden Club member who spends over $X per month is automatically entered to win tickets to local events like concerts, sports games, and shows."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add app/rewards/components/PointsInfo.tsx
git commit -m "feat: add PointsInfo component with earning, using, and benefits sections"
```

---

### Task 5: SignUpSection Component (Right Column)

**Files:**
- Create: `app/rewards/components/SignUpSection.tsx`

This is the right column with "Sign Up For The Garden Club" heading and a form embed placeholder. The actual sign-up form embed (likely AlpineIQ) will be wired up later.

- [ ] **Step 1: Create the component**

```tsx
// app/rewards/components/SignUpSection.tsx

export default function SignUpSection() {
  return (
    <div
      id="signup"
      className="bg-white border border-sage rounded-[50px] flex flex-col items-center w-full h-full"
    >
      <h2 className="font-poppins-bold text-display text-dark-green text-center px-8 pt-12 leading-tight">
        Sign Up For The Garden Club
      </h2>
      <div className="flex-1 flex items-center justify-center w-full px-8 pb-12">
        <p className="font-poppins-bold text-lg text-center">
          SIGN UP FORM EMBED
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/rewards/components/SignUpSection.tsx
git commit -m "feat: add SignUpSection component with form embed placeholder"
```

---

### Task 6: FaqSection Component

**Files:**
- Create: `app/rewards/components/FaqSection.tsx`

This is a client component because the accordion items expand/collapse on click. The design shows 6 FAQ items in a 2-column grid with orange arrow buttons.

- [ ] **Step 1: Create the component**

```tsx
// app/rewards/components/FaqSection.tsx
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
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add app/rewards/components/FaqSection.tsx
git commit -m "feat: add FaqSection component with accordion interactivity"
```

---

### Task 7: Rewards Page Assembly

**Files:**
- Modify: `app/rewards/page.tsx`

Wire all sections together with the light blue background, decorative circles, and proper spacing.

- [ ] **Step 1: Replace the placeholder page**

```tsx
// app/rewards/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import GardenClubHero from "./components/GardenClubHero";
import PointsInfo from "./components/PointsInfo";
import SignUpSection from "./components/SignUpSection";
import FaqSection from "./components/FaqSection";

export const metadata: Metadata = {
  title: "Garden Club Rewards",
  description:
    "Join the Sweetleaves Garden Club. Earn points on every purchase and enjoy exclusive perks, birthday rewards, and more.",
};

export default function RewardsPage() {
  return (
    <div className="relative bg-sky-blue min-h-screen overflow-hidden">
      {/* Decorative background circles */}
      <Image
        src="/rewards/circles-bg.png"
        alt=""
        fill
        className="object-cover pointer-events-none"
        priority={false}
      />

      <div className="relative z-10 max-w-[1365px] mx-auto px-6 py-8 flex flex-col gap-8">
        <GardenClubHero />

        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <PointsInfo />
          </div>
          <div className="w-[650px] shrink-0">
            <SignUpSection />
          </div>
        </div>

        <FaqSection />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the page renders**

Run: `npm run dev`

Visit `http://localhost:3000/rewards` and verify:
- Light blue background with circle decoration visible
- Hero banner with logo, Garden Club text, heading, and CTA
- Two-column layout: points info on left, sign-up on right
- FAQ section with expandable accordion items
- All text uses Poppins at correct weights

- [ ] **Step 3: Commit**

```bash
git add app/rewards/page.tsx
git commit -m "feat: assemble Garden Club rewards page with all sections"
```

---

### Task 8: Footer Component

**Files:**
- Create: `app/components/Footer.tsx`

The footer is a dark sage container with rounded top corners, containing: logo + tagline row, 4-column link grid (Shop, Info, Visit, Hours), map placeholder, social links, rewards CTA, and compliance info.

- [ ] **Step 1: Create the footer component**

```tsx
// app/components/Footer.tsx
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark-sage rounded-t-[40px] px-10 md:px-[73px] py-14 flex flex-col gap-12">
      {/* Top row: Logo + tagline */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex flex-col gap-2.5">
          <p className="font-poppins-regular text-xl text-white">
            You&apos;re not lazy, you&apos;re living.
          </p>
          <Link href="/">
            <Image
              src="/logos-and-icons/logo-hotizontal/Sweetleaves_Logo_White_Horizontal_B.svg"
              alt="Sweetleaves"
              width={428}
              height={77}
            />
          </Link>
        </div>
        <p className="font-poppins-bold text-3xl text-light-gold leading-none">
          Cannabis for real life.
          <br />
          Located in North Loop Minneapolis.
        </p>
      </div>

      {/* Link columns */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-[70px]">
        {/* Shop */}
        <div className="flex flex-col gap-1.5">
          <h3 className="font-poppins-bold text-lg text-ivory uppercase">
            Shop
          </h3>
          <nav className="flex flex-col">
            <Link
              href="/shop"
              className="font-poppins-regular text-lg text-white py-0.5 hover:opacity-75 transition-opacity"
            >
              Products
            </Link>
            <span className="font-poppins-regular text-lg text-white py-0.5">
              Brands
            </span>
            <Link
              href="/learn"
              className="font-poppins-regular text-lg text-white py-0.5 hover:opacity-75 transition-opacity"
            >
              Learn
            </Link>
            <Link
              href="/shop"
              className="font-poppins-regular text-lg text-white py-0.5 hover:opacity-75 transition-opacity"
            >
              Order Online
            </Link>
          </nav>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1.5">
          <h3 className="font-poppins-bold text-lg text-ivory uppercase">
            Info
          </h3>
          <nav className="flex flex-col">
            <Link
              href="/rewards"
              className="font-poppins-regular text-lg text-white py-0.5 hover:opacity-75 transition-opacity"
            >
              Garden Club
            </Link>
            <span className="font-poppins-regular text-lg text-white py-0.5">
              FAQ
            </span>
            <span className="font-poppins-regular text-lg text-white py-0.5">
              Events
            </span>
            <span className="font-poppins-regular text-lg text-white py-0.5">
              Careers
            </span>
          </nav>
        </div>

        {/* Visit */}
        <div className="flex flex-col gap-1.5">
          <h3 className="font-poppins-bold text-lg text-ivory uppercase">
            Visit
          </h3>
          <div className="flex flex-col">
            <p className="font-poppins-regular text-lg text-white">
              905 N Washington Ave
              <br />
              Minneapolis, MN 55401
            </p>
            <a
              href="tel:612-688-9333"
              className="font-poppins-regular text-lg text-white hover:opacity-75 transition-opacity"
            >
              612-688-9333
            </a>
          </div>
        </div>

        {/* Hours */}
        <div className="flex flex-col gap-1.5">
          <h3 className="font-poppins-bold text-lg text-ivory uppercase">
            Hours
          </h3>
          <div className="flex flex-col">
            <span className="font-poppins-regular text-lg text-white">Monday: 10am-9pm</span>
            <span className="font-poppins-regular text-lg text-white">Tuesday: 10am-9pm</span>
            <span className="font-poppins-regular text-lg text-white">Wednesday: 10am-9pm</span>
            <span className="font-poppins-regular text-lg text-white">Thursday: 10am-10pm</span>
            <span className="font-poppins-regular text-lg text-white">Friday: 10am-10pm</span>
            <span className="font-poppins-regular text-lg text-white">Saturday: 9am-10pm</span>
            <span className="font-poppins-regular text-lg text-white">Sunday: 11am-6pm</span>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
        {/* Left: map + social */}
        <div className="flex flex-col gap-5">
          <div className="bg-gray-300 rounded-[10px] w-[429px] h-[163px] flex items-center justify-center">
            <span className="font-poppins-semibold text-base uppercase">
              Map embed
            </span>
          </div>
          <div className="flex gap-5 items-end">
            <Link
              href="/rewards"
              className="bg-light-gold text-dark-green font-poppins-semibold uppercase text-base px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity"
            >
              Sign Up For Rewards
            </Link>
            <div className="flex gap-3.5 items-center">
              <a
                href="https://www.instagram.com/sweetleaves.northloop/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/social/instagram-white.png"
                  alt="Sweetleaves on Instagram"
                  width={46}
                  height={46}
                />
              </a>
              <a
                href="https://www.google.com/maps?cid=5889851026020320896"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/social/google-logo.png"
                  alt="Sweetleaves on Google"
                  width={48}
                  height={49}
                />
              </a>
            </div>
          </div>
        </div>

        {/* Right: compliance */}
        <div className="flex flex-col gap-7">
          <Image
            src="/compliance/mocc-logo.png"
            alt="Minnesota Office of Cannabis Management"
            width={387}
            height={49}
          />
          <div className="font-poppins-regular text-[15px] text-white leading-normal">
            <p>
              Sweetleaves sells Minnesota-compliant cannabis products to adults
              21+.
            </p>
            <p>
              &copy; {new Date().getFullYear()} Sweetleaves. All rights
              reserved. License#MICRO-L24-000257
            </p>
            <p>Privacy Policy | Terms of Use | Certificate of Analysis</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add app/components/Footer.tsx
git commit -m "feat: add site-wide Footer component with links, hours, social, and compliance"
```

---

### Task 9: Integrate Footer into Layout

**Files:**
- Modify: `app/layout.tsx`

Replace the inline footer with the new `Footer` component.

- [ ] **Step 1: Import Footer and replace inline footer**

In `app/layout.tsx`, add the import at the top:

```tsx
import Footer from "./components/Footer";
```

Replace the entire inline `<footer>` block:

```tsx
<footer className="w-full border-t border-zinc-200 dark:border-zinc-800">
  <div className="mx-auto w-full max-w-3xl px-6 py-6 text-sm text-zinc-600 dark:text-zinc-400">
    &copy; {new Date().getFullYear()} SweetLeaves
  </div>
</footer>
```

With:

```tsx
<Footer />
```

- [ ] **Step 2: Verify all pages render with the new footer**

Run: `npm run dev`

Visit each page and confirm the footer renders correctly:
- `http://localhost:3000/` — home page
- `http://localhost:3000/rewards` — Garden Club page
- `http://localhost:3000/shop` — shop page

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: replace inline footer with Footer component in layout"
```

---

## Visual Validation Checklist

After all tasks are complete, validate against the Figma screenshot:

- [ ] Light blue (#DAF5FF) background with decorative circles
- [ ] Hero: dark green rounded box, white logo, Garden Club script text, heading, yellow CTA
- [ ] Left column: parchment background, rounded, contains three info sections
- [ ] "$1 SPENT = 1 POINT" pill in light gold
- [ ] Points redemption cards show orange text
- [ ] "What You Get" benefit cards have light gold headers
- [ ] Right column: white background, rounded, "Sign Up" heading (form embed placeholder)
- [ ] FAQ: parchment background, 2-column grid, orange circle arrow buttons
- [ ] FAQ accordion expands/collapses on click
- [ ] Footer: dark sage background, rounded top corners, all link columns, hours, social icons
- [ ] All text uses Poppins at correct weights (400/600/700)
- [ ] All colors use design tokens (no raw hex values)
