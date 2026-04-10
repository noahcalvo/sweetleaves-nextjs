import { getDealsBannerSlides } from "@/lib/deals";
import DealsCarousel from "./DealsCarousel";

export default async function DealsBanner() {
  const slides = await getDealsBannerSlides();

  if (slides.length === 0) return null;

  return <DealsCarousel slides={slides} />;
}
