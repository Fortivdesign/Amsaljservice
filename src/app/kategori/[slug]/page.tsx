import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing } from "@/components/ProductListing";
import { categories, getCategory, products } from "@/data/catalog";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: getCategory(slug)?.name ?? "Kategori" };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  return (
    <ProductListing
      key={category.slug}
      title={category.name}
      description={category.description}
      pool={products}
      initialCategory={category.slug}
      breadcrumbs={[{ label: "Alla produkter", href: "/sortiment" }, { label: category.name }]}
    />
  );
}
