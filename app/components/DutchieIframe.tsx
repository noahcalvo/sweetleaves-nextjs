interface Props {
  src: string;
}

export default function DutchieIframe({ src }: Props) {
  return (
    <div className="w-full rounded-[30px] md:rounded-[40px] overflow-hidden bg-white">
      <iframe
        src={src}
        title="Shop menu"
        className="w-full border-0"
        style={{ minHeight: "600px" }}
        loading="lazy"
        allow="payment"
      />
    </div>
  );
}
