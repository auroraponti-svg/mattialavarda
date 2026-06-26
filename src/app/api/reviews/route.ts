import { NextResponse } from "next/server";

export interface Review {
  author: string;
  rating: number;
  text: string;
  date: string;
  source: "google" | "placeholder";
}

const PLACEHOLDERS: Review[] = [
  {
    author: "Catia",
    rating: 5,
    text: "Mattia mi ha aiutato a riprendermi dopo la rottura del tendine rotuleo e riprendere una vita normale, è un super professionista!",
    date: "2024-11-01",
    source: "placeholder",
  },
  {
    author: "Aurora",
    rating: 5,
    text: "Ho sempre sofferto di cervicale, Mattia riesce sempre a sbloccarmi e sistemarmi!",
    date: "2024-12-01",
    source: "placeholder",
  },
];

async function fetchGoogleReviews(): Promise<Review[]> {
  const accountId  = process.env.GMB_ACCOUNT_ID;
  const locationId = process.env.GMB_LOCATION_ID;
  const apiKey     = process.env.GMB_API_KEY;

  if (!accountId || !locationId || !apiKey) return [];

  const url =
    `https://mybusinessreviews.googleapis.com/v1/accounts/${accountId}/locations/${locationId}/reviews` +
    `?key=${apiKey}&pageSize=20`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];

  const data = await res.json();
  const reviews: Review[] = (data.reviews ?? [])
    .filter((r: Record<string, unknown>) => r.starRating && r.comment)
    .map((r: Record<string, unknown>) => {
      const stars: Record<string, number> = {
        ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5,
      };
      const reviewer = r.reviewer as Record<string, string> | undefined;
      const updateTime = r.updateTime as string | undefined;
      return {
        author: reviewer?.displayName ?? "Paziente",
        rating: stars[r.starRating as string] ?? 5,
        text: (r.comment as string) ?? "",
        date: updateTime ? updateTime.slice(0, 10) : "",
        source: "google",
      } satisfies Review;
    });

  return reviews;
}

export async function GET() {
  try {
    const google = await fetchGoogleReviews();
    const reviews = google.length > 0 ? google : PLACEHOLDERS;
    return NextResponse.json({ reviews, source: google.length > 0 ? "google" : "placeholder" });
  } catch {
    return NextResponse.json({ reviews: PLACEHOLDERS, source: "placeholder" });
  }
}
