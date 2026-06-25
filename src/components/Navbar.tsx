"use client";

import Link from "next/link";
import Image from "next/image";
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
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-navy/10 shadow-sm">
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between"
        aria-label="Navigazione principale"
      >
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="Torna alla home">
          <Image src="/logo.png" alt="Logo Mattia Lavarda Osteopata" width={36} height={40} className="h-9 w-auto" priority />
          <span className="flex flex-col leading-none">
            <span className="text-navy font-bold text-base tracking-tight">Mattia Lavarda</span>
            <span className="text-steel text-[11px] font-medium tracking-wide">Osteopata · Chinesiologo</span>
          </span>
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  pathname === href
                    ? "text-steel border-b-2 border-steel pb-0.5"
                    : "text-navy hover:text-steel"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/contatti#prenotazione"
              className="press bg-steel text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-navy cursor-pointer"
            >
              Prenota
            </Link>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-md text-navy hover:text-steel transition-colors cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-navy/10 px-4 py-4 flex flex-col gap-4">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
                pathname === href ? "text-steel" : "text-navy hover:text-steel"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contatti#prenotazione"
            onClick={() => setOpen(false)}
            className="bg-steel text-white text-sm font-semibold px-4 py-2 rounded-lg text-center hover:bg-navy transition-colors duration-200 cursor-pointer"
          >
            Prenota
          </Link>
        </div>
      )}
    </header>
  );
}
