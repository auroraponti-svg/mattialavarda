// Le uniche impostazioni che il sito conosce. Il pannello può salvare solo queste;
// l'importazione dal vecchio sistema copia solo queste (le altre sono obsolete).
export const SETTING_KEYS = [
  "gtm_container_id", "analytics_code", "looker_studio_url",
  "booking_duration", "booking_buffer", "booking_start", "booking_end",
  "booking_days", "booking_lead_hours", "booking_emails", "booking_calendar_id",
  "iubenda_privacy_embed", "iubenda_cookie_embed", "iubenda_cs_embed",
  "social_instagram", "social_facebook", "social_linkedin", "social_tiktok", "social_youtube",
  "google_review_url",
] as const;

export const ALLOWED_SETTING_KEYS = new Set<string>(SETTING_KEYS);
