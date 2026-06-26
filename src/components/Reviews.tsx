"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Star, PenLine, ChevronLeft, ChevronRight } from "lucide-react";
import type { Review } from "@/app/api/reviews/route";
import Reveal from "./Reveal";

const PAGE_SIZE = 3;
const AUTO_ADVANCE_MS = 5000;

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

function ReviewCard({ review }: { review: Review }) {
  return (
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
  );
}

interface ReviewsProps {
  carousel?: boolean;
}

export default function Reviews({ carousel = false }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewUrl, setReviewUrl] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const totalPages = Math.ceil(reviews.length / PAGE_SIZE);

  const next = useCallback(() => setPage((p) => (p + 1) % totalPages), [totalPages]);
  const prev = useCallback(() => setPage((p) => (p - 1 + totalPages) % totalPages), [totalPages]);

  // Auto-advance solo in modalità carousel con più di una pagina
  useEffect(() => {
    if (!carousel || totalPages <= 1) return;
    timerRef.current = setTimeout(next, AUTO_ADVANCE_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [carousel, page, totalPages, next]);

  if (!loaded || reviews.length === 0) return null;

  const useCarousel = carousel && reviews.length > PAGE_SIZE;
  const visibleReviews = useCarousel
    ? reviews.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
    : reviews;

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
          {useCarousel
            ? visibleReviews.map((review, i) => (
                <div
                  key={`${page}-${i}`}
                  className="animate-fade-in"
                >
                  <ReviewCard review={review} />
                </div>
              ))
            : reviews.map((review, i) => (
                <Reveal key={i} delay={i * 80}>
                  <ReviewCard review={review} />
                </Reveal>
              ))}
        </div>

        {/* Controlli carousel */}
        {useCarousel && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              aria-label="Recensioni precedenti"
              className="p-2 rounded-full bg-white border border-navy/10 hover:border-steel/40 hover:shadow-sm transition-all text-navy/60 hover:text-steel cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  aria-label={`Pagina ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    i === page ? "bg-steel w-4" : "bg-navy/20 hover:bg-navy/40"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Recensioni successive"
              className="p-2 rounded-full bg-white border border-navy/10 hover:border-steel/40 hover:shadow-sm transition-all text-navy/60 hover:text-steel cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
