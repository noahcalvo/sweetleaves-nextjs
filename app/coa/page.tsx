import type { Metadata } from "next";
import Image from "next/image";
import ViewReportButton from "./components/ViewReportButton";

export const metadata: Metadata = {
  title: "Certificates of Analysis",
  description:
    "Every Sweetleaves batch is independently tested by an ISO-accredited third-party lab for potency, residual solvents, pesticides, heavy metals, and microbials.",
  alternates: { canonical: "/coa" },
};

interface Product {
  slug: string;
  name: string;
  flavor: string;
  halo: string;
}

interface Batch {
  batch: string;
  mfg: string;
  thc: string;
  cbd: string;
  cbn?: string;
  status: string;
}

interface CoaData {
  sku: string;
  lab: string;
  batches: Batch[];
}

const PRODUCTS: Product[] = [
  { slug: "pink-lemonade", name: "CHILL", flavor: "Pink Lemonade", halo: "#f9d7e0" },
  { slug: "blackberry-sleep", name: "SLEEP", flavor: "Blackberry", halo: "#cedff7" },
  { slug: "passion-fruit", name: "EVERYDAY", flavor: "Passion Fruit", halo: "#d9c7ea" },
  { slug: "pineapple", name: "EVERYDAY", flavor: "Pineapple", halo: "#f2e7b8" },
  { slug: "tropical-mix", name: "EVERYDAY", flavor: "Tropical Mix", halo: "#e8d8f0" },
  { slug: "peach", name: "EVERYDAY", flavor: "Peach", halo: "#fad4bf" },
];

const COA_BATCHES: Record<string, CoaData> = {
  "pink-lemonade": {
    sku: "SL-CHL-PL-35G",
    lab: "Northland Laboratories",
    batches: [
      { batch: "B-26041-PLE", mfg: "04/02/2026", thc: "5.0 mg", cbd: "10.0 mg", status: "Pass" },
      { batch: "B-26012-PLE", mfg: "01/18/2026", thc: "5.1 mg", cbd: "10.2 mg", status: "Pass" },
      { batch: "B-25311-PLE", mfg: "11/08/2025", thc: "4.9 mg", cbd: "9.8 mg", status: "Pass" },
      { batch: "B-25247-PLE", mfg: "09/12/2025", thc: "5.0 mg", cbd: "10.1 mg", status: "Pass" },
    ],
  },
  "blackberry-sleep": {
    sku: "SL-SLP-BB-50T",
    lab: "Northland Laboratories",
    batches: [
      { batch: "B-26039-SBB", mfg: "03/28/2026", thc: "5.0 mg", cbd: "10.0 mg", cbn: "5.0 mg", status: "Pass" },
      { batch: "B-26007-SBB", mfg: "01/10/2026", thc: "5.2 mg", cbd: "10.1 mg", cbn: "5.1 mg", status: "Pass" },
      { batch: "B-25298-SBB", mfg: "10/22/2025", thc: "4.9 mg", cbd: "9.9 mg", cbn: "5.0 mg", status: "Pass" },
    ],
  },
  "passion-fruit": {
    sku: "SL-EVR-PF-50T",
    lab: "Keystone Analytics",
    batches: [
      { batch: "B-26044-EPF", mfg: "04/05/2026", thc: "5.0 mg", cbd: "—", status: "Pass" },
      { batch: "B-26015-EPF", mfg: "01/21/2026", thc: "4.9 mg", cbd: "—", status: "Pass" },
      { batch: "B-25314-EPF", mfg: "11/10/2025", thc: "5.1 mg", cbd: "—", status: "Pass" },
    ],
  },
  pineapple: {
    sku: "SL-EVR-PA-50T",
    lab: "Keystone Analytics",
    batches: [
      { batch: "B-26040-EPA", mfg: "04/03/2026", thc: "5.0 mg", cbd: "—", status: "Pass" },
      { batch: "B-26010-EPA", mfg: "01/14/2026", thc: "5.0 mg", cbd: "—", status: "Pass" },
      { batch: "B-25305-EPA", mfg: "11/02/2025", thc: "4.8 mg", cbd: "—", status: "Pass" },
    ],
  },
  "tropical-mix": {
    sku: "SL-EVR-TM-50T",
    lab: "Northland Laboratories",
    batches: [
      { batch: "B-26043-ETM", mfg: "04/04/2026", thc: "5.0 mg", cbd: "—", status: "Pass" },
      { batch: "B-26014-ETM", mfg: "01/20/2026", thc: "5.1 mg", cbd: "—", status: "Pass" },
      { batch: "B-25308-ETM", mfg: "11/05/2025", thc: "5.0 mg", cbd: "—", status: "Pass" },
      { batch: "B-25251-ETM", mfg: "09/16/2025", thc: "4.9 mg", cbd: "—", status: "Pass" },
    ],
  },
  peach: {
    sku: "SL-EVR-PC-50T",
    lab: "Keystone Analytics",
    batches: [
      { batch: "B-26045-EPC", mfg: "04/08/2026", thc: "5.0 mg", cbd: "—", status: "Pass" },
      { batch: "B-26018-EPC", mfg: "01/25/2026", thc: "5.0 mg", cbd: "—", status: "Pass" },
      { batch: "B-25319-EPC", mfg: "11/14/2025", thc: "4.9 mg", cbd: "—", status: "Pass" },
    ],
  },
};

function productDisplayName(name: string, flavor: string): string {
  if (name === "EVERYDAY") return flavor;
  return name.charAt(0) + name.slice(1).toLowerCase() + " · " + flavor;
}

export default function CoaPage() {
  return (
    <div className="font-poppins">
      {/* Hero */}
      <section className="text-center pt-[70px] pb-[40px] px-5 max-w-[880px] mx-auto">
        <div className="text-[13px] tracking-[0.14em] uppercase text-dark-sage font-semibold">
          Lab Results
        </div>
        <h1 className="font-poppins-bold text-[44px] sm:text-[55px] lg:text-[66px] text-dark-green leading-[0.95] mt-[10px] mb-5">
          Certificates of Analysis
        </h1>
        <p className="text-[16px] leading-[1.55] text-dark-sage max-w-[680px] mx-auto mb-[30px]">
          Every Sweetleaves batch is independently tested by an ISO-accredited
          third-party lab for potency, residual solvents, pesticides, heavy
          metals, and microbials. Find your batch below by product SKU.
        </p>
      </section>

      {/* Product list */}
      <section className="max-w-[1100px] mx-auto px-5 pt-5 pb-10 flex flex-col gap-[18px]">
        {PRODUCTS.map((product) => {
          const data = COA_BATCHES[product.slug];
          if (!data) return null;
          return (
            <div
              key={product.slug}
              className="bg-white rounded-3xl overflow-hidden border border-dark-green/[0.08]"
            >
              {/* Product header */}
              <div className="grid grid-cols-[72px_1fr] gap-[18px] items-center px-6 py-5 border-b border-dark-green/10 max-sm:grid-cols-[56px_1fr]">
                <div
                  className="w-[72px] h-[72px] rounded-2xl grid place-items-center overflow-hidden shrink-0 max-sm:w-[56px] max-sm:h-[56px]"
                  style={{ background: product.halo }}
                >
                  <Image
                    src="/home/products/gummies.png"
                    alt={`${product.name} ${product.flavor}`}
                    width={72}
                    height={72}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-2xl font-bold text-dark-green leading-[1.1]">
                  {productDisplayName(product.name, product.flavor)}
                </div>
              </div>

              {/* Batch rows */}
              <div className="flex flex-col">
                {data.batches.map((b, i) => (
                  <div
                    key={b.batch}
                    className={`flex justify-between items-center px-6 py-[18px] max-sm:px-[18px] max-sm:py-[14px]${
                      i < data.batches.length - 1
                        ? " border-b border-dark-green/[0.08]"
                        : ""
                    }`}
                  >
                    <div className="text-[14px] text-dark-sage max-sm:text-[13px]">
                      Batch{" "}
                      <span className="font-mono text-[15px] text-dark-green font-semibold ml-1.5">
                        {b.batch}
                      </span>
                    </div>
                    <ViewReportButton batch={b.batch} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Footer note */}
      <section className="max-w-[880px] mx-auto mt-[30px] mb-[80px] px-5">
        <div className="bg-dark-green text-white rounded-[28px] px-10 py-9">
          <h3 className="font-poppins-bold text-[22px] text-light-gold mb-2.5">
            Why we test every batch
          </h3>
          <p className="text-[14px] leading-[1.55] opacity-[0.88]">
            Because you deserve to know what you&apos;re putting in your body.
            Our COAs confirm cannabinoid content within ±10% of label and screen
            for 60+ contaminants. Can&apos;t find the batch on your bag? Email{" "}
            <a
              href="mailto:info@sweetleavesnorthloop.com"
              className="text-light-gold underline"
            >
              info@sweetleavesnorthloop.com
            </a>{" "}
            with the lot number and we&apos;ll send the report directly.
          </p>
        </div>
      </section>
    </div>
  );
}
