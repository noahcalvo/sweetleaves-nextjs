import Image from "next/image";
import type { CatalogEntry } from "@/lib/catalog";
import AccordionItem from "./AccordionItem";
import DutchieIframe from "./DutchieIframe";

interface Props {
  entry: CatalogEntry;
}

export default function CatalogPageTemplate({ entry }: Props) {
  return (
    <div className="max-w-[1365px] mx-auto px-4 md:px-6 py-5 md:py-8 flex flex-col gap-5 lg:gap-[30px]">
      {/* Hero */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-[30px] md:rounded-[40px] overflow-hidden">
        <Image
          src={entry.heroImage}
          alt={entry.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* H1 */}
      <h1 className="font-poppins-bold text-[35px] md:text-[55px] text-dark-green leading-tight">
        {entry.headline}
      </h1>

      {/* Accordion */}
      {entry.accordionItems.length > 0 && (
        <div className="flex flex-col gap-[13px]">
          {entry.accordionItems.map((item) => (
            <AccordionItem
              key={item.title}
              title={item.title}
              content={item.content}
            />
          ))}
        </div>
      )}

      {/* Dutchie menu */}
      {entry.iframeUrl && (
        <DutchieIframe src={entry.iframeUrl} />
      )}

      {/* H2 */}
      {entry.subheadline && (
        <h2 className="font-poppins-bold text-[25px] md:text-[35px] text-dark-green leading-tight">
          {entry.subheadline}
        </h2>
      )}

      {/* Body */}
      {entry.body && (
        <div
          className="font-poppins-regular text-[18px] text-dark-green leading-[1.6]"
          dangerouslySetInnerHTML={{ __html: entry.body }}
        />
      )}
    </div>
  );
}
