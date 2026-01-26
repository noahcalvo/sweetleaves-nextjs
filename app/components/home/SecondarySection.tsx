import Image from "next/image";

type SecondarySectionProps = {
  subheader?: string;
  body?: string;
};

export default function SecondarySection({ subheader, body }: SecondarySectionProps) {
  if (!subheader && !body) return null;

  return (
    <section className="pt-8">
      {subheader ? <h2 className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">{subheader}</h2> : null}

      {body ? (
        <div className="flex gap-6 mt-6">
          <div className="md:w-1/2 w-full flex justify-center md:justify-start">
            <Image
              src="/inside.jpg"
              alt="Sweetleaves store inside"
              width={520}
              height={300}
              className="rounded-lg shadow-md"
            />
          </div>
          <div className="flex prose-lg text-zinc-700 dark:text-zinc-300 items-center text-left">{body}</div>
        </div>
      ) : null}
    </section>
  );
}
