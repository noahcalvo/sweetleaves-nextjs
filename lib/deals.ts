import { getWPData } from "./wp";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DealSlide {
  url: string;
  alt: string;
  width: number;
  height: number;
}

// ---------------------------------------------------------------------------
// GraphQL
// ---------------------------------------------------------------------------

const GET_DEALS_QUERY = `
  query GetDeals {
    deals(first: 20, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        title
        featuredImage {
          node {
            sourceUrl
            mediaDetails {
              width
              height
            }
          }
        }
      }
    }
  }
`;

// ---------------------------------------------------------------------------
// getDealsBannerSlides
// ---------------------------------------------------------------------------

export async function getDealsBannerSlides(): Promise<DealSlide[]> {
  const data = await getWPData(GET_DEALS_QUERY);
  const nodes: any[] = data?.deals?.nodes ?? [];
  return nodes
    .filter((node: any) => node?.featuredImage?.node?.sourceUrl)
    .map((node: any) => {
      const img = node.featuredImage.node;
      return {
        url: img.sourceUrl,
        alt: node.title ?? "",
        width: img.mediaDetails?.width ?? 1280,
        height: img.mediaDetails?.height ?? 320,
      };
    });
}
