import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopCatalogue } from "@/components/shop/ShopCatalogue";
import { getCategoryBySlug, categories, categoryProductCount } from "@/data/categories";
import { JsonLd } from "@/components/seo/JsonLd";
import { productsForCategory } from "@/lib/catalogue";
import { pageUrl } from "@/lib/site";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return categories
    .filter((cat) => categoryProductCount(cat.slug) > 0)
    .map((cat) => ({ category: cat.slug }));
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
  if (!category || categoryProductCount(slug) < 1) notFound();
  const items = productsForCategory(category.slug);
  const parent = category.parentSlug ? getCategoryBySlug(category.parentSlug) : undefined;
  const crumbs = [
    { name: "Home", item: pageUrl("/") },
    { name: "Shop", item: pageUrl("/shop") },
    ...(parent ? [{ name: parent.name, item: pageUrl(`/shop/${parent.slug}`) }] : []),
    { name: category.name, item: pageUrl(`/shop/${category.slug}`) },
  ];

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
            itemListElement: crumbs.map((crumb, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: crumb.name,
              item: crumb.item,
            })),
          },
        ]}
      />
      <ShopCatalogue categorySlug={slug} />
    </>
  );
}
