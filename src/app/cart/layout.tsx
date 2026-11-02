import type { Metadata } from "next";
import { WithTrustBadges } from "@/components/layout/WithTrustBadges";
import { pageUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your Smoke Cali shopping cart.",
  robots: { index: false, follow: false },
  alternates: { canonical: pageUrl("/cart") },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <WithTrustBadges>{children}</WithTrustBadges>;
}
