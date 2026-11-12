import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = "E:\\Cali Packs";
const srcDir = path.join(root, "CaliPacks Photos");
const outShop = path.join(root, "public", "shop");
const outPacks = path.join(root, "public", "products");
const SIZE = 1600;
const PAD = 0.08;

fs.mkdirSync(outShop, { recursive: true });

/** crop is [left, top, width, height] as fractions of the EXIF-oriented photo */
const jobs = [
  {
    src: "WhatsApp Image 2026-07-09 at 7.46.31 PM (1).jpeg",
    dest: path.join(outShop, "vacuum-sealer-rolls.webp"),
    crop: [0.18, 0.08, 0.80, 0.84],
  },
  {
    src: "WhatsApp Image 2026-07-09 at 7.46.31 PM (2).jpeg",
    dest: path.join(outShop, "vacuum-sealer.webp"),
    crop: [0.16, 0.02, 0.68, 0.70],
  },
  {
    src: "WhatsApp Image 2026-07-09 at 7.46.31 PM (3).jpeg",
    dest: path.join(outShop, "cartoon-travel-kit.webp"),
    crop: [0.12, 0.00, 0.68, 1.00],
  },
  {
    src: "WhatsApp Image 2026-07-09 at 7.46.31 PM (4).jpeg",
    dest: path.join(outShop, "gold-honeycomb-grinder.webp"),
    crop: [0.20, 0.00, 0.50, 1.00],
  },
  {
    src: "WhatsApp Image 2026-07-09 at 7.46.31 PM (5).jpeg",
    dest: path.join(outShop, "graphic-lighters.webp"),
    crop: [0.00, 0.05, 0.84, 0.90],
  },
  {
    src: "WhatsApp Image 2026-07-14 at 6.44.54 PM.jpeg",
    dest: path.join(outShop, "onbalance-mz100.webp"),
    crop: [0.04, 0.31, 0.92, 0.46],
  },
  {
    src: "WhatsApp Image 2026-07-14 at 6.44.55 PM.jpeg",
    dest: path.join(outShop, "triton-t3-scale.webp"),
    crop: [0.05, 0.28, 0.90, 0.44],
  },
  {
    src: "WhatsApp Image 2026-07-14 at 6.44.58 PM.jpeg",
    dest: path.join(outShop, "colour-novelty-hookah.webp"),
    crop: [0.02, 0.08, 0.92, 0.78],
  },
  {
    src: "WhatsApp Image 2026-07-14 at 6.45.00 PM.jpeg",
    dest: path.join(outShop, "glass-hookah.webp"),
    crop: [0.00, 0.08, 1.00, 0.56],
  },
  {
    src: "WhatsApp Image 2026-07-14 at 6.45.00 PM (1).jpeg",
    dest: path.join(outShop, "chrome-novelty-hookah.webp"),
    crop: [0.00, 0.06, 1.00, 0.80],
  },
  {
    src: "WhatsApp Image 2026-07-14 at 6.45.27 PM.jpeg",
    dest: path.join(outShop, "mini-glass-bubblers.webp"),
    crop: [0.00, 0.20, 1.00, 0.40],
  },
  {
    src: "WhatsApp Image 2026-07-14 at 6.45.27 PM (1).jpeg",
    dest: path.join(outShop, "spiral-glass-bubblers.webp"),
    crop: [0.00, 0.16, 1.00, 0.54],
  },
  {
    src: "WhatsApp Image 2026-07-14 at 6.45.27 PM (2).jpeg",
    dest: path.join(outShop, "swan-glass-pipe.webp"),
    crop: [0.18, 0.12, 0.64, 0.60],
  },
  {
    src: "WhatsApp Image 2026-07-14 at 6.45.27 PM (4).jpeg",
    dest: path.join(outShop, "clipper-lighters.webp"),
    crop: [0.00, 0.28, 1.00, 0.42],
  },
  {
    src: "WhatsApp Image 2026-07-14 at 6.45.28 PM.jpeg",
    dest: path.join(outShop, "character-ashtray.webp"),
    crop: [0.16, 0.05, 0.68, 0.80],
  },
  {
    src: "WhatsApp Image 2026-07-14 at 6.45.28 PM (1).jpeg",
    dest: path.join(outShop, "teal-four-piece-grinder.webp"),
    crop: [0.14, 0.34, 0.72, 0.28],
  },
  {
    src: "WhatsApp Image 2026-07-14 at 6.45.28 PM (2).jpeg",
    dest: path.join(outShop, "crystal-clover-grinders.webp"),
    crop: [0.00, 0.06, 0.74, 0.88],
  },
  {
    src: "WhatsApp Image 2026-07-14 at 6.45.28 PM (3).jpeg",
    dest: path.join(outShop, "crystal-charm-grinders.webp"),
    crop: [0.12, 0.06, 0.76, 0.74],
  },
  {
    src: "WhatsApp Image 2026-07-14 at 6.45.28 PM (4).jpeg",
    dest: path.join(outShop, "gummy-cluster-beaker.webp"),
    crop: [0.18, 0.02, 0.64, 0.90],
  },
  {
    src: "WhatsApp Image 2026-07-14 at 6.45.28 PM (5).jpeg",
    dest: path.join(outPacks, "pack-109.webp"),
    crop: [0.10, 0.28, 0.80, 0.56],
    turn: 180,
  },
  {
    src: "WhatsApp Image 2026-07-14 at 6.45.28 PM (6).jpeg",
    dest: path.join(outPacks, "pack-110.webp"),
    crop: [0.16, 0.26, 0.68, 0.54],
  },
  {
    src: "WhatsApp Image 2026-07-14 at 6.45.28 PM (7).jpeg",
    dest: path.join(outPacks, "pack-111.webp"),
    crop: [0.14, 0.16, 0.72, 0.70],
  },
  {
    src: "WhatsApp Image 2026-07-14 at 6.45.29 PM.jpeg",
    dest: path.join(outPacks, "pack-080.webp"),
    crop: [0.16, 0.22, 0.68, 0.56],
  },
];

function even(n) {
  return Math.max(2, n - (n % 2));
}

for (const job of jobs) {
  const input = path.join(srcDir, job.src);
  const { data, info } = await sharp(input, { failOn: "none" })
    .rotate()
    .toBuffer({ resolveWithObject: true });

  const [fx, fy, fw, fh] = job.crop;
  const left = Math.max(0, Math.round(info.width * fx));
  const top = Math.max(0, Math.round(info.height * fy));
  const width = even(Math.min(info.width - left, Math.round(info.width * fw)));
  const height = even(Math.min(info.height - top, Math.round(info.height * fh)));

  const inner = Math.round(SIZE * (1 - PAD * 2));
  const extracted = await sharp(data)
    .extract({ left, top, width, height })
    .toBuffer();

  let product = sharp(extracted);
  if (job.turn) product = product.rotate(job.turn);

  const fitted = await product
    .resize({
      width: inner,
      height: inner,
      fit: "inside",
      withoutEnlargement: false,
    })
    .toBuffer({ resolveWithObject: true });

  await sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 3,
      background: "#ffffff",
    },
  })
    .composite([{ input: fitted.data, gravity: "centre" }])
    .webp({ quality: 90, effort: 6 })
    .toFile(job.dest);

  const out = await sharp(job.dest).metadata();
  const kb = Math.round(fs.statSync(job.dest).size / 1024);
  console.log(`${path.basename(job.dest)} ${out.width}x${out.height} ${kb}KB (from ${info.width}x${info.height})`);
}
