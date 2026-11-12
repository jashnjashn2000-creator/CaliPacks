"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";
import { mainNav } from "@/data/navigation";
import { categoryProductCount } from "@/data/categories";
import { useCart } from "@/context/CartContext";
import { Logo } from "@/components/layout/Logo";
import { PayNowButton } from "@/components/payments/PayNowButton";
import { cn } from "@/lib/utils";

/** Drop shop links whose category has no visible products (for example hidden lighters). */
function showNavChild(child: { href: string }) {
  const match = child.href.match(/^\/shop\/([^/?#]+)/);
  if (!match) return true;
  return categoryProductCount(match[1]) > 0;
}

export function Header() {
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinkClass =
    "relative px-3 py-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-white/80 transition-colors hover:text-white after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform hover:after:scale-x-100";

  const iconButtonClass =
    "p-2 sm:p-2.5 rounded-full text-white/75 hover:text-gold hover:bg-white/5 transition-colors";

  return (
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur-xl backdrop-saturate-150 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-gold/50 after:to-transparent">
      <div className="container-site">
        <div className="flex items-center justify-between h-[84px] lg:h-[96px]">
          <Link
            href="/"
            className="rounded-xl px-1 py-0.5 transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
          >
            <span className="block sm:hidden">
              <Logo size="sm" variant="light" showTagline={false} />
            </span>
            <span className="hidden sm:block">
              <Logo size="lg" variant="light" />
            </span>
          </Link>

          {/* Desktop Nav — Shop → Contact Us */}
          <nav className="hidden lg:flex items-center gap-4">
            {mainNav.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setShopOpen(true)}
                  onMouseLeave={() => setShopOpen(false)}
                >
                  <button
                    type="button"
                    className={cn(
                      "flex items-center gap-1",
                      navLinkClass,
                      shopOpen && "text-white after:scale-x-100"
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        shopOpen && "rotate-180 text-gold"
                      )}
                    />
                  </button>
                  {shopOpen && (
                    <div className="absolute top-full left-0 pt-3 w-72">
                      <div className="max-h-[min(70vh,640px)] overflow-y-auto bg-graphite rounded-xl shadow-2xl border border-white/10 p-2">
                        {item.children.filter(showNavChild).map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block px-4 py-3 rounded-lg hover:bg-white/5 transition-colors group",
                              child.indent && "py-2 pl-7"
                            )}
                          >
                            <span className="font-bold text-sm text-white group-hover:text-gold">
                              {child.label}
                            </span>
                            {child.description && (
                              <span className="block text-xs text-white/50 mt-0.5 font-medium">
                                {child.description}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.label} href={item.href} className={navLinkClass}>
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <PayNowButton compact className="!w-auto shrink-0" />
            <button
              type="button"
              onClick={() => {
                setSearchOpen((open) => !open);
                setMobileOpen(false);
              }}
              className={iconButtonClass}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/account"
              className={cn("hidden sm:flex", iconButtonClass)}
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>
            <Link href="/cart" className={cn("relative", iconButtonClass)} aria-label="Cart">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gold text-ink text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn("lg:hidden", iconButtonClass)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="pb-4">
            <form action="/shop/" method="get" className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="search"
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 bg-graphite text-white placeholder:text-white/40 rounded-xl border border-white/10 focus:border-gold/70 focus:outline-none focus:ring-2 focus:ring-gold/25 transition-all text-sm font-medium"
                autoFocus
              />
            </form>
          </div>
        )}
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-graphite border-t border-white/10 shadow-[0_16px_30px_rgba(0,0,0,0.35)]">
          <nav className="container-site py-4 space-y-1">
            {mainNav.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <p className="px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">
                    {item.label}
                  </p>
                  {item.children.filter(showNavChild).map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block px-4 py-2.5 text-base font-semibold text-white hover:text-gold hover:bg-white/5 rounded-lg",
                        child.indent && "py-2 pl-8 text-sm"
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-base font-semibold text-white hover:text-gold hover:bg-white/5 rounded-lg"
                >
                  {item.label}
                </Link>
              )
            )}
            <Link
              href="/account"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 text-base font-semibold text-white hover:text-gold hover:bg-white/5 rounded-lg"
            >
              My Account
            </Link>
            <div className="px-4 pt-3">
              <PayNowButton className="w-full" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
