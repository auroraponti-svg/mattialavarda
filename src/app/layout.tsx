import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollSpine from "@/components/ScrollSpine";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "Mattia Lavarda — Osteopata | Samarate (VA)",
  description:
    "Mattia Lavarda, Osteopata e Chinesiologo. Studio a Samarate (Varese): trattamenti osteopatici personalizzati per dolori, postura, sport e benessere.",
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
        <ScrollSpine />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
