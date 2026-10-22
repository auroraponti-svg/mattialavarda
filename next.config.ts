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
  // sharp (conversione immagini) usa una libreria di sistema (libvips) che il
  // sistema di impacchettamento non include da solo: la aggiungiamo a mano alle
  // sole route che convertono immagini.
  outputFileTracingIncludes: {
    "/api/admin/media": ["./node_modules/@img/sharp-libvips-linux-x64/**/*", "./node_modules/@img/sharp-linux-x64/**/*"],
    "/api/admin/import": ["./node_modules/@img/sharp-libvips-linux-x64/**/*", "./node_modules/@img/sharp-linux-x64/**/*"],
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
