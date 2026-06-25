import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#134E4A] text-white/80 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-3">OsteoGallarate</h3>
          <p className="text-sm leading-relaxed">
            Studio osteopatico professionale a Gallarate. Approccio personalizzato per il benessere del tuo corpo.
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
                <Link href={href} className="hover:text-[#22D3EE] transition-colors duration-200 cursor-pointer">
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
              <MapPin size={16} className="text-[#22D3EE] mt-0.5 shrink-0" aria-hidden="true" />
              <span>Via Roma 1, Gallarate (VA)</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-[#22D3EE] shrink-0" aria-hidden="true" />
              <a href="tel:+390000000000" className="hover:text-[#22D3EE] transition-colors duration-200 cursor-pointer">
                +39 000 000 0000
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-[#22D3EE] shrink-0" aria-hidden="true" />
              <a href="mailto:info@osteogallarate.it" className="hover:text-[#22D3EE] transition-colors duration-200 cursor-pointer">
                info@osteogallarate.it
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 text-center text-xs text-white/40 py-4">
        &copy; {new Date().getFullYear()} OsteoGallarate. Tutti i diritti riservati.
      </div>
    </footer>
  );
}
