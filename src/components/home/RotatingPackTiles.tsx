"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { thumbSrc as thumb } from "@/lib/product";

const SWAP_EVERY_MS = 2800;
const SLOTS = 2;

interface Slot {
  current: Product;
  previous: Product | null;
  swapId: number;
}

function pickRandom(pool: Product[], exclude: Set<string>): Product | null {
  const options = pool.filter((p) => !exclude.has(p.id));
  if (!options.length) return null;
  return options[Math.floor(Math.random() * options.length)];
}

/** Download and decode before the slide starts so the animation never waits on the network. */
async function preload(src: string) {
  const img = new window.Image();
  img.src = src;
  try {
    await img.decode();
  } catch {
    // Broken or blocked image — the tile just shows alt text.
  }
}

export function RotatingPackTiles({ products }: { products: Product[] }) {
  // First render uses the first packs so server and client HTML match.
  const [slots, setSlots] = useState<Slot[]>(() =>
    products.slice(0, SLOTS).map((p) => ({ current: p, previous: null, swapId: 0 }))
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const slotsRef = useRef(slots);
  const hoveredRef = useRef(false);

  useEffect(() => {
    slotsRef.current = slots;
  }, [slots]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || products.length <= SLOTS) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;

    let timer: number | undefined;
    let turn = 0;
    let busy = false;
    let cancelled = false;

    const swap = async () => {
      if (busy || hoveredRef.current || document.hidden) return;
      busy = true;
      const index = turn % SLOTS;
      turn += 1;
      const next = pickRandom(products, new Set(slotsRef.current.map((s) => s.current.id)));
      if (next) {
        await preload(thumb(next.image));
        if (!cancelled) {
          setSlots((prev) =>
            prev.map((slot, i) =>
              i === index ? { current: next, previous: slot.current, swapId: slot.swapId + 1 } : slot
            )
          );
        }
      }
      busy = false;
    };

    const start = () => {
      if (timer === undefined) timer = window.setInterval(swap, SWAP_EVERY_MS);
    };
    const stop = () => {
      window.clearInterval(timer);
      timer = undefined;
    };

    // Only run while the tiles are on screen.
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    observer.observe(root);

    return () => {
      cancelled = true;
      observer.disconnect();
      stop();
    };
  }, [products]);

  const clearPrevious = (index: number) =>
    setSlots((prev) => prev.map((slot, i) => (i === index ? { ...slot, previous: null } : slot)));

  return (
    <div
      ref={rootRef}
      className="grid grid-cols-2 gap-3 sm:gap-4"
      onMouseEnter={() => (hoveredRef.current = true)}
      onMouseLeave={() => (hoveredRef.current = false)}
      onFocus={() => (hoveredRef.current = true)}
      onBlur={() => (hoveredRef.current = false)}
    >
      {slots.map(({ current, previous, swapId }, i) => (
        <Link
          key={i}
          href={`/product/${current.slug}`}
          className="surface-card group flex flex-col overflow-hidden rounded-[1.5rem] [contain:layout_paint]"
        >
          <span className="relative block flex-1 min-h-[140px] overflow-hidden">
            {previous && (
              <Image
                key={`prev-${swapId}`}
                src={thumb(previous.image)}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 1023px) 45vw, 220px"
                className="pack-fill pack-swap-out"
                onAnimationEnd={() => clearPrevious(i)}
              />
            )}
            <Image
              key={`cur-${swapId}`}
              src={thumb(current.image)}
              alt={current.name}
              fill
              sizes="(max-width: 1023px) 45vw, 220px"
              className={`pack-fill ${swapId ? "pack-swap-in" : ""}`}
            />
          </span>
          <span
            key={`meta-${swapId}`}
            className={`flex items-center justify-between gap-2 overflow-hidden border-t border-ink/5 px-3 py-2.5 ${swapId ? "pack-name-in" : ""}`}
          >
            <span className="truncate text-[13px] font-semibold text-ink">{current.name}</span>
            <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold tabular-nums text-brand-700 ring-1 ring-brand-200/60">
              {formatPrice(current.price)}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
