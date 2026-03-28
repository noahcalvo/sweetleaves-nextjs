# Navbar Design Spec
_Date: 2026-03-28_

## Overview

Rebuild the existing `Nav.tsx` into a server-first navbar with two isolated client components for the only interactive elements: the mobile hamburger menu and the sign-in modal.

## Component Architecture

```
app/components/
  Nav.tsx              — server component, full nav shell (static)
  HamburgerButton.tsx  — client component, mobile toggle + overlay
  SignInButton.tsx     — client component, sign-in modal + iframe
```

`Nav.tsx` is the only component rendered in the root layout. CSS breakpoints handle the responsive difference between desktop and mobile layouts. No two-component/breakpoint switching.

## Nav.tsx (Server Component)

Sticky, full-width bar with `bg-dark-green`.

**Desktop layout (md+):** Three zones via flexbox:
- Left: logo `<img>` placeholder (`alt="sweetleaves"`) — swap for SVG asset when ready
- Center: Next.js `<Link>` elements for ABOUT, LEARN, REWARDS — `text-parchment uppercase tracking-wide`
- Right: `<SignInButton />` then SHOP NOW — ivory pill button linking to `/shop`

**Mobile layout (<md):**
- Left: logo placeholder
- Right: `<HamburgerButton />` — renders as hamburger icon, manages the overlay internally

## HamburgerButton.tsx (Client Component)

Owns `isOpen` boolean state. Renders:
- Hamburger icon (≡) when closed, X when open
- When open: full-screen `bg-dark-green` overlay containing:
  - Logo + X close button at top
  - SHOP NOW ivory pill button (links to `/shop`)
  - ABOUT, LEARN, REWARDS stacked as Next.js `<Link>` elements
  - `<SignInButton />` at bottom

Closing the overlay resets `isOpen` to false.

## SignInButton.tsx (Client Component)

Owns `isModalOpen` boolean state. Renders:
- A SIGN IN button (person icon + label, `text-parchment`)
- When open: a modal overlay with an `<iframe>` pointing to `https://lab.alpineiq.com/wallet/3585`
- Modal is closeable via an X button or clicking the backdrop

AlpineIQ confirmed embeddable — no `X-Frame-Options` or `frame-ancestors` restriction.

## Placeholder Pages

Three new stub routes, each a minimal server component:

- `app/about/page.tsx`
- `app/learn/page.tsx`
- `app/rewards/page.tsx`

## Logo

Use an `<img>` tag with `src="/logo-placeholder.svg"` and `alt="sweetleaves"` until the real SVG asset is available. A simple inline SVG placeholder (text-based) will be created at `public/logo-placeholder.svg`.

## Styling

All colors use the custom Tailwind tokens defined in `tailwind.config.cjs`:
- Nav background: `bg-dark-green`
- Link text: `text-parchment`
- SHOP NOW button: `bg-ivory text-dark-green` rounded-full
- SIGN IN: `text-parchment` with a person icon

## Out of Scope

- Actual auth integration (sign-in is iframe only)
- Animated transitions on the mobile overlay
- Active link highlighting
