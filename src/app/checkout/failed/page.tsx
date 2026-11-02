"use client";

import Link from "next/link";
import { XCircle, ArrowRight, MessageCircle } from "lucide-react";
import { whatsappOrderNumber } from "@/data/social";

export default function CheckoutFailedPage() {
  return (
    <div className="py-20">
      <div className="container-site max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-ink ring-1 ring-gold/50">
          <XCircle className="h-9 w-9 text-gold" />
        </div>
        <h1 className="font-display text-3xl font-bold text-surface-950 mb-3">Payment not completed</h1>
        <p className="text-surface-800/60 mb-2">
          Your payment was cancelled or declined, and you have not been charged for this attempt.
        </p>
        <p className="text-sm text-surface-800/50 mb-8">
          Your basket is still saved. You can try again, use a different card, or order on WhatsApp
          instead.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/checkout/"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-ink text-white font-semibold rounded-xl hover:bg-graphite transition-colors"
          >
            Try again
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={`https://wa.me/${whatsappOrderNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#1ebe57] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Order via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
