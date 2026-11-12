import type { Metadata } from "next";
import { WithTrustBadges } from "@/components/layout/WithTrustBadges";
import { pageUrl } from "@/lib/site";
import { CALI_PACK_COUNT } from "@/data/products";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "About Smoke Cali — Manchester smoke shop for wholesale Cali Packs at £0.22 each, minimum 25 pcs, or £0.20 each from 50. Visit us on Sagar Street.",
  alternates: { canonical: pageUrl("/about") },
  openGraph: {
    url: pageUrl("/about"),
    title: "About Smoke Cali | Manchester Cali Packs",
    description:
      `A real Manchester shop supplying ${CALI_PACK_COUNT} HD Cali Packs. £0.22 each, minimum 25 pcs, or £0.20 each from 50.`,
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <WithTrustBadges>{children}</WithTrustBadges>;
}
