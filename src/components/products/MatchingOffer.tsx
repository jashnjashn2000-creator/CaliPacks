import Image from "next/image";
import Link from "next/link";
import { shopOfferCallout } from "@/lib/shop-offers";

/** Links a single item to the existing bundle that already includes it. */
export function MatchingOffer({ productId }: { productId: string }) {
  const offer = shopOfferCallout(productId);
  if (!offer) return null;

  return (
    <Link
      href={offer.href}
      className="mt-6 block rounded-2xl border border-gold/60 bg-brand-50 px-4 py-4 transition hover:border-ink"
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-800">Shop offer</p>
      <p className="mt-1 text-sm font-bold text-ink">{offer.heading}</p>
      <p className="mt-1 text-xs font-medium leading-relaxed text-graphite/75">{offer.detail}</p>
      {offer.images?.length ? (
        <span className="mt-3 flex gap-3">
          {offer.images.map((image) => (
            <span
              key={image.src}
              className="relative h-24 w-24 overflow-hidden rounded-xl bg-white ring-1 ring-black/10"
            >
              <Image src={image.src} alt={image.alt} fill sizes="96px" className="object-contain p-1" />
            </span>
          ))}
        </span>
      ) : null}
    </Link>
  );
}
