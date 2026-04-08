import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Rewards",
  description:
    "View your Sweetleaves Garden Club rewards, points balance, and exclusive perks.",
};

export default function MyRewardsPage() {
  return (
      <div className="bg-dark-green max-w-[768px] mx-auto md:rounded-[50px] mb-4 overflow-hidden">
        <iframe
          src="https://lab.alpineiq.com/wallet/3585"
          className="w-full rounded-lg"
          style={{ height: "900px", maxWidth: "768px" }}
          title="My Rewards"
        />
      </div>
  );
}
