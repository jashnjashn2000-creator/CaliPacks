import Link from "next/link";
import { MessageCircle, CreditCard, ShoppingBag } from "lucide-react";
import { contactInfo, whatsappOrderNumber } from "@/data/social";

export default function AccountPage() {
  const whatsappHref = `https://wa.me/${whatsappOrderNumber}?text=${encodeURIComponent(
    "Hi Smoke Cali — I’d like help with an order."
  )}`;

  return (
    <div className="py-12 md:py-16">
      <div className="container-site max-w-md mx-auto text-center">
        <div className="w-14 h-14 rounded-full bg-ink flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-7 h-7 text-gold" />
        </div>
        <h1 className="text-2xl font-bold text-surface-900">Shop as a guest</h1>
        <p className="text-sm text-surface-800/60 mt-2 mb-8">
          Online accounts are not required. Add products to your cart, pay at checkout, or message
          the shop on WhatsApp.
        </p>
        <div className="space-y-3">
          <Link
            href="/shop/"
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-ink text-white font-semibold rounded-xl hover:bg-graphite"
          >
            Continue shopping
          </Link>
          <Link
            href="/checkout/"
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gold text-ink font-bold rounded-xl hover:bg-brand-400"
          >
            <CreditCard className="w-5 h-5" />
            Go to checkout
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#1ebe57]"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp the shop
          </a>
          <a href={contactInfo.phoneHref} className="block text-sm font-bold text-brand-700 hover:underline">
            Call {contactInfo.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
