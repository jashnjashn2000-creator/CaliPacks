import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageUrl } from "@/lib/site";
import { SellerDetails } from "@/components/legal/SellerDetails";
import { DeliveryTable } from "@/components/legal/DeliveryTable";
import { TermsContent } from "@/components/legal/TermsContent";
import { ReturnsContent } from "@/components/legal/ReturnsContent";

const pages: Record<string, { title: string; content: string }> = {
  terms: {
    title: "Terms & Conditions",
    content: "Terms and conditions for orders from SMOKE CALI LTD: 18+ only, ordering and contract formation, pricing, card payments processed securely by Viva.com, UK postage shown on each product (highest postage charged once), your 14-day right to cancel, faulty goods and governing law.",
  },
  shipping: {
    title: "Shipping Policy",
    content: "UK delivery by Royal Mail Tracked 48. Each product shows its postage or free UK delivery. When you order several items you pay the highest postage once. In-stock orders are dispatched within 2–3 business days and tracking is emailed when your order ships.",
  },
  returns: {
    title: "Returns & Refunds",
    content: "Cancel within 14 days of receiving your order for a refund on unopened, unused goods (you pay return postage), or report faulty or damaged goods and we will repair, replace or refund under the Consumer Rights Act 2015.",
  },
};

interface LegalPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) return { title: "Page Not Found" };
  return {
    title: page.title,
    description: page.content.slice(0, 155),
    alternates: { canonical: pageUrl(`/${slug}`) },
    openGraph: {
      url: pageUrl(`/${slug}`),
      title: `${page.title} | Smoke Cali`,
      description: page.content.slice(0, 155),
    },
  };
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) notFound();

  return (
    <div className="py-12 md:py-16">
      <div className="container-site max-w-3xl">
        <h1 className="text-3xl font-bold text-surface-900 tracking-tight mb-6">
          {page.title}
        </h1>
        {slug === "terms" ? (
          <TermsContent />
        ) : slug === "returns" ? (
          <ReturnsContent />
        ) : (
          <p className="text-surface-800/70 leading-relaxed">{page.content}</p>
        )}
        {slug === "shipping" && <DeliveryTable />}
        <SellerDetails />
      </div>
    </div>
  );
}
