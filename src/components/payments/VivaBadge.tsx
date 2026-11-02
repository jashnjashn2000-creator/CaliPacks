/* Official Viva.com logo and payment-method icons, from Viva.com's own merchant assets:
   - Logo: https://euhelp.viva.com/en/articles/4866218-can-i-use-the-viva-com-logo-on-my-website
   - Icons: https://developer.viva.com/payment-methods/payment-methods-icons/ */
import { cn } from "@/lib/utils";

/** Official Viva.com logo badge (navy tile, white mark). */
export function VivaLogo({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/payments/viva-logo.svg"
      alt="Viva.com"
      width={36}
      height={50}
      className={cn("h-12 w-auto rounded-md", className)}
    />
  );
}

const methods = [
  { src: "/payments/visa.svg", alt: "Visa", w: 48, square: false },
  { src: "/payments/mastercard.svg", alt: "Mastercard", w: 36, square: false },
  { src: "/payments/applepay.svg", alt: "Apple Pay", w: 58, square: true },
  { src: "/payments/googlepay.svg", alt: "Google Pay", w: 58, square: true },
];

/** Accepted payment-method icons (Visa, Mastercard, Apple Pay, Google Pay) on white chips. */
export function PaymentMethodIcons({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)} aria-label="Accepted payment methods">
      {methods.map((m) => (
        <li key={m.alt} className={cn("flex h-8 items-center overflow-hidden rounded-md bg-white", !m.square && "px-2")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.src}
            alt={m.alt}
            width={m.w}
            height={m.square ? 58 : 24}
            className={m.square ? "h-9 w-9 max-w-none" : "h-5 w-auto"}
          />
        </li>
      ))}
    </ul>
  );
}

/** "Payments secured by Viva.com" lock-up: official logo + accepted methods. */
export function SecuredByViva({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <VivaLogo className="h-11" />
      <div>
        <p
          className={cn(
            "mb-1.5 text-xs font-semibold",
            tone === "dark" ? "text-white/60" : "text-surface-800/60"
          )}
        >
          Payments secured by Viva.com
        </p>
        <PaymentMethodIcons />
      </div>
    </div>
  );
}
