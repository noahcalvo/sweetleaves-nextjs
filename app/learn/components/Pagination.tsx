import Link from "next/link";

interface Props {
  currentPage: number;
  pageCount: number;
  basePath: string;
  searchParams?: Record<string, string>;
}

export default function Pagination({
  currentPage,
  pageCount,
  basePath,
  searchParams = {},
}: Props) {
  if (pageCount <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    const qs = params.toString();
    return `${basePath}${qs ? `?${qs}` : ""}`;
  }

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center py-[10px]">
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="bg-orange-glow rounded-full size-[47px] flex items-center justify-center shrink-0 rotate-180"
          aria-label="Previous page"
        >
          <span className="font-poppins-semibold text-[55px] text-white leading-none">
            &gt;
          </span>
        </Link>
      ) : (
        <div className="size-[47px]" />
      )}

      <div className="flex items-center justify-center font-poppins-bold text-[30px] text-dark-green uppercase mx-4 gap-4">
        {pages.map((p) => (
          <Link
            key={p}
            href={buildHref(p)}
            className={p === currentPage ? "underline" : "opacity-60"}
          >
            {p}
          </Link>
        ))}
      </div>

      {currentPage < pageCount ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="bg-orange-glow rounded-full size-[47px] flex items-center justify-center shrink-0"
          aria-label="Next page"
        >
          <span className="font-poppins-semibold text-[55px] text-white leading-none">
            &gt;
          </span>
        </Link>
      ) : (
        <div className="size-[47px]" />
      )}
    </div>
  );
}
