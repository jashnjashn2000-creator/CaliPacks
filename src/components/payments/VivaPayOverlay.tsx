"use client";

import { Lock, ShieldCheck, X } from "lucide-react";
import { VivaLogo } from "@/components/payments/VivaBadge";

interface VivaPayOverlayProps {
  open: boolean;
  status: "preparing" | "redirecting" | "error";
  message?: string;
  onClose: () => void;
}

export function VivaPayOverlay({ open, status, message, onClose }: VivaPayOverlayProps) {
  if (!open) return null;

  const title =
    status === "preparing"
      ? "Opening secure checkout…"
      : status === "redirecting"
        ? "Taking you to Viva.com…"
        : "Checkout could not start";

  const body =
    message ||
    (status === "redirecting"
      ? "You are being sent to Viva.com’s secure payment page. Please don’t close this tab."
      : status === "preparing"
        ? "Connecting to Viva.com. Your card details are entered only on Viva.com’s secure page."
        : "Please try again, or order on WhatsApp if the problem continues.");

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gold/50 bg-cream p-7 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        {status === "error" && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1.5 text-surface-800/40 hover:bg-white hover:text-ink"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="relative text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink">
            {status === "error" ? (
              <ShieldCheck className="h-8 w-8 text-gold" />
            ) : (
              <Lock className="h-8 w-8 text-gold" />
            )}
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <VivaLogo className="h-9" />
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-700">
              Payments secured by Viva.com
            </p>
          </div>
          <h2 className="mt-2 font-display text-2xl font-black text-surface-950">{title}</h2>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-surface-800/70">{body}</p>
          <p className="mt-3 rounded-xl border border-brand-200 bg-white px-3 py-2 text-xs font-bold text-brand-800">
            UK delivery is calculated by order weight and included in the total on the payment page.
          </p>
          {status !== "error" && (
            <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-brand-200">
              <div className="pay-now-bar h-full w-1/2 rounded-full bg-gold" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
