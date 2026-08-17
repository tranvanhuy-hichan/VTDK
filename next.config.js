/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep the development cache separate from production build artifacts.
  // Running `next build` while the dev server is open can otherwise leave the
  // dev manifest pointing at CSS chunks that no longer exist.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  reactStrictMode: true,
  experimental: {
    serverActions: {
      // Default is 1MB, too small for photos uploaded from a phone camera
      // (product/service/gallery/company image uploads go through a Server Action).
      bodySizeLimit: "20mb",
    },
  },
  images: {
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
};

export default nextConfig;
