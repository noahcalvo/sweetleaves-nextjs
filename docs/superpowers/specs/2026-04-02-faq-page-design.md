# FAQ Page — Design Spec

## Overview

A dedicated FAQ page at `/faq` that displays frequently asked questions grouped into sections. FAQs are managed in WordPress as a custom post type (`faq`) with a `faq_section` taxonomy, fetched via WPGraphQL. Individual FAQs can be marked as "Common Questions" for reuse on other pages.

## Data Model (WordPress — already implemented)

- **CPT:** `faq` — title is the question, content (block editor) is the answer
- **Taxonomy:** `faq_section` — groups FAQs (e.g., "Getting Started", "Shopping With Us")
- **Meta:** `is_common_question` (boolean) — flags FAQs for display on other pages
- **Ordering:** `menu_order` on FAQs (within section), `sort_order` term meta on sections

## Data Layer (Next.js — already implemented)

`lib/faq.ts` exports:
- `getFaqSections(): Promise<FaqSection[]>` — all FAQs grouped and sorted by section
- `getCommonFaqs(): Promise<FaqItem[]>` — only FAQs marked as common questions

Types:
```ts
interface FaqItem {
  id: string;
  question: string;
  answer: string;       // HTML from WP editor
  menuOrder: number;
  isCommonQuestion: boolean;
}

interface FaqSection {
  name: string;
  slug: string;
  sortOrder: number;
  faqs: FaqItem[];
}
```

## Page Structure

### Route: `app/faq/page.tsx` (server component)

Fetches data via `getFaqSections()`, renders heading, FAQ card, and bottom cards.

### Component Tree

```
app/faq/
  page.tsx                      # Server — data fetch, layout
  components/
    FaqAccordion.tsx             # Client — renders sections + FaqItems
    FaqItem.tsx                  # Client — single Q&A with toggle
    CareersCard.tsx              # Server — hardcoded promo
    StillHaveQuestionsCard.tsx   # Server — hardcoded contact CTA
```

## Layout — Desktop (md+)

- Page max-width: `1366px`, centered, `px-[37px]`
- Heading: "Frequently Asked Questions" — Poppins Bold `text-[55px]`, `text-dark-green`, centered, `leading-[0.9]`
- White FAQ card: `bg-white rounded-[50px] px-[53px] py-[64px]`
- Inside card: 2-column CSS grid, `gap-x-[65px] gap-y-[60px]`
  - Each cell: section heading + FAQ items
  - Sections fill left-to-right, top-to-bottom (row 1: sections 0-1, row 2: sections 2-3, etc.)
- Below card: CareersCard and StillHaveQuestionsCard stacked with `gap-[30px]`

## Layout — Mobile (< md)

- `px-[20px]`
- Heading: `text-[35px]`, `leading-[1.1]`
- White FAQ card: `bg-white rounded-[30px] p-[20px]`
- Inside card: single column, sections stacked with `gap-[60px]`
- Below card: same cards, stacked vertically

## Section Heading

- Poppins Bold
- Desktop: `text-[45px]`
- Mobile: `text-[30px]`
- Color: `text-dark-green`

## FaqItem

- Row layout: orange toggle circle + question text, `gap-[25px]`, `items-center` (or `items-start` for long questions that wrap)
- Toggle: `bg-orange-glow size-[44px] rounded-full` — displays `+` when closed, `−` when open. Poppins SemiBold `text-[35px]` white, centered.
- Question: Poppins Bold `text-[20px] text-dark-green`
- Answer: revealed below when open, rendered as HTML from WP content field. Poppins Regular `text-[18px]`, reasonable line-height.
- Items within a section spaced with `gap-[13px]`
- Multiple items can be open simultaneously (independent `useState` per item)

## CareersCard

- `bg-sage rounded-[40px]`
- Desktop: horizontal — image (left, `rounded-[20px]`, ~625px wide) + copy (right)
  - Copy: "Is Sweetleaves currently hiring?" Poppins Bold `text-[45px]` white `leading-[0.9]`
  - Body: Poppins Regular `text-[18px]` white
  - CTA: yellow button ("SEE OPEN POSITIONS") linking to `/careers` or external careers URL
- Mobile: vertical — copy on top, image below
  - Heading: `text-[30px]`
  - Card padding: `px-[38px] py-[27px]`, image `rounded-[20px]`
- Image: team/store photo, saved to `public/faq/`

## StillHaveQuestionsCard

- `bg-parchment border border-sage rounded-[40px]`
- Desktop: horizontal — copy (left) + image (right, `rounded-[20px]`, ~625px wide)
  - Copy: "Still Have Questions?" Poppins Bold `text-[45px]` `text-dark-green` `leading-[0.9]`
  - Body: Poppins Regular `text-[18px]` `text-dark-green` — includes phone number and "send us a message" underlined link
  - CTA: yellow button ("CONTACT US") linking to contact page
- Mobile: vertical — copy on top, image below
  - Heading: `text-[30px]`
- Image: store interior photo, saved to `public/faq/`

## Metadata

```ts
export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Sweetleaves Cannabis in Minneapolis — shopping, products, laws, and more.",
  alternates: { canonical: "/faq" },
};
```

## Assets Needed

- Careers card image (from Figma) → `public/faq/careers.jpg`
- Still Have Questions card image (from Figma) → `public/faq/questions.jpg`

## Out of Scope

- Animated open/close transitions (can add later)
- Search/filter within FAQs
- The "Common Questions" component for other pages (separate task)
