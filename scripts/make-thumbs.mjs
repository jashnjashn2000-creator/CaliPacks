import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

// Small copies of product photos for the rotating hero tiles and the conveyor strip
// (shown at ~150–220px wide, so 480px covers 2x screens).
const root = path.resolve(import.meta.dirname, "..");
const sources = [
  { dir: "public/products", match: /^pack-\d+\.webp$/i },
  { dir: "public/shop", match: /\.webp$/i },
];

for (const { dir, match } of sources) {
  const srcDir = path.join(root, dir);
  const thumbDir = path.join(srcDir, "thumbs");
  fs.mkdirSync(thumbDir, { recursive: true });

  let before = 0;
  let after = 0;
  const files = fs.readdirSync(srcDir).filter((file) => match.test(file));
  for (const file of files) {
    const input = path.join(srcDir, file);
    const output = path.join(thumbDir, file);
    await sharp(input)
      .resize({ width: 480, withoutEnlargement: true })
      .webp({ quality: 72, effort: 6 })
      .toFile(output);
    before += fs.statSync(input).size;
    after += fs.statSync(output).size;
  }
  console.log(
    `${dir}: ${files.length} thumbs, ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`
  );
}
