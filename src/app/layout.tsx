import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import GoogleTagManager from "@/components/GoogleTagManager";
import AnalyticsCode from "@/components/AnalyticsCode";
import IubendaConsent from "@/components/IubendaConsent";
import StructuredData from "@/components/StructuredData";
import { site } from "@/lib/site";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-figtree",
});

const siteTitle = "Mattia Lavarda — Osteopata | Samarate (VA)";
const siteDescription =
  "Mattia Lavarda, Osteopata e Chinesiologo. Studio a Samarate (Varese): trattamenti osteopatici personalizzati per dolori, postura, sport e benessere.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: siteTitle,
  description: siteDescription,
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: `${site.name} — Osteopata`,
    url: site.url,
    title: siteTitle,
    description: siteDescription,
    images: [
      { url: "/og-image.jpg", width: 1200, height: 630, alt: "Mattia Lavarda, osteopata a Samarate" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${figtree.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased bg-white text-navy">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <StructuredData />
        <Analytics />
        <GoogleTagManager />
        <AnalyticsCode />
        <IubendaConsent />
      </body>
    </html>
  );
}
