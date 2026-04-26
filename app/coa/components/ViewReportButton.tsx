"use client";

interface Props {
  batch: string;
}

export default function ViewReportButton({ batch }: Props) {
  return (
    <button
      onClick={() => alert(`Opening COA PDF for ${batch}…`)}
      className="inline-flex gap-2 items-center bg-dark-green text-light-gold px-[18px] py-[10px] rounded-full text-[13px] font-semibold transition-all duration-200 hover:bg-light-gold hover:text-dark-green max-sm:px-[14px] max-sm:py-2 max-sm:text-[12px]"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3v13" />
        <path d="m7 11 5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
      View Report
    </button>
  );
}
