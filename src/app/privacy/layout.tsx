import { WithTrustBadges } from "@/components/layout/WithTrustBadges";

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <WithTrustBadges>{children}</WithTrustBadges>;
}
