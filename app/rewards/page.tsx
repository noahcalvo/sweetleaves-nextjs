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
        src="/rewards/circles-bg.svg"
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
