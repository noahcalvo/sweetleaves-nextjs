import { FLAVOR_MAP, type CoaBatch } from "@/lib/coa";

interface Props {
  subBatchNumbers: string[];
  batchLookup: Map<string, CoaBatch>;
}

export default function SubBatchPills({ subBatchNumbers, batchLookup }: Props) {
  const pills = subBatchNumbers.flatMap((num) => {
    const batch = batchLookup.get(num);
    if (!batch?.pdfUrl) return [];
    const halo = FLAVOR_MAP[batch.flavor.toLowerCase()]?.halo ?? "#eee";
    return [{ num, pdfUrl: batch.pdfUrl, halo }];
  });

  if (!pills.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {pills.map(({ num, pdfUrl, halo }) => (
        <a
          key={num}
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[12px] font-semibold text-dark-green px-3 py-1.5 rounded-full transition-opacity duration-150 hover:opacity-75"
          style={{ background: halo }}
        >
          {num}
        </a>
      ))}
    </div>
  );
}
