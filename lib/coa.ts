import { getWPData } from "./wp";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CoaBatch {
  flavor: string;
  batchNumber: string;
  pdfUrl: string | null;
}

export interface FlavorMeta {
  displayName: string;
  imageSlug: string;
  halo: string; // CSS color value — applied via inline style because these are data-driven and can't be static Tailwind tokens
}

export interface CoaGroup {
  flavor: string;
  meta: FlavorMeta;
  batches: CoaBatch[];
}

// ---------------------------------------------------------------------------
// Flavor map — keys must be lowercase
// Adding a new flavor requires: (1) a new entry here, (2) a matching image
// at /public/products/gummies/{imageSlug}.png
// ---------------------------------------------------------------------------

export const FLAVOR_MAP: Record<string, FlavorMeta> = {
  "pink lemonade":  { displayName: "Chill · Pink Lemonade", imageSlug: "chill-pink-lemonade", halo: "#f9d7e0" },
  "blackberry":     { displayName: "Sleep · Blackberry",    imageSlug: "sleep-blackberry",    halo: "#cedff7" },
  "passion fruit":  { displayName: "Passion Fruit",         imageSlug: "passion-fruit",       halo: "#d9c7ea" },
  "pineapple":      { displayName: "Pineapple",             imageSlug: "pineapple",           halo: "#f2e7b8" },
  "tropical mix":   { displayName: "Tropical Mix",          imageSlug: "tropical-mix",        halo: "#e8d8f0" },
  "peach":          { displayName: "Peach",                 imageSlug: "peach",               halo: "#fad4bf" },
};

// ---------------------------------------------------------------------------
// Revalidation
// ---------------------------------------------------------------------------

const COA_REVALIDATE_SECONDS = Number(
  process.env.WP_COA_REVALIDATE_SECONDS ?? "300"
);

// ---------------------------------------------------------------------------
// GraphQL
// ---------------------------------------------------------------------------

const GET_COA_BATCHES_QUERY = `
  query GetCoaBatches {
    coaBatches(first: 100, where: { orderby: { field: DATE, order: DESC } }) { # increase limit if batch count ever approaches 100
      nodes {
        coaBatchFields {
          flavor
          batchNumber
          pdfUrl
        }
      }
    }
  }
`;

// ---------------------------------------------------------------------------
// getCoaBatches — fetch all batches from WP, newest first
// ---------------------------------------------------------------------------

export async function getCoaBatches(): Promise<CoaBatch[]> {
  const data = await getWPData(
    GET_COA_BATCHES_QUERY,
    {},
    { revalidateSeconds: COA_REVALIDATE_SECONDS }
  );

  const nodes: any[] = data?.coaBatches?.nodes ?? [];
  return nodes.map((node: any) => ({
    flavor:      node.coaBatchFields?.flavor      ?? "",
    batchNumber: node.coaBatchFields?.batchNumber ?? "",
    pdfUrl:      node.coaBatchFields?.pdfUrl      || null,
  }));
}

// ---------------------------------------------------------------------------
// groupBatchesByFlavor — group flat batch list into per-flavor sections
// Lookup is case-insensitive. Batches with unrecognised flavors are dropped.
// ---------------------------------------------------------------------------

export function groupBatchesByFlavor(batches: CoaBatch[]): CoaGroup[] {
  const groups = new Map<string, CoaGroup>();

  for (const batch of batches) {
    const key = batch.flavor.toLowerCase();
    const meta = FLAVOR_MAP[key];
    if (!meta) continue;

    if (!groups.has(key)) {
      groups.set(key, { flavor: key, meta, batches: [] });
    }
    groups.get(key)!.batches.push(batch);
  }

  return Array.from(groups.values());
}
