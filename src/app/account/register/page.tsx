import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container-site max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold text-surface-900 mb-2">No account needed</h1>
        <p className="text-sm text-surface-800/60 mb-6">
          Shop as a guest — add to cart and pay at checkout, or WhatsApp the shop.
        </p>
        <Link
          href="/account/"
          className="inline-flex px-6 py-3 bg-ink text-white font-semibold rounded-xl hover:bg-graphite transition-colors"
        >
          How to order
        </Link>
      </div>
    </div>
  );
}
