import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import StarRating from '../ui/StarRating';
import { shouldShowProductRatings } from '../../utils/helpers';
import Reveal from '../ui/Reveal';
import { cn } from '../../lib/cn';

const AVATAR_TONES = [
  'bg-secondary/15 text-secondary',
  'bg-mango/25 text-primary',
  'bg-strawberry/15 text-strawberry',
  'bg-primary/10 text-primary',
  'bg-success/15 text-success',
];

function useVisibleCount() {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const update = () => {
      if (window.matchMedia('(min-width: 1024px)').matches) setCount(3);
      else if (window.matchMedia('(min-width: 640px)').matches) setCount(2);
      else setCount(1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return count;
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [active, setActive] = useState(0);
  const visibleCount = useVisibleCount();

  useEffect(() => {
    api.getReviews(6).then((res) => setReviews(res.data || [])).catch(() => {});
  }, []);

  if (!reviews.length) return null;

  const visible = Array.from({ length: Math.min(visibleCount, reviews.length) }, (_, i) =>
    reviews[(active + i) % reviews.length]
  );

  const pageCount = Math.max(1, Math.ceil(reviews.length / visibleCount));
  const activePage = Math.floor(active / visibleCount) % pageCount;

  const goPrev = () =>
    setActive((i) => (i - visibleCount + reviews.length) % reviews.length);
  const goNext = () => setActive((i) => (i + visibleCount) % reviews.length);

  return (
    <section className="pb-2 md:pb-4">
      <div className="site-container">
        <Reveal variant="scale" className="mb-8 md:mb-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
                Testimonials
              </p>
              <h2 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                Our Happy Clients
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted md:text-base">
                Real stories from families who love our freeze-dried fruit
              </p>
            </div>
            <div className="flex w-full items-center justify-center gap-2 sm:ml-auto sm:w-auto">
              <button
                type="button"
                onClick={goPrev}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-sage/55 bg-white text-xl text-primary shadow-sm transition hover:border-secondary/40 hover:bg-cream"
                aria-label="Previous reviews"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={goNext}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-sage/55 bg-white text-xl text-primary shadow-sm transition hover:border-secondary/40 hover:bg-cream"
                aria-label="Next reviews"
              >
                ›
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal variant="up">
          <div
            className={cn(
              'grid gap-4 md:gap-5',
              visibleCount === 3 && 'lg:grid-cols-3',
              visibleCount === 2 && 'sm:grid-cols-2',
              visibleCount === 1 && 'grid-cols-1'
            )}
          >
            {visible.map((review, index) => (
              <ClientReviewCard
                key={`${review.id}-${active}-${index}`}
                review={review}
                toneClass={AVATAR_TONES[(active + index) % AVATAR_TONES.length]}
              />
            ))}
          </div>
        </Reveal>

        {pageCount > 1 && (
          <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Review pages">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === activePage}
                aria-label={`Reviews page ${i + 1}`}
                onClick={() => setActive((i * visibleCount) % reviews.length)}
                className={cn(
                  'h-2 rounded-full transition-all',
                  i === activePage ? 'w-6 bg-secondary' : 'w-2 bg-sage hover:bg-secondary/50'
                )}
              />
            ))}
          </div>
        )}

        <Reveal variant="scale" delay={100} className="mt-8 text-center">
          <p className="text-sm text-muted">
            Join families snacking smarter with Nature Pure Fresh —{' '}
            <Link
              to="/shop"
              className="font-semibold text-secondary underline-offset-2 hover:underline"
            >
              shop bestsellers
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ClientReviewCard({ review, toneClass }) {
  const initial = review.user_name?.charAt(0)?.toUpperCase() || 'N';

  return (
    <article
      className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-sage/45 bg-white p-6 shadow-[0_10px_32px_rgba(41,70,51,0.06)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(41,70,51,0.09)] md:p-7"
    >
      <span
        className="pointer-events-none absolute right-5 top-4 font-serif text-5xl leading-none text-secondary/15"
        aria-hidden
      >
        &ldquo;
      </span>

      {shouldShowProductRatings() ? <StarRating rating={review.rating} size="md" /> : null}

      <blockquote
        className={cn(
          'flex-1 text-[0.9375rem] leading-relaxed text-primary/88 md:text-base',
          shouldShowProductRatings() ? 'mt-4' : 'mt-0'
        )}
      >
        {review.comment}
      </blockquote>

      {review.product_name ? (
        <p className="mt-3 text-xs font-medium text-muted line-clamp-1">{review.product_name}</p>
      ) : null}

      <footer className="mt-5 flex items-center gap-3 border-t border-sage/35 pt-5">
        <span
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold',
            toneClass
          )}
        >
          {initial}
        </span>
        <div className="min-w-0">
          <strong className="block truncate text-sm font-semibold text-primary">{review.user_name}</strong>
          {review.is_verified ? (
            <span className="text-xs font-medium text-success">Verified buyer</span>
          ) : null}
        </div>
      </footer>
    </article>
  );
}
