import Image from "next/image";

interface Props {
  src: string;
  alt: string;
}

export default function StorePhoto({ src, alt }: Props) {
  return (
    <div className="relative w-full h-[361px] md:h-[408px] rounded-[40px] overflow-hidden">
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}
