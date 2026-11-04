import type { Metadata } from "next";
import { WithTrustBadges } from "@/components/layout/WithTrustBadges";
import { pageUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Custom Orders",
  description:
    "Request custom Cali Packs and branded packaging from Smoke Cali. Wholesale minimum 25 pcs, UK dispatch in 2–3 days.",
  alternates: { canonical: pageUrl("/custom-orders") },
};

export default function CustomOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WithTrustBadges>{children}</WithTrustBadges>;
}
