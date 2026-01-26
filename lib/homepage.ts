import type { Metadata } from "next";
import { getWPData } from "./wp";

export const HOMEPAGE_QUERY = `
query Home {
  pageBy(uri: "/") {
    headlessPageFields {
      header
      subheader1
      body1
      subheader2
      body2
      showcarousel
    }
    seo {
      title
      metaDesc
    }
  }
}
`;

export type HomeData = {
  header: string;
  subheader1: string;
  body1: string;
  subheader2: string;
  body2: string;
  showCarousel: boolean;
  seoTitle?: string;
  seoDesc?: string;
};

export const EMPTY_HOME_DATA: HomeData = {
  header: "",
  subheader1: "",
  body1: "",
  subheader2: "",
  body2: "",
  showCarousel: false,
};

const HOME_REVALIDATE_SECONDS = Number(
  process.env.WP_HOME_REVALIDATE_SECONDS ?? "300"
);

export async function getHomePage(): Promise<HomeData> {
  const data = await getWPData(HOMEPAGE_QUERY, {}, { revalidateSeconds: HOME_REVALIDATE_SECONDS });
  const fields = data?.pageBy?.headlessPageFields ?? {};
  const seo = data?.pageBy?.seo ?? {};

  return {
    header: fields?.header ?? "",
    subheader1: fields?.subheader1 ?? "",
    body1: fields?.body1 ?? "",
    subheader2: fields?.subheader2 ?? "",
    body2: fields?.body2 ?? "",
    showCarousel: Boolean(fields?.showcarousel),
    seoTitle: seo?.title ?? undefined,
    seoDesc: seo?.metaDesc ?? undefined,
  };
}

export function buildHomeMetadata(page: HomeData): Metadata {
  const title = page.seoTitle ?? page.header ?? "Sweetleaves North Loop";
  const description = page.seoDesc ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title: page.seoTitle ?? page.header ?? "Sweetleaves North Loop",
      description: page.seoDesc ?? "",
    },
  };
}

const FALLBACK_DESCRIPTION = "Sweetleaves Cannabis Dispensary in the North Loop of Minneapolis, MN.";

export const FALLBACK_HOME_METADATA: Metadata = {
  title: "Sweetleaves Cannabis",
  description: FALLBACK_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { title: "Sweetleaves Cannabis", description: FALLBACK_DESCRIPTION },
};
