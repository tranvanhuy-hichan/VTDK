/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep the development cache separate from production build artifacts.
  // Running `next build` while the dev server is open can otherwise leave the
  // dev manifest pointing at CSS chunks that no longer exist.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  reactStrictMode: true,
  compress: true,
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
  experimental: {
    optimizePackageImports: ["lucide-react", "canvas-confetti"],
    serverActions: {
      // Default is 1MB, too small for photos uploaded from a phone camera
      // (product/service/gallery/company image uploads go through a Server Action).
      bodySizeLimit: "20mb",
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "vattudongkha.tranvanhuy.io.vn",
          },
        ],
        destination: "https://vattudongkha.io.vn/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
