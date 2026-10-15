import { site } from "@/lib/site";

// Dati strutturati Schema.org (JSON-LD) per il SEO locale.
// Aiutano Google a capire che si tratta di uno studio di osteopatia a Samarate
// e possono generare risultati arricchiti (nome, telefono, zona servita).
// NB: indichiamo solo città/CAP/provincia, non l'indirizzo esatto dello studio
// (coerente con la scelta di non mostrarlo pubblicamente).
export default function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness"],
    "@id": `${site.url}/#business`,
    name: `${site.name} — Osteopata`,
    description:
      "Studio di osteopatia di Mattia Lavarda a Samarate (Varese). Trattamenti osteopatici personalizzati per dolori, postura, sport e benessere.",
    url: site.url,
    image: `${site.url}/og-image.jpg`,
    logo: `${site.url}/logo.png`,
    telephone: site.phone,
    email: site.email,
    priceRange: "€€",
    vatID: site.vat,
    medicalSpecialty: "PhysicalTherapy",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Samarate",
      addressRegion: "VA",
      postalCode: "21017",
      addressCountry: "IT",
    },
    areaServed: ["Samarate", "Gallarate", "Cardano al Campo", "Varese"],
    founder: {
      "@type": "Person",
      name: site.name,
      jobTitle: "Osteopata e Chinesiologo",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
