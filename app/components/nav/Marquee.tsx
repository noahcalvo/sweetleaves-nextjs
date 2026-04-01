import Image from "next/image";

const ITEMS = [
  "Legal cannabis available now",
  "Shop online for curbside pickup or visit us in-store",
  "Open Daily",
  "EARN Garden Club rewards",
];

function MarqueeContent() {
  return (
    <>
      {ITEMS.map((text) => (
        <span key={text} className="flex items-center gap-[15px] shrink-0">
          <span className="font-poppins-regular text-[20px] text-dark-green uppercase whitespace-nowrap">
            {text}
          </span>
          <Image
            src="/logos-and-icons/icon/Sweetleaves_Icon_DarkGreen.svg"
            alt=""
            width={12}
            height={18}
            className="shrink-0"
          />
        </span>
      ))}
    </>
  );
}

export default function Marquee() {
  return (
    <div className="w-full h-[50px] md:h-[75px] overflow-hidden flex items-center">
      <div className="flex gap-[15px] animate-marquee">
        <MarqueeContent />
        <MarqueeContent />
      </div>
    </div>
  );
}
