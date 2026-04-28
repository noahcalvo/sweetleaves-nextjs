import type { Metadata } from "next";
import DutchieEmbed from "./components/DutchieEmbed";

export const metadata: Metadata = {
  title: "Shop Now",
  alternates: { canonical: "/shop-now/" },
};

export default function ShopPage() {
  return (
    <div className="min-h-screen p-8">
      <DutchieEmbed />
    </div>
  );
}
