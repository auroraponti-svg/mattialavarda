import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-navy text-white/80 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <Image src="/logo.png" alt="" width={32} height={36} className="h-8 w-auto" />
            <span className="text-white font-bold text-lg">{site.name}</span>
          </div>
          <p className="text-sm leading-relaxed">
            Osteopata e Chinesiologo a Samarate. Un approccio personalizzato e basato sull&apos;evidenza
            per il benessere del tuo corpo.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Pagine</h3>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/", label: "Home" },
              { href: "/chi-sono", label: "Chi Sono" },
              { href: "/blog", label: "Blog" },
              { href: "/contatti", label: "Contatti" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="hover:text-sky transition-colors duration-200 cursor-pointer">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Contatti</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="text-sky mt-0.5 shrink-0" aria-hidden="true" />
              <span>{site.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-sky shrink-0" aria-hidden="true" />
              <a href={`tel:${site.phoneHref}`} className="hover:text-sky transition-colors duration-200 cursor-pointer">
                {site.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-sky shrink-0" aria-hidden="true" />
              <a href={`mailto:${site.email}`} className="hover:text-sky transition-colors duration-200 cursor-pointer break-all">
                {site.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <InstagramIcon className="text-sky shrink-0" />
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-sky transition-colors duration-200 cursor-pointer">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 text-center text-xs text-white/40 py-4">
        &copy; {new Date().getFullYear()} {site.name} — Osteopata. Tutti i diritti riservati.
      </div>
    </footer>
  );
}
