import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { site } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function TiktokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.83 1.55V6.79a4.85 4.85 0 0 1-1.06-.1z"/>
    </svg>
  );
}
function YoutubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  );
}

const socialConfig = [
  { key: "social_instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "social_facebook", label: "Facebook", Icon: FacebookIcon },
  { key: "social_linkedin", label: "LinkedIn", Icon: LinkedinIcon },
  { key: "social_tiktok", label: "TikTok", Icon: TiktokIcon },
  { key: "social_youtube", label: "YouTube", Icon: YoutubeIcon },
];

export default async function Footer() {
  const supabase = await createClient();
  const { data: settingsData } = await supabase.from("site_settings").select("key, value");
  const settings = Object.fromEntries(
    (settingsData ?? []).map((r: { key: string; value: string }) => [r.key, r.value])
  );

  const activeSocials = socialConfig.filter(({ key }) => settings[key]);

  return (
    <footer className="bg-navy text-white/80 mt-auto">
      <div className={`max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 ${activeSocials.length > 0 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>

        {/* Logo + descrizione */}
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

        {/* Pagine */}
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
                <Link href={href} className="link-underline hover:text-sky transition-colors duration-200 cursor-pointer">
                  {label}
                </Link>
              </li>
            ))}
            <li className="pt-1">
              <Link href="/admin" className="text-white/25 hover:text-white/60 transition-colors duration-300 cursor-pointer text-sm">
                Accesso admin
              </Link>
            </li>
          </ul>
        </div>

        {/* Contatti */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contatti</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="text-sky mt-0.5 shrink-0" aria-hidden="true" />
              <span>{site.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-sky shrink-0" aria-hidden="true" />
              <a href={`tel:${site.phoneHref}`} className="link-underline hover:text-sky transition-colors duration-200 cursor-pointer">
                {site.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-sky shrink-0" aria-hidden="true" />
              <a href={`mailto:${site.email}`} className="link-underline hover:text-sky transition-colors duration-200 cursor-pointer break-all">
                {site.email}
              </a>
            </li>
          </ul>
        </div>

        {/* Social — solo se almeno uno è configurato */}
        {activeSocials.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3">Seguimi sui social</h3>
            <ul className="space-y-2.5 text-sm">
              {activeSocials.map(({ key, label, Icon }) => (
                <li key={key}>
                  <a
                    href={settings[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 hover:text-sky transition-colors duration-200 cursor-pointer group"
                  >
                    <span className="text-sky group-hover:text-sky-soft transition-colors">
                      <Icon />
                    </span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 py-4 text-center">
        <p className="text-xs text-white/40">
          &copy; {new Date().getFullYear()} {site.name} — Osteopata. Tutti i diritti riservati.
        </p>
      </div>
    </footer>
  );
}
