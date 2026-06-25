export type AnalyticsData = {
  pageviews: number;
  visitors: number;
  topPages: { path: string; count: number }[];
  error?: string;
};

export async function fetchVercelAnalytics(token: string, projectId: string): Promise<AnalyticsData> {
  if (!token || !projectId) return { pageviews: 0, visitors: 0, topPages: [], error: "Token non configurato" };
  try {
    const end = Date.now();
    const start = end - 30 * 24 * 60 * 60 * 1000; // last 30 days

    const [tsRes, pagesRes] = await Promise.all([
      fetch(`https://vercel.com/api/web-analytics/timeseries?projectId=${projectId}&from=${start}&to=${end}&granularity=day`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 3600 },
      }),
      fetch(`https://vercel.com/api/web-analytics/breakdown?projectId=${projectId}&from=${start}&to=${end}&dimension=url&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 3600 },
      }),
    ]);

    if (!tsRes.ok) return { pageviews: 0, visitors: 0, topPages: [], error: "Token non valido o progetto non trovato" };

    const tsData = await tsRes.json();
    const pagesData = pagesRes.ok ? await pagesRes.json() : { data: [] };

    const pageviews = tsData.data?.reduce((s: number, d: { pageviews?: number }) => s + (d.pageviews ?? 0), 0) ?? 0;
    const visitors = tsData.data?.reduce((s: number, d: { visitors?: number }) => s + (d.visitors ?? 0), 0) ?? 0;
    const topPages = (pagesData.data ?? []).map((d: { key: string; pageviews?: number; total?: number }) => ({
      path: d.key,
      count: d.pageviews ?? d.total ?? 0,
    }));

    return { pageviews, visitors, topPages };
  } catch {
    return { pageviews: 0, visitors: 0, topPages: [], error: "Errore di connessione" };
  }
}

export type BookingsData = {
  upcoming: { title: string; start: string; attendee: string }[];
  total: number;
  error?: string;
};

export async function fetchCalBookings(apiKey: string): Promise<BookingsData> {
  if (!apiKey) return { upcoming: [], total: 0, error: "Chiave API non configurata" };
  try {
    const res = await fetch(`https://api.cal.com/v1/bookings?apiKey=${apiKey}&status=upcoming&take=5`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return { upcoming: [], total: 0, error: "Chiave API non valida" };
    const json = await res.json();
    const bookings = json.bookings ?? [];
    return {
      total: bookings.length,
      upcoming: bookings.map((b: { title?: string; startTime?: string; attendees?: { name: string }[] }) => ({
        title: b.title ?? "Appuntamento",
        start: b.startTime ?? "",
        attendee: b.attendees?.[0]?.name ?? "",
      })),
    };
  } catch {
    return { upcoming: [], total: 0, error: "Errore di connessione" };
  }
}
