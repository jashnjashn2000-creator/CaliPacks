import type { Metadata } from "next";
import { WithTrustBadges } from "@/components/layout/WithTrustBadges";
import { pageUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Account",
  description: "Smoke Cali account and order options.",
  robots: { index: false, follow: false },
  alternates: { canonical: pageUrl("/account") },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <WithTrustBadges>{children}</WithTrustBadges>;
}
