/**
 * Build src/data/products.ts from named packs and a hero collage.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join("E:", "Cali Packs");
const names = JSON.parse(
  fs.readFileSync(path.join(ROOT, "scripts", "pack-names.json"), "utf8")
);

if (names.length !== 108) {
  console.error("Expected 108 packs, got", names.length);
  process.exit(1);
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const FEATURED = new Set([1, 3, 8, 11, 14, 27, 32, 46, 48, 50, 64, 75, 88, 96, 105, 108]);

const seenSlugs = new Set();
const products = names.map(([name, blurb], i) => {
  const n = i + 1;
  const pad = String(n).padStart(3, "0");
  let slug = slugify(name);
  if (seenSlugs.has(slug)) slug = `${slug}-${pad}`;
  seenSlugs.add(slug);
  const image = `/products/pack-${pad}.jpg`;
  const isFeatured = FEATURED.has(n);
  const isNew = n <= 24;

  return { n, name, blurb, slug, image, isFeatured, isNew, pad };
});

const WHOLESALE =
  "£0.22 per pack. Minimum order 25 pcs. Buy 50 or more of this design for £0.20 each. Smell-proof 3.5g Cali Pack with HD studio photography.";

const productBlocks = products
  .map((p) => {
    const description = p.blurb + ". " + WHOLESALE;
    const shortDescription = p.blurb + " — £0.22 each, minimum 25, or £0.20 each when you buy 50 or more.";
    return `  {
    id: "pack-${p.pad}",
    name: ${JSON.stringify(p.name)},
    slug: ${JSON.stringify(p.slug)},
    description: ${JSON.stringify(description)},
    shortDescription: ${JSON.stringify(shortDescription)},
    price: 0.22,
    categoryId: "cali-packs",
    categorySlug: "cali-packs",
    image: ${JSON.stringify(p.image)},
    images: [${JSON.stringify(p.image)}],
    tags: ["cali-packs", "mylar", "wholesale"],
    inStock: true,${p.isNew ? "\n    isNew: true," : ""}${p.isFeatured ? "\n    isFeatured: true," : ""}
    minOrder: 25,
    sku: "CP-${p.pad}",
  }`;
  })
  .join(",\n");

const ts = `import { Product } from "@/types";

export const products: Product[] = [
${productBlocks}
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function getNewArrivals(limit = 8): Product[] {
  return products.filter((p) => p.isNew).slice(0, limit);
}

export function getLatestCaliPacks(limit = 8): Product[] {
  return products.filter((p) => p.categorySlug === "cali-packs").slice(0, limit);
}

export function getLatestProducts(limit = 8): Product[] {
  return products.slice(0, limit);
}

export function getShopDisplayProducts(limit = 8): Product[] {
  const latestIds = new Set(getLatestCaliPacks(8).map((p) => p.id));
  return products.filter((p) => !latestIds.has(p.id)).slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q))
  );
}
`;

const out = path.join(ROOT, "src", "data", "products.ts");
fs.writeFileSync(out, ts);
console.log("Wrote", products.length, "products to", out);

async function makeHeroCollage() {
  let sharp;
  try {
    sharp = require("sharp");
  } catch {
    console.warn("sharp not installed — skip hero collage");
    return;
  }

  const picks = [3, 8, 11, 27, 46, 1, 48, 75, 14, 32, 50, 64];
  const W = 1920;
  const H = 980;
  const cell = 420;
  const cols = 4;
  const gap = 28;
  const startX = 720;
  const startY = 70;

  const composites = [];
  for (let i = 0; i < picks.length; i++) {
    const pad = String(picks[i]).padStart(3, "0");
    const src = path.join(ROOT, "public", "products", `pack-${pad}.jpg`);
    if (!fs.existsSync(src)) continue;
    const buf = await sharp(src)
      .resize(cell, cell, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toBuffer();
    const col = i % cols;
    const row = Math.floor(i / cols);
    composites.push({
      input: buf,
      left: Math.round(startX + col * (cell * 0.62 + gap) + (row % 2) * 36),
      top: Math.round(startY + row * (cell * 0.58 + gap)),
    });
  }

  await sharp({
    create: {
      width: W,
      height: H,
      channels: 3,
      background: { r: 18, g: 8, b: 22 },
    },
  })
    .composite(composites)
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(ROOT, "public", "hero-cali-packs.jpg"));

  console.log("Wrote public/hero-cali-packs.jpg");
}

makeHeroCollage().catch((err) => {
  console.warn("Hero collage failed:", err.message);
});
