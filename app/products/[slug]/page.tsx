import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/lib/products";
import DutchieEmbed from "@/app/shop/components/DutchieEmbed";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.metaDescription,
    alternates: { canonical: `/products/${product.slug}` },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  return <div>
    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
    <DutchieEmbed category={product.slug} />
    <p className="mt-4">{product.subheadline}</p>
  </div>;
}
