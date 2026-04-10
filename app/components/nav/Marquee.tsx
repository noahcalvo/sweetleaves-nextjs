import Image from "next/image";
import { getMarqueeItems } from "@/lib/marquee";

interface MarqueeContentProps {
  items: string[];
}

function MarqueeContent({ items }: MarqueeContentProps) {
  return (
    <>
      {items.map((text) => (
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

export default async function Marquee() {
  const items = await getMarqueeItems();

  if (items.length === 0) return null;

  return (
    <div className="w-full h-[50px] md:h-[75px] overflow-hidden flex items-center">
      <div className="flex gap-[15px] animate-marquee">
        <MarqueeContent items={items} />
        <MarqueeContent items={items} />
      </div>
    </div>
  );
}
