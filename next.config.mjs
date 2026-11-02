/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  images: {
    // Static export (GitHub Pages) cannot run the Next image optimizer.
    // Assets are pre-compressed WebP; keep unoptimized and rely on thumbs + sizes.
    unoptimized: true,
    qualities: [70, 72, 75, 80, 82, 88],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
