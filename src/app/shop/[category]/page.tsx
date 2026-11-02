import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopCatalogue } from "@/components/shop/ShopCatalogue";
import { getCategoryBySlug, categories } from "@/data/categories";
import { JsonLd } from "@/components/seo/JsonLd";
import { products } from "@/data/products";
import { pageUrl } from "@/lib/site";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };

  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: pageUrl(`/shop/${category.slug}`) },
    openGraph: {
      url: pageUrl(`/shop/${category.slug}`),
      title: `${category.name} | Smoke Cali`,
      description: category.description,
      images: [{ url: category.image, alt: category.name }],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();
  const items = products.filter((p) => p.categorySlug === category.slug);

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${pageUrl(`/shop/${category.slug}`)}#collection`,
            url: pageUrl(`/shop/${category.slug}`),
            name: `${category.name} | Smoke Cali`,
            description: category.description,
            isPartOf: { "@id": "https://smokecali.co.uk/#website" },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: items.length,
              itemListElement: items.slice(0, 50).map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: pageUrl(`/product/${p.slug}`),
                name: p.name,
              })),
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: pageUrl("/") },
              { "@type": "ListItem", position: 2, name: "Shop", item: pageUrl("/shop") },
              { "@type": "ListItem", position: 3, name: category.name, item: pageUrl(`/shop/${category.slug}`) },
            ],
          },
        ]}
      />
      <ShopCatalogue categorySlug={slug} />
    </>
  );
}
