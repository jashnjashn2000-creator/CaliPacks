import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = "E:\\Cali Packs";
const srcDir = path.join(root, "CaliPacks Photos");
const outShop = path.join(root, "public", "shop");
const outPacks = path.join(root, "public", "products");

fs.mkdirSync(outShop, { recursive: true });

const jobs = [
  { src: "Shop image.jpeg", dest: path.join(root, "public", "cali-smoke-storefront.webp"), width: 1400, cover: true },
  { src: "WhatsApp Image 2026-07-09 at 7.46.31 PM (1).jpeg", dest: path.join(outShop, "vacuum-sealer-rolls.webp"), width: 1200 },
  { src: "WhatsApp Image 2026-07-09 at 7.46.31 PM (2).jpeg", dest: path.join(outShop, "vacuum-sealer.webp"), width: 1200 },
  { src: "WhatsApp Image 2026-07-09 at 7.46.31 PM (3).jpeg", dest: path.join(outShop, "cartoon-travel-kit.webp"), width: 1200 },
  { src: "WhatsApp Image 2026-07-09 at 7.46.31 PM (4).jpeg", dest: path.join(outShop, "gold-honeycomb-grinder.webp"), width: 1200 },
  { src: "WhatsApp Image 2026-07-09 at 7.46.31 PM (5).jpeg", dest: path.join(outShop, "graphic-lighters.webp"), width: 1200 },
  { src: "WhatsApp Image 2026-07-14 at 6.44.54 PM.jpeg", dest: path.join(outShop, "onbalance-mz100.webp"), width: 1200 },
  { src: "WhatsApp Image 2026-07-14 at 6.44.55 PM.jpeg", dest: path.join(outShop, "triton-t3-scale.webp"), width: 1200 },
  { src: "WhatsApp Image 2026-07-14 at 6.44.58 PM.jpeg", dest: path.join(outShop, "colour-novelty-hookah.webp"), width: 1400 },
  { src: "WhatsApp Image 2026-07-14 at 6.45.00 PM.jpeg", dest: path.join(outShop, "glass-hookah.webp"), width: 1400 },
  { src: "WhatsApp Image 2026-07-14 at 6.45.00 PM (1).jpeg", dest: path.join(outShop, "chrome-novelty-hookah.webp"), width: 1200 },
  { src: "WhatsApp Image 2026-07-14 at 6.45.27 PM.jpeg", dest: path.join(outShop, "mini-glass-bubblers.webp"), width: 1400 },
  { src: "WhatsApp Image 2026-07-14 at 6.45.27 PM (1).jpeg", dest: path.join(outShop, "spiral-glass-bubblers.webp"), width: 1400 },
  { src: "WhatsApp Image 2026-07-14 at 6.45.27 PM (2).jpeg", dest: path.join(outShop, "swan-glass-pipe.webp"), width: 1200 },
  { src: "WhatsApp Image 2026-07-14 at 6.45.27 PM (4).jpeg", dest: path.join(outShop, "clipper-lighters.webp"), width: 1400 },
  { src: "WhatsApp Image 2026-07-14 at 6.45.28 PM.jpeg", dest: path.join(outShop, "character-ashtray.webp"), width: 1200 },
  { src: "WhatsApp Image 2026-07-14 at 6.45.28 PM (1).jpeg", dest: path.join(outShop, "teal-four-piece-grinder.webp"), width: 1200 },
  { src: "WhatsApp Image 2026-07-14 at 6.45.28 PM (2).jpeg", dest: path.join(outShop, "crystal-clover-grinders.webp"), width: 1200 },
  { src: "WhatsApp Image 2026-07-14 at 6.45.28 PM (3).jpeg", dest: path.join(outShop, "crystal-charm-grinders.webp"), width: 1200 },
  { src: "WhatsApp Image 2026-07-14 at 6.45.28 PM (4).jpeg", dest: path.join(outShop, "gummy-cluster-beaker.webp"), width: 1200 },
  { src: "WhatsApp Image 2026-07-14 at 6.45.28 PM (5).jpeg", dest: path.join(outPacks, "pack-109.webp"), width: 1200 },
  { src: "WhatsApp Image 2026-07-14 at 6.45.28 PM (6).jpeg", dest: path.join(outPacks, "pack-110.webp"), width: 1200 },
  { src: "WhatsApp Image 2026-07-14 at 6.45.28 PM (7).jpeg", dest: path.join(outPacks, "pack-111.webp"), width: 1200 },
  { src: "WhatsApp Image 2026-07-14 at 6.45.29 PM.jpeg", dest: path.join(outPacks, "pack-080.webp"), width: 1200 },
];

for (const job of jobs) {
  const input = path.join(srcDir, job.src);
  await sharp(input, { failOn: "none" })
    .rotate()
    .resize({
      width: job.width,
      height: job.cover ? Math.round(job.width * 0.72) : job.width,
      fit: job.cover ? "cover" : "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 78, effort: 6 })
    .toFile(job.dest);
  const kb = Math.round(fs.statSync(job.dest).size / 1024);
  console.log(`${path.basename(job.dest)} ${kb}KB`);
}
