import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.188"],
  images: {
    remotePatterns: [
      // Unsplash (placeholders de desenvolvimento)
      { protocol: "https", hostname: "images.unsplash.com" },
      // Mercado Livre CDN (imagens dos produtos)
      { protocol: "https", hostname: "http2.mlstatic.com" },
      { protocol: "https", hostname: "mlstatic.com" },
      // Supabase Storage
      { protocol: "https", hostname: "*.supabase.co" },
      // Qualquer URL externa (para flexibilidade com imagens de produtos)
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
