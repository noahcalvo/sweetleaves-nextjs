# Navbar Design Spec
_Date: 2026-03-28_

## Overview

Rebuild the existing `Nav.tsx` into a thin orchestrator that composes two designated layout components — one for desktop, one for mobile — plus a shared sign-in modal client component.

## Component Architecture

```
app/components/
  Nav.tsx              — server component, thin orchestrator (renders DesktopNav + MobileNav)
  DesktopNav.tsx       — server component, desktop shell + static links
  MobileNav.tsx        — client component, hamburger toggle + mobile overlay
  SignInButton.tsx     — client component, sign-in modal + iframe (shared)
```

`Nav.tsx` is the only component rendered in the root layout. CSS breakpoints (`hidden md:flex` / `flex md:hidden`) control which layout is visible.

## Nav.tsx (Server Component)

Thin orchestrator. Renders `<DesktopNav />` and `<MobileNav />` side by side. No logic of its own.

## DesktopNav.tsx (Server Component)

Sticky, full-width bar with `bg-dark-green`. Hidden below `md`.

Three zones via flexbox:
- **Left:** logo `<img>` placeholder (`alt="sweetleaves"`) — swap for SVG asset when ready
- **Center:** Next.js `<Link>` elements for ABOUT, LEARN, REWARDS — `text-parchment uppercase tracking-wide`
- **Right:** `<SignInButton />` then SHOP NOW — ivory pill button (`bg-ivory text-dark-green rounded-full`) linking to `/shop`

## MobileNav.tsx (Client Component)

Visible below `md`. Owns `isOpen` boolean state.

**Closed state:** logo placeholder left, hamburger icon (≡) right.

**Open state:** full-screen `bg-dark-green` overlay containing:
- Logo + X close button at top
- SHOP NOW ivory pill button (links to `/shop`)
- ABOUT, LEARN, REWARDS stacked as Next.js `<Link>` elements
- `<SignInButton />` at bottom

Closing the overlay resets `isOpen` to false.

## SignInButton.tsx (Client Component)

Shared between DesktopNav and MobileNav. Owns `isModalOpen` boolean state. Renders:
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

Use Next.js `<Image>` with the real SVG assets — no placeholder needed.

- **Desktop and mobile nav** (dark green background): `Sweetleaves_Logo_Ivory_Horizontal_A.svg`
  - Path: `/logos-and-icons/logo-hotizontal/Sweetleaves_Logo_Ivory_Horizontal_A.svg`

The horizontal layout suits the nav bar. The Ivory colorway is legible on `bg-dark-green`.

All logo assets are in `public/logos-and-icons/` with variants for color (`Ivory`, `White`, `DarkGreen`, `DarkSage`, `Sage`, `Black`, `FullColor`), layout (`logo-hotizontal`, `logo-stacked`), and arrangement (`_A`, `_B`). Use the appropriate variant if the logo appears on other backgrounds elsewhere in the app.

## Styling

All colors use the custom Tailwind tokens defined in `tailwind.config.cjs`:
- Nav background: `bg-dark-green`
- Link text: `text-parchment`
- SHOP NOW button: `bg-ivory text-dark-green rounded-full`
- SIGN IN: `text-parchment` with a person icon

## Out of Scope

- Actual auth integration (sign-in is iframe only)
- Animated transitions on the mobile overlay
- Active link highlighting
