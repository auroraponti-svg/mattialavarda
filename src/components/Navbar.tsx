"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/chi-sono", label: "Chi Sono" },
  { href: "/blog", label: "Blog" },
  { href: "/contatti", label: "Contatti" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#0891B2]/10 shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between" aria-label="Navigazione principale">
        <Link href="/" className="text-[#0891B2] font-bold text-lg tracking-tight hover:text-[#22D3EE] transition-colors duration-200">
          OsteoGallarate
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  pathname === href
                    ? "text-[#0891B2] border-b-2 border-[#0891B2] pb-0.5"
                    : "text-[#134E4A] hover:text-[#0891B2]"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/contatti"
              className="bg-[#22C55E] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#16a34a] transition-colors duration-200 cursor-pointer"
            >
              Prenota ora
            </Link>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-md text-[#134E4A] hover:text-[#0891B2] transition-colors cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-[#0891B2]/10 px-4 py-4 flex flex-col gap-4">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
                pathname === href ? "text-[#0891B2]" : "text-[#134E4A] hover:text-[#0891B2]"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contatti"
            onClick={() => setOpen(false)}
            className="bg-[#22C55E] text-white text-sm font-semibold px-4 py-2 rounded-lg text-center hover:bg-[#16a34a] transition-colors duration-200 cursor-pointer"
          >
            Prenota ora
          </Link>
        </div>
      )}
    </header>
  );
}
