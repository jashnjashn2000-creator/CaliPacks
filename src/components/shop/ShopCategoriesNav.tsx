"use client";

import Link from "next/link";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";

interface ShopCategoriesNavProps {
  activeSlug?: string;
  isNew?: boolean;
}

const pillBase = "rounded-full border px-4 py-2 text-sm font-semibold transition";
const pillActive = "border-ink bg-ink text-white";
const pillIdle = "border-brand-200 bg-white text-ink/70 hover:border-gold hover:text-ink";

export function ShopCategoriesNav({ activeSlug, isNew = false }: ShopCategoriesNavProps) {
  return (
    <nav
      aria-label="Product categories"
      className="mb-8 -mx-1 overflow-x-auto pb-1"
    >
      <div className="flex min-w-max gap-2 px-1">
        <Link
          href="/shop/"
          className={cn(pillBase, !activeSlug && !isNew ? pillActive : pillIdle)}
        >
          All
        </Link>
        <Link
          href="/shop/?filter=new"
          className={cn(pillBase, isNew ? pillActive : pillIdle)}
        >
          New
        </Link>
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/shop/${category.slug}/`}
            className={cn(pillBase, activeSlug === category.slug ? pillActive : pillIdle)}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
