import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Shop cannabis flower, edibles, pre-rolls, beverages, vapes, and more at Sweetleaves in Minneapolis.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <div className="max-w-[1365px] mx-auto px-4 md:px-6 py-5 md:py-8 flex flex-col gap-5 lg:gap-[30px]">
      <h1 className="font-poppins-bold text-[35px] md:text-[55px] text-dark-green text-center leading-tight">
        Products
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-[25px]">
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/products/${product.slug}`}
            className="group relative aspect-[4/3] rounded-[30px] overflow-hidden"
          >
            <Image
              src={product.heroImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-5 left-5 font-poppins-bold text-[25px] text-white leading-tight">
              {product.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
