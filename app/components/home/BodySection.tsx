import Image from "next/image";

type BodySectionProps = {
  body: string;
};

export default function BodySection({ body }: BodySectionProps) {
  if (!body) return null;

  return (
    <section className="mt-6">
      <div className="flex text-zinc-600 dark:text-zinc-400 mt-2">
        <div className="prose-lg flex items-center text-right">{body}</div>
        <div>
          <Image
            src="/SL-hero-2.jpg"
            alt="Sweetleaves store view"
            width={500}
            height={200}
            className="rounded-lg ml-6 mt-6 col-span-1"
            priority
          />
        </div>
      </div>
    </section>
  );
}
