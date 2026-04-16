type SimpleLink = { href: string; label: string; items?: never };
type DropdownLink = { label: string; items: { href: string; label: string }[]; href?: never };
export type NavItem = SimpleLink | DropdownLink;

export const NAV_LINKS: NavItem[] = [
  {
    label: "Products",
    items: [
      { href: "/products/flower", label: "Flower" },
      { href: "/products/vaporizers", label: "Vapes" },
      { href: "/products/pre-rolls", label: "Pre-Rolls" },
      { href: "/products/edibles", label: "Edibles" },
      { href: "/products/cannabis-beverages", label: "Beverages" },
      { href: "/products/cbd", label: "CBD" },
    ],
  },
  {
    label: "Brands",
    items: [
      { href: "/brands/sweetleaves", label: "Sweetleaves" },
      { href: "/brands/rythm", label: "RYTHM" },
      { href: "/brands/good-green", label: "Good Green" },
      { href: "/brands/dogwalkers", label: "Dogwalkers" },
      { href: "/brands/lakeside-cannabis-co", label: "Lakeside Cannabis Co." },
      { href: "/brands/nebula", label: "Nebula" },
      { href: "/brands/grasslandz", label: "Grasslandz" },
      { href: "/brands/wyld", label: "WYLD" },
    ],
  },
  { href: "/loyalty", label: "Rewards" },
  { href: "/learn", label: "Learn" },
  { href: "/about-us", label: "About" },
];
