# Marquee WordPress Configuration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded marquee statements with a list fetched from a WordPress `marquee_item` custom post type, ordered by menu order.

**Architecture:** A new `lib/marquee.ts` module fetches statement titles from WP GraphQL. `Marquee.tsx` becomes an async server component that calls `getMarqueeItems()` and passes the result into the existing `MarqueeContent` renderer. If WP returns nothing, the marquee renders empty.

**Tech Stack:** Next.js App Router (server components), WP GraphQL, TypeScript

---

### Task 1: Register the `marquee_item` CPT in WordPress

This is a WordPress-side prerequisite. Do this before any frontend work.

**Files:** WordPress `functions.php` or a site-specific plugin file

- [ ] **Step 1: Register the CPT**

Add the following to your theme's `functions.php` or a custom plugin:

```php
add_action( 'init', function () {
    register_post_type( 'marquee_item', [
        'labels'              => [
            'name'          => 'Marquee Items',
            'singular_name' => 'Marquee Item',
            'add_new_item'  => 'Add New Marquee Item',
            'edit_item'     => 'Edit Marquee Item',
        ],
        'public'              => false,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'supports'            => [ 'title', 'page-attributes' ],
        'menu_icon'           => 'dashicons-megaphone',
        'show_in_graphql'     => true,
        'graphql_single_name' => 'marqueeItem',
        'graphql_plural_name' => 'marqueeItems',
    ] );
} );
```

`supports: ['title', 'page-attributes']` enables the title field and the "Order" field (menu order) in the WP admin edit screen.

- [ ] **Step 2: Add sample marquee items in WP Admin**

Go to WP Admin → Marquee Items → Add New. Create at least 3 items, e.g.:
- "Legal cannabis available now" (Order: 1)
- "Shop online for curbside pickup or visit us in-store" (Order: 2)
- "Open Daily" (Order: 3)
- "EARN Garden Club rewards" (Order: 4)

Set the "Order" field on each item's edit screen to control sequence.

- [ ] **Step 3: Verify GraphQL exposes the data**

In the WP GraphQL IDE (WP Admin → GraphQL → GraphiQL IDE), run:

```graphql
query {
  marqueeItems(first: 10, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
    nodes {
      title
    }
  }
}
```

Expected: a `data.marqueeItems.nodes` array with your items in order.

---

### Task 2: Create `lib/marquee.ts`

**Files:**
- Create: `lib/marquee.ts`

- [ ] **Step 1: Create the file**

```typescript
import { getWPData } from "./wp";

const GET_MARQUEE_ITEMS_QUERY = `
  query GetMarqueeItems {
    marqueeItems(first: 50, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        title
      }
    }
  }
`;

export async function getMarqueeItems(): Promise<string[]> {
  const data = await getWPData(GET_MARQUEE_ITEMS_QUERY);
  const nodes: { title: string }[] = data?.marqueeItems?.nodes ?? [];
  return nodes.map((node) => node.title ?? "").filter(Boolean);
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/marquee.ts
git commit -m "feat: add getMarqueeItems WP GraphQL fetch"
```

---

### Task 3: Update `Marquee.tsx` to use WP data

**Files:**
- Modify: `app/components/nav/Marquee.tsx`

- [ ] **Step 1: Replace the file contents**

```typescript
import Image from "next/image";
import { getMarqueeItems } from "@/lib/marquee";

interface MarqueeContentProps {
  items: string[];
}

function MarqueeContent({ items }: MarqueeContentProps) {
  return (
    <>
      {items.map((text) => (
        <span key={text} className="flex items-center gap-[15px] shrink-0">
          <span className="font-poppins-regular text-[20px] text-dark-green uppercase whitespace-nowrap">
            {text}
          </span>
          <Image
            src="/logos-and-icons/icon/Sweetleaves_Icon_DarkGreen.svg"
            alt=""
            width={12}
            height={18}
            className="shrink-0"
          />
        </span>
      ))}
    </>
  );
}

export default async function Marquee() {
  const items = await getMarqueeItems();

  if (items.length === 0) return null;

  return (
    <div className="w-full h-[50px] md:h-[75px] overflow-hidden flex items-center">
      <div className="flex gap-[15px] animate-marquee">
        <MarqueeContent items={items} />
        <MarqueeContent items={items} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the build compiles**

```bash
npm run build
```

Expected: no TypeScript or build errors.

- [ ] **Step 3: Start dev server and verify visually**

```bash
npm run dev
```

Open `http://localhost:3000`. The marquee should scroll with the items you created in WordPress (not the old hardcoded strings), separated by leaf icons, rendered uppercase.

- [ ] **Step 4: Commit**

```bash
git add app/components/nav/Marquee.tsx
git commit -m "feat: marquee items sourced from WordPress"
```
