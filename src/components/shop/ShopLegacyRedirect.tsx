"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ShopLegacyRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/shop/");
  }, [router]);

  return (
    <div className="container-site py-20 text-center">
      <p className="font-semibold text-black/55">Taking you to the Cali Packs shop…</p>
      <Link href="/shop" className="mt-3 inline-block font-bold text-brand-700 hover:underline">
        Continue to shop
      </Link>
    </div>
  );
}
