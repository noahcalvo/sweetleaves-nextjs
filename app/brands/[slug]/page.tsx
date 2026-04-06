import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { brands } from "@/lib/brands";
import CatalogPageTemplate from "@/app/components/CatalogPageTemplate";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) return {};
  return {
    title: brand.name,
    description: brand.metaDescription,
    alternates: { canonical: `/brands/${brand.slug}` },
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) notFound();

  return <CatalogPageTemplate entry={brand} />;
}
