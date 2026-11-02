import { Package, Sparkles, Truck } from "lucide-react";

export function WholesaleBanner() {
  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-gold/30 bg-ink shadow-[0_16px_40px_rgba(5,31,32,0.15)]">
      <div className="grid gap-3 p-4 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-white/15 sm:p-5">
        <div className="flex items-center gap-3 text-white">
          <Sparkles className="h-5 w-5 shrink-0 text-gold" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">
              Wholesale price
            </p>
            <p className="text-lg font-black leading-tight">£0.20 per pack</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-white">
          <Package className="h-5 w-5 shrink-0 text-gold" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">
              Minimum order
            </p>
            <p className="text-lg font-black leading-tight">50 pcs</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-white">
          <Truck className="h-5 w-5 shrink-0 text-gold" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">
              UK dispatch
            </p>
            <p className="text-lg font-black leading-tight">2–3 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}
