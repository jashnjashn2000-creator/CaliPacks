import Link from "next/link";
import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface PayNowButtonProps {
  href?: string;
  className?: string;
  compact?: boolean;
}

export function PayNowButton({
  href = "/checkout",
  className,
  compact = false,
}: PayNowButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "pay-now-btn inline-flex items-center justify-center gap-2 rounded-xl bg-gold font-bold text-ink shadow-[0_8px_22px_rgba(142,182,155,0.25)] transition hover:bg-brand-400 hover:-translate-y-0.5",
        compact ? "p-2.5 text-xs sm:px-3.5 sm:text-sm" : "w-full px-6 py-4 text-base",
        className
      )}
      aria-label="Pay now"
    >
      <CreditCard className={compact ? "h-4 w-4 shrink-0" : "h-5 w-5 shrink-0"} />
      <span className={cn(compact && "max-sm:sr-only")}>Pay Now</span>
    </Link>
  );
}
