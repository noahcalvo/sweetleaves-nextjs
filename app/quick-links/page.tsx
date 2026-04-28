import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false },
  alternates: { canonical: "/quick-links/" },
};

export default function QuickLinksPage() {
  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 max-w-[1365px] mx-auto px-4 md:px-6 py-5 md:py-8 flex flex-col gap-5 lg:gap-[30px]">
        <section className="flex flex-col items-center justify-center px-10 py-8 md:py-10">
          <h1 className="font-poppins-bold text-[35px] md:text-[55px] text-dark-green text-center leading-[0.9]">
            Quick Links
          </h1>
        </section>
      </div>
    </div>
  );
}
