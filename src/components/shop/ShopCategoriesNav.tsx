"use client";

import Link from "next/link";
import { childCategories, getCategoryBySlug, topLevelCategories } from "@/data/categories";
import { cn } from "@/lib/utils";

interface ShopCategoriesNavProps {
  activeSlug?: string;
  isNew?: boolean;
}

const pillBase = "rounded-full border px-4 py-2 text-sm font-semibold transition";
const pillActive = "border-ink bg-ink text-white";
const pillIdle = "border-brand-200 bg-white text-ink/70 hover:border-gold hover:text-ink";

export function ShopCategoriesNav({ activeSlug, isNew = false }: ShopCategoriesNavProps) {
  const active = activeSlug ? getCategoryBySlug(activeSlug) : undefined;
  const activeTop = active?.parentSlug ?? active?.slug;
  const subcategories = activeTop ? childCategories(activeTop) : [];
  const parent = activeTop ? getCategoryBySlug(activeTop) : undefined;

  return (
    <nav aria-label="Product categories" className="mb-8 -mx-1 overflow-x-auto pb-1">
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
        {topLevelCategories().map((category) => (
          <Link
            key={category.slug}
            href={`/shop/${category.slug}/`}
            className={cn(pillBase, activeTop === category.slug ? pillActive : pillIdle)}
          >
            {category.name}
          </Link>
        ))}
      </div>
      {parent && subcategories.length > 0 ? (
        <div className="mt-2 flex min-w-max gap-2 px-1" aria-label={`${parent.name} sizes`}>
          <Link
            href={`/shop/${parent.slug}/`}
            className={cn(pillBase, activeSlug === parent.slug ? pillActive : pillIdle)}
          >
            All {parent.name}
          </Link>
          {subcategories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop/${category.slug}/`}
              className={cn(pillBase, activeSlug === category.slug ? pillActive : pillIdle)}
            >
              {category.name}
            </Link>
          ))}
        </div>
      ) : null}
    </nav>
  );
}
