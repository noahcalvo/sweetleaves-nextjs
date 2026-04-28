import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/lib/products";
import CatalogPageTemplate from "@/app/components/CatalogPageTemplate";

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
    title: { absolute: product.metaTitle ?? product.name },
    description: product.metaDescription,
    alternates: { canonical: `/products/${product.slug}/` },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  return <CatalogPageTemplate entry={product} />;
}
