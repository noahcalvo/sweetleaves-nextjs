import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the Sweetleaves team in Minneapolis. Check back for open positions at our North Loop cannabis dispensary.",
  alternates: { canonical: "/careers/" },
};

export default function CareersPage() {
  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 max-w-[1365px] mx-auto px-4 md:px-6 py-5 md:py-8 flex flex-col gap-5 lg:gap-[30px]">
        <section className="flex flex-col items-center justify-center px-10 py-8 md:py-10 gap-6">
          <h1 className="font-poppins-bold text-[35px] md:text-[55px] text-dark-green text-center leading-[0.9]">
            Join Our Team
          </h1>
          <p className="font-poppins-regular text-[18px] text-almost-black text-center max-w-[600px]">
            We&apos;re not currently hiring, but we&apos;re always growing. Check back soon for open positions at Sweetleaves North Loop.
          </p>
        </section>
      </div>
    </div>
  );
}
