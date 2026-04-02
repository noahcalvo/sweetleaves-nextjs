import Image from "next/image";

interface ValueProps {
  name: string;
  description: string;
}

const VALUES: ValueProps[] = [
  {
    name: "Clarity",
    description:
      "Cannabis without the confusion. We make it simple through clear guidance, clean design, and straight answers.",
  },
  {
    name: "Connection",
    description:
      "Real conversations, not sales pitches. We treat every person who walks in like a neighbor.",
  },
  {
    name: "Balance",
    description:
      "Cannabis fits into your life, your schedule, your pace. We\u2019re here to help you find what works.",
  },
  {
    name: "Quality",
    description:
      "Every product is legal, tested, and vetted. We stand behind what we sell.",
  },
  {
    name: "Playfulness",
    description:
      "Cannabis doesn\u2019t have to be so serious. We keep things light.",
  },
  {
    name: "Intention",
    description:
      "Every detail matters, from our space to how we talk to you.",
  },
  {
    name: "Compassion",
    description:
      "You\u2019re not lazy. You\u2019re living. We meet you where you are, no judgment.",
  },
];

function ValuePill({ name, description }: ValueProps) {
  return (
    <div className="bg-white rounded-[120px] flex items-center w-full h-auto lg:h-[106px] overflow-hidden">
      <div className="bg-sage rounded-[120px] flex items-center gap-4 lg:gap-0 px-6 lg:px-0 py-3 lg:py-0 shrink-0 w-full lg:w-[368px] h-full lg:h-[90px] lg:ml-3">
        <Image
          src="/logos-and-icons/icon/Sweetleaves_Icon_Ivory.svg"
          alt=""
          width={44}
          height={66}
          className="w-10 h-[60px] shrink-0 lg:ml-3"
        />
        <span className="font-poppins-bold text-3xl lg:text-[35px] text-white leading-[0.9] lg:ml-[58px]">
          {name}
        </span>
      </div>
      <p className="hidden lg:flex font-poppins-regular text-lg text-dark items-center px-8 flex-1">
        {description}
      </p>
    </div>
  );
}

function ValueCard({ name, description }: ValueProps) {
  return (
    <div className="bg-white rounded-[30px] flex flex-col gap-6 items-center px-4 pt-3.5 pb-8 w-full">
      <div className="bg-sage rounded-[120px] flex items-center gap-4 px-7 py-3 w-full">
        <Image
          src="/logos-and-icons/icon/Sweetleaves_Icon_Ivory.svg"
          alt=""
          width={40}
          height={60}
        />
        <span className="font-poppins-bold text-3xl text-white leading-[0.9]">
          {name}
        </span>
      </div>
      <p className="font-poppins-regular text-lg text-dark text-center leading-[1.1] max-w-[295px]">
        {description}
      </p>
    </div>
  );
}

export default function WhatWeStandFor() {
  return (
    <section className="bg-dark-green rounded-[40px] flex flex-col gap-5 items-center px-6 lg:px-10 py-10 lg:py-11">
      <h2 className="font-poppins-bold text-3xl lg:text-display text-white text-center">
        What We Stand For
      </h2>
      {/* Desktop */}
      <div className="hidden lg:flex flex-col gap-3 w-full max-w-[1278px]">
        {VALUES.map((v) => (
          <ValuePill key={v.name} {...v} />
        ))}
      </div>
      {/* Mobile */}
      <div className="flex lg:hidden flex-col gap-2.5 w-full">
        {VALUES.map((v) => (
          <ValueCard key={v.name} {...v} />
        ))}
      </div>
    </section>
  );
}
