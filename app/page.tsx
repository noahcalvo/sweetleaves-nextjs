import Image from "next/image";
import { getWPData } from '../lib/wp';

const HOMEPAGE_QUERY = `
query Home {
  pageBy(uri: "/") {
    headlessPageFields {
      header
      subheader1
      body1
      subheader2
      body2
    }
  }
}
`;

export default async function Home() {
  let header = '';
  let subheader1 = '';
  let body1 = '';
  let subheader2 = '';
  let body2 = '';
  try {
    const data = await getWPData(HOMEPAGE_QUERY);
    console.log('Rendering homepage with header:', data);
    const fields = data?.pageBy?.headlessPageFields;
    header = fields?.header ?? '';
    subheader1 = fields?.subheader1 ?? '';
    body1 = fields?.body1 ?? '';
    subheader2 = fields?.subheader2 ?? '';
    body2 = fields?.body2 ?? '';
  } catch (e) {
    console.error('Failed fetching WP ACF fields', e);
  }


  return (
    <div className="font-sans">
      <main className="w-full max-w-4xl mx-auto flex flex-col items-start justify-start py-16 px-6 dark:bg-black sm:items-start">
        <div className="w-full space-y-24">
          <section className="pt-2 space-y-8">
            <h1 className="text-4xl font-semibold text-black dark:text-zinc-50">{header}</h1>
            {subheader1 ? (
              <h2 className="text-lg text-zinc-600 dark:text-zinc-400">{subheader1}</h2>
            ) : null}
            </section>

          {body1 ? (
            <section className="mt-6">
            <div className="flex text-zinc-600 dark:text-zinc-400 mt-2">
              <div className="prose-lg flex items-center text-right" >{body1}</div>
              <div><Image src="/SL-hero-2.jpg" alt="Sweetleaves store view" width={500} height={200} className="rounded-lg ml-6 mt-6 col-span-1" /></div>
            </div>
            </section>
          ) : null}

          {(subheader2 || body2) ? (
            <section className="pt-8">
              {subheader2 ? (
                <h2 className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">{subheader2}</h2>
              ) : null}

              {body2 ? (
                <div className="flex gap-6 mt-6">
                  <div className="md:w-1/2 w-full flex justify-center md:justify-start">
                    <Image src="/inside.jpg" alt="Sweetleaves store inside" width={520} height={300} className="rounded-lg shadow-md" />
                  </div>
                  <div className="flex prose-lg text-zinc-700 dark:text-zinc-300 items-center text-left">{body2}</div>
                </div>
              ) : null}
            </section>
          ) : null}
        </div>
      </main>
    </div>
  );
}
