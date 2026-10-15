import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "juhflgbtwbxjsxxkrcyi.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Rete di sicurezza: vecchi link a /prenota (es. articoli, bookmark esterni)
  // vengono reindirizzati alla pagina di prenotazione reale, evitando 404.
  async redirects() {
    return [
      { source: "/prenota", destination: "/contatti", permanent: true },
    ];
  },
};

export default nextConfig;
