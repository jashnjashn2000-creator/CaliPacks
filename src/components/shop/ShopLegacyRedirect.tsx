"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ShopLegacyRedirect({
  href = "/shop/",
  message = "Taking you to the Cali Packs shop…",
}: {
  href?: string;
  message?: string;
}) {
  const router = useRouter();

  useEffect(() => {
    router.replace(href);
  }, [router, href]);

  return (
    <div className="container-site py-20 text-center">
      <p className="font-semibold text-black/55">{message}</p>
      <Link href={href} className="mt-3 inline-block font-bold text-brand-700 hover:underline">
        Continue
      </Link>
    </div>
  );
}
