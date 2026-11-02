import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <div className="container-site">
        <h1 className="text-6xl font-bold text-surface-900 mb-4">404</h1>
        <p className="text-lg text-surface-800/60 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="inline-flex px-6 py-3 bg-ink text-white font-semibold rounded-xl hover:bg-graphite transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
