import Link from "next/link";
import { Truck, Shield, Headphones, Package, Sparkles, Phone } from "lucide-react";
import { contactInfo } from "@/data/social";

export function AnnouncementBar() {
  return (
    <div className="bg-ink border-b border-white/10 text-white/85 text-center text-xs sm:text-[13px] tracking-wide py-2 px-4">
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-semibold">
        <Sparkles className="w-3.5 h-3.5 text-gold inline shrink-0" />
        <span>
          Cali Packs <span className="text-gold font-bold">£0.20</span> per pack
          · min 50 pcs
        </span>
        <span className="hidden sm:inline text-white/25">·</span>
        <span>
          UK delivery from <span className="text-gold font-bold">£4.00</span>
        </span>
        <span className="hidden sm:inline text-white/25">·</span>
        <a
          href={contactInfo.phoneHref}
          className="text-white underline decoration-gold/60 underline-offset-2 hover:text-gold"
        >
          {contactInfo.phone}
        </a>
        <span className="hidden sm:inline text-white/25">·</span>
        <Link href="/shop" className="text-white underline decoration-gold/60 underline-offset-2 hover:text-gold">
          Shop now · tracked UK delivery
        </Link>
      </p>
    </div>
  );
}

export function TrustBadges() {
  const badges = [
    {
      icon: Truck,
      title: "Delivery from £4.00",
      desc: "Royal Mail Tracked 48",
    },
    {
      icon: Shield,
      title: "HD Studio Photos",
      desc: "Clear white background",
    },
    {
      icon: Package,
      title: "£0.20 Per Pack",
      desc: "Minimum 50 pcs",
    },
    {
      icon: Headphones,
      title: "Call Us",
      desc: contactInfo.phone,
      href: contactInfo.phoneHref,
    },
  ];

  return (
    <section className="relative z-10 px-3 sm:px-4 lg:px-6 pt-3 pb-1">
      <div className="container-site">
        <div className="surface-card rounded-2xl overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-ink/[0.06]">
            {badges.map((badge) => {
              const Content = (
                <>
                  <div className="icon-tile flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center">
                    <badge.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm sm:text-base text-ink tracking-tight leading-tight">
                      {badge.title}
                    </p>
                    <p className="text-xs sm:text-sm text-graphite/65 mt-0.5 font-medium truncate">
                      {badge.desc}
                    </p>
                  </div>
                </>
              );

              if (badge.href) {
                return (
                  <a
                    key={badge.title}
                    href={badge.href}
                    className="flex items-center gap-3 p-4 sm:p-5 hover:bg-brand-50 transition-colors"
                  >
                    {Content}
                    <Phone className="w-4 h-4 text-brand-600 ml-auto hidden sm:block shrink-0" />
                  </a>
                );
              }

              return (
                <div key={badge.title} className="flex items-center gap-3 p-4 sm:p-5">
                  {Content}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
