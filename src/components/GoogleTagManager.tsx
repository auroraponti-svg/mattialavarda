import Script from "next/script";
import { getSetting } from "@/lib/content";

export default async function GoogleTagManager() {
  // Se l'archivio non risponde getSetting ritorna vuoto: il sito non si rompe.
  const id = (await getSetting("gtm_container_id"))?.trim();

  if (!id) return null;

  return (
    <>
      {/* GTM script — head */}
      <Script id="gtm-head" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`}
      </Script>

      {/* GTM noscript — body fallback */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${id}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
}
