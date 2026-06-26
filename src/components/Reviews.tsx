"use client";

import { useEffect, useState } from "react";
import { Star, PenLine } from "lucide-react";
import type { Review } from "@/app/api/reviews/route";
import Reveal from "./Reveal";

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} su 5 stelle`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-navy/20 fill-navy/20"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewUrl, setReviewUrl] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then(({ reviews, reviewUrl }) => {
        setReviews(reviews);
        setReviewUrl(reviewUrl ?? null);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded || reviews.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6 bg-mist">
      <div className="max-w-5xl mx-auto">
        <Reveal delay={0}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-2">Cosa dicono i pazienti</h2>
            <p className="text-navy/60 text-sm">Recensioni verificate su Google</p>
          </div>
        </Reveal>

        {reviewUrl && (
          <Reveal delay={60}>
            <div className="flex justify-center mb-10">
              <a
                href={reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="press inline-flex items-center gap-2 bg-steel text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy transition-colors shadow-sm text-sm"
              >
                <PenLine size={16} aria-hidden="true" />
                Scrivi una recensione
              </a>
            </div>
          </Reveal>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-navy/10 flex flex-col gap-3 h-full">
                <StarRow rating={review.rating} />
                <p className="text-navy/80 text-sm leading-relaxed flex-1">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-semibold text-navy text-sm">{review.author}</span>
                  {review.date && (
                    <span className="text-navy/40 text-xs">
                      {new Date(review.date).toLocaleDateString("it-IT", { month: "long", year: "numeric" })}
                    </span>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
