import Image from "next/image";

interface Props {
  src: string;
  alt: string;
}

export default function StorePhoto({ src, alt }: Props) {
  return (
    <div className="relative w-full h-[361px] md:h-[408px] rounded-[40px] overflow-hidden">
      <Image src={src} alt={alt} fill sizes="(max-width: 1365px) 100vw, 1365px" className="object-cover" />
    </div>
  );
}
