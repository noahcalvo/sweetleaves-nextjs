import type { FaqSection } from "@/lib/faq";
import FaqItem from "./FaqItem";

interface Props {
  sections: FaqSection[];
}

export default function FaqAccordion({ sections }: Props) {
  return (
    <div className="bg-white rounded-[45px] py-[45px] px-[20px] md:rounded-[50px] md:px-[53px] md:py-[64px] w-full ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-[30px] md:gap-x-[65px]">
        {sections.map((section) => (
          <div key={section.slug} className="flex flex-col gap-[13px] min-w-0">
            <h2 className="font-poppins-bold text-[30px] md:text-[45px] text-dark-green leading-none mb-2">
              {section.name}
            </h2>
            {section.faqs.map((faq) => (
              <FaqItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
