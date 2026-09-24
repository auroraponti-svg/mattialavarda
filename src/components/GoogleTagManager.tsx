import Script from "next/script";
import { createPublicClient } from "@/lib/supabase/public";

export default async function GoogleTagManager() {
  // Il DB Supabase su piano free può andare in pausa: se la query fallisce
  // non deve far crashare il layout (e con esso ogni pagina del sito).
  let id: string | undefined;
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "gtm_container_id")
      .maybeSingle();
    id = data?.value?.trim();
  } catch {
    return null;
  }

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
