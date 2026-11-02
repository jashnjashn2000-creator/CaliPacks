import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, products } from "@/data/products";
import { getCategoryBySlug } from "@/data/categories";
import { ProductGallery, AddToCartButton } from "@/components/products/ProductDetail";
import { ProductCard } from "@/components/products/ProductCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatPrice } from "@/lib/utils";
import { SITE_NAME, SITE_URL, pageUrl } from "@/lib/site";
import { offerShippingAndReturns } from "@/lib/local-business";
import { isCaliPack, productUnit, savingPercent } from "@/lib/product";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  const pack = isCaliPack(product);
  const titleName = pack ? `${product.name} Cali Pack` : product.name;
  const priceLabel = pack
    ? "£0.20 per pack, minimum 50 pcs"
    : `${formatPrice(product.price)} each`;

  return {
    title: titleName,
    description: `Buy ${product.name} from Smoke Cali, Manchester. ${priceLabel}. UK delivery from £4.00, dispatched in 2–3 business days.`,
    openGraph: {
      type: "website",
      url: pageUrl(`/product/${product.slug}`),
      title: `${product.name} — ${formatPrice(product.price)} ${productUnit(product)} | Smoke Cali`,
      description: product.shortDescription,
      images: [{ url: product.image, alt: `${titleName} — Smoke Cali` }],
    },
    twitter: {
      card: "summary_large_image",
      title: titleName,
      description: product.shortDescription,
      images: [product.image],
    },
    alternates: {
      canonical: pageUrl(`/product/${product.slug}`),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.categorySlug);
  const related = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="py-8 md:py-12">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: isCaliPack(product) ? `${product.name} Cali Pack` : product.name,
            "@id": `${pageUrl(`/product/${product.slug}`)}#product`,
            url: pageUrl(`/product/${product.slug}`),
            image: (product.images?.length ? product.images : [product.image]).map((img) => `${SITE_URL}${img}`),
            ...(category ? { category: category.name } : {}),
            description: product.description,
            sku: product.sku,
            brand: { "@type": "Brand", name: SITE_NAME },
            offers: {
              "@type": "Offer",
              url: pageUrl(`/product/${product.slug}`),
              priceCurrency: "GBP",
              price: product.price.toFixed(2),
              availability: product.inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              priceValidUntil: "2027-12-31",
              itemCondition: "https://schema.org/NewCondition",
              ...(product.minOrder && product.minOrder > 1
                ? {
                    eligibleQuantity: {
                      "@type": "QuantitativeValue",
                      minValue: product.minOrder,
                      unitCode: "C62",
                    },
                  }
                : {}),
              seller: { "@id": `${SITE_URL}/#organization` },
              ...offerShippingAndReturns(product),
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: pageUrl("/"),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Shop",
                item: pageUrl("/shop"),
              },
              ...(category
                ? [
                    {
                      "@type": "ListItem",
                      position: 3,
                      name: category.name,
                      item: pageUrl(`/shop/${category.slug}`),
                    },
                  ]
                : []),
              {
                "@type": "ListItem",
                position: category ? 4 : 3,
                name: product.name,
                item: pageUrl(`/product/${product.slug}`),
              },
            ],
          },
        ]}
      />
      <div className="container-site">
        <nav aria-label="Breadcrumb" className="text-sm text-surface-800/40 mb-8">
          <Link href="/" className="hover:text-brand-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href={category ? `/shop/${category.slug}` : "/shop"} className="hover:text-brand-700">
            {category?.name ?? "Shop"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-surface-800 line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <ProductGallery product={product} />

          <div>
            {product.isNew && (
              <span className="inline-block px-2.5 py-1 bg-ink text-brand-300 text-[10px] font-bold uppercase tracking-[0.18em] rounded-full mb-3">
                New Arrival
              </span>
            )}
            <h1 className="font-serif text-3xl md:text-[2.6rem] font-normal leading-tight tracking-tight mb-3 text-ink">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mb-6 tabular-nums">
              <span className="text-2xl font-extrabold text-ink">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="price-was text-lg font-semibold">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="text-sm text-brand-700 font-bold">{productUnit(product)}</span>
              {savingPercent(product) ? (
                <span className="save-tag">Save {savingPercent(product)}%</span>
              ) : null}
            </div>

            <p className="text-graphite/75 leading-relaxed mb-8 font-medium">
              {product.description}
            </p>

            <div className="border-t border-surface-200 pt-6 mb-6">
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-surface-800/40">SKU</dt>
                  <dd className="font-medium">{product.sku}</dd>
                </div>
                <div>
                  <dt className="text-surface-800/40">Availability</dt>
                  <dd className="font-medium text-brand-700">
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </dd>
                </div>
                {category && (
                  <div>
                    <dt className="text-surface-800/40">Category</dt>
                    <dd>
                      <Link href={`/shop/${category.slug}`} className="font-medium text-brand-700 hover:underline">
                        {category.name}
                      </Link>
                    </dd>
                  </div>
                )}
                {product.minOrder && product.minOrder > 1 && (
                  <div>
                    <dt className="text-surface-800/40">Min. Order</dt>
                    <dd className="font-medium">{product.minOrder} pcs</dd>
                  </div>
                )}
              </dl>
            </div>

            <AddToCartButton product={product} />
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16 pt-12 border-t border-surface-200">
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-ink mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
