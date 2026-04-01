# Sweetleaves — Agent Guidelines

## Core Principles

**YAGNI.** Only build what is needed right now. No speculative features, no "might be useful later" abstractions.

**Minimal JS.** Prefer server components. Reach for `"use client"` only when interactivity is required. Keep client-side state to simple `useState` — avoid reducers, context, or external state libraries unless the problem cannot be solved any other way. If you think complexity is warranted, frame the tradeoff and ask.

**Clean CSS.** Use only Tailwind classes that are actually applied. Remove unused classes immediately. Do not add classes "just in case." Avoid inline styles.

**Self-documenting code.** Prefer small, focused functions and components with clear names over comments. A component named `ShopNowButton` needs no explanation. A 200-line component named `Nav` does.

**No tech debt accumulation.** When you touch a file, leave it cleaner than you found it. Remove dead code, unused imports, and stale comments. Do not introduce backwards-compatibility shims.

---

## File Structure

```
app/
  components/
    nav/                  # All navbar-related components
      Nav.tsx             # Thin orchestrator (server)
      DesktopNav.tsx      # Desktop layout (server)
      MobileNav.tsx       # Mobile layout + hamburger (client)
      Marquee.tsx          # Scrolling announcement banner (server)
      SignInButton.tsx    # Sign-in button + iframe modal (client)
    home/                 # Components used only on the home page
      HomeHero.tsx
      ProductGrid.tsx
      DealsBanner.tsx
      StorePhoto.tsx
      ReviewsSection.tsx
      BlogSection.tsx
      GardenClubPromo.tsx
      HomeFaqSection.tsx
      index.ts
    AgeGate.tsx           # App-wide age gate (client)
    AlpineIQProvider.tsx  # Analytics provider (client)
    PageViewTracker.tsx   # Analytics tracker (client)
  about/
    page.tsx
  learn/
    page.tsx
  rewards/
    page.tsx
  shop/
    page.tsx
    components/           # Components used only on the shop page
      DutchieEmbed.tsx
      WaxCarousel.tsx
      ShopAnalytics.tsx
  layout.tsx
  page.tsx
  globals.css

lib/
  analytics/
    alpineiq.ts

public/
  logos-and-icons/
    icon/
    logo-hotizontal/
    logo-stacked/

docs/
  superpowers/
    specs/                # Design specs (brainstorming output)
    plans/                # Implementation plans
```

**Rules:**
- Page-specific components live in `app/(page)/components/`, not in `app/components/`
- `app/components/` is for components used in more than one place
- Group related components into a subfolder (e.g., `nav/`) when there are 3+ files
- One component per file. File name matches the export name.
- Barrel `index.ts` files are allowed only when a folder has 3+ exports that are consistently imported together

---

## Component Guidelines

- Server component by default. Add `"use client"` only when the component uses hooks or browser APIs.
- Push `"use client"` as far down the tree as possible — isolate it to the smallest interactive unit.
- Props should be typed with a `Props` interface defined at the top of the file.
- No default prop values via destructuring defaults for complex objects — keep it explicit.
- Extract repeated JSX into a named sub-component within the same file if it appears 2+ times and has a clear identity.

---

## Tailwind Guidelines

- Use the custom color tokens defined in `tailwind.config.cjs`: `dark-green`, `dark-sage`, `sage`, `ivory`, `parchment`, `almost-black`.
- Do not use raw hex values or arbitrary Tailwind values (e.g., `bg-[#0F2D25]`) — use the named tokens.
- Keep class lists short. If a class list exceeds ~8 classes, consider extracting to a component.
- Do not use `dark:` variants unless dark mode support is confirmed for that component.

---

## Tradeoff Protocol

Before introducing any of the following, stop and frame the tradeoff for the user:

- A new npm dependency
- A new abstraction (shared hook, utility, HOC, context)
- A new file that only one other file uses
- Any form of state management beyond `useState`
- Test infrastructure (Jest, Playwright, etc.)

Format: "I could add X, which would give us Y, but it means Z. Worth it?"

---

## Assets

Logo SVGs live in `public/logos-and-icons/`. Choose the colorway that suits the background:
- On `bg-dark-green` or `bg-dark-sage`: use `Ivory` or `White` variant
- On `bg-parchment` or `bg-ivory`: use `DarkGreen` or `DarkSage` variant
- On white/light backgrounds: use `DarkGreen` or `Black` variant

Always use Next.js `<Image>` for logo assets. Never `<img>`.
