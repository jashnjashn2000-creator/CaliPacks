import type { Metadata } from "next";
import { WithTrustBadges } from "@/components/layout/WithTrustBadges";
import { pageUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout for Smoke Cali orders.",
  robots: { index: false, follow: false },
  alternates: { canonical: pageUrl("/checkout") },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <WithTrustBadges>{children}</WithTrustBadges>;
}
