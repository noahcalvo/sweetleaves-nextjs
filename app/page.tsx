import type { Metadata } from "next";
import {
  buildHomeMetadata,
  EMPTY_HOME_DATA,
  FALLBACK_HOME_METADATA,
  getHomePage,
  type HomeData,
} from "../lib/homepage";
import { BodySection, HeroSection, ProductsSection, SecondarySection } from "./components/home";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getHomePage();

    return buildHomeMetadata(page);
  } catch {
    // WP down? Still render a sane title.
    return FALLBACK_HOME_METADATA;
  }
}

export default async function Home() {
  // If WP errors, we still render the page with empty content instead of crashing.
  let page: HomeData = EMPTY_HOME_DATA;

  try {
    page = await getHomePage();
  } catch (e) {
    // keep it quiet in UI; logging server-side is OK but don’t dump the whole response
    console.error("Failed fetching homepage data from WP", e);
  }

  const { header, subheader1, body1, subheader2, body2, showCarousel } = page;

  return (
    <div className="font-sans">
      <main className="w-full max-w-4xl mx-auto flex flex-col items-start justify-start py-16 px-6 dark:bg-black sm:items-start">
        <div className="w-full space-y-24">
          <HeroSection header={header} subheader={subheader1} />

          <BodySection body={body1} />

          <SecondarySection subheader={subheader2} body={body2} />

          {showCarousel ? <ProductsSection /> : null}
        </div>
      </main>
    </div>
  );
}
