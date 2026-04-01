import type { Metadata } from "next";
import {
  HomeHero,
  ProductGrid,
  DealsBanner,
  StorePhoto,
  ReviewsSection,
  BlogSection,
  GardenClubPromo,
} from "./components/home";
import FaqSection from "./components/FaqSection";

export const metadata: Metadata = {
  title: "Sweetleaves | Cannabis Dispensary in Minneapolis",
  description:
    "Recreational cannabis dispensary in Minneapolis, Minnesota. Shop flower, edibles, vaporizers, concentrates, and more. Visit us in the North Loop.",
};

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 max-w-[1365px] mx-auto px-4 md:px-6 py-5 md:py-8 flex flex-col gap-5 lg:gap-[30px]">
        <HomeHero />
        <ProductGrid />
        <DealsBanner />
        <StorePhoto
          src="/home/store-exterior.png"
          alt="Sweetleaves dispensary exterior"
        />

        <div className="flex flex-col lg:flex-row gap-5 lg:gap-[30px]">
          <ReviewsSection />
          <BlogSection />
        </div>

        <GardenClubPromo />
        <StorePhoto
          src="/home/store-interior.png"
          alt="Sweetleaves dispensary interior"
        />
        <FaqSection />
      </div>
    </div>
  );
}
