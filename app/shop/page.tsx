import type { Metadata } from "next";
import { getWPData } from "../../lib/wp";
import DutchieEmbed from "./components/DutchieEmbed";
import ShopAnalytics from "./components/ShopAnalytics";

const SHOP_QUERY = `
query Shop {
  pageBy(uri: "/shop") {
    headlessPageFields {
      header
      body1
    }
    seo {
      title
      metaDesc
    }
  }
}
`;

type ShopData = {
  header: string;
  body: string;
  seoTitle?: string;
  seoDesc?: string;
};

const SHOP_REVALIDATE_SECONDS = Number(
  process.env.WP_SHOP_REVALIDATE_SECONDS ?? "300"
);

async function getShopData(): Promise<ShopData> {
  const data = await getWPData(SHOP_QUERY, {}, { revalidateSeconds: SHOP_REVALIDATE_SECONDS });
  const fields = data?.pageBy?.headlessPageFields;
  const seo = data?.pageBy?.seo;

  return {
    header: fields?.header ?? "",
    body: fields?.body1 ?? "",
    seoTitle: seo?.title ?? undefined,
    seoDesc: seo?.metaDesc ?? undefined,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getShopData();
    const title = data.seoTitle ?? data.header ?? "Shop";
    const description = data.seoDesc ?? undefined;

    return {
      title,
      description,
      alternates: { canonical: "/shop" },
      openGraph: {
        title,
        description: description ?? "",
      },
    };
  } catch {
    return {
      title: "Shop",
      description: "Browse our menu and products.",
      alternates: { canonical: "/shop" },
      openGraph: { title: "Shop", description: "Browse our menu and products." },
    };
  }
}

export default async function ShopPage() {
  let header = "";
  let body = "";
  try {
    const data = await getShopData();
    body = data.body;
    header = data.header;
  } catch (e) {
    console.error("Failed fetching shop page data", e);
  }

  return (
    <main className="min-h-screen p-8">
      <ShopAnalytics />
      <h1 className="text-3xl font-semibold">{header}</h1>
      <div className="prose-lg mt-4">{body}</div>
      <div>
        <DutchieEmbed />
      </div>
    </main>
  );
}
