import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import StarRating from '../ui/StarRating';
import Reveal from '../ui/Reveal';

const AVATAR_COLORS = ['bg-mango/80', 'bg-strawberry/70', 'bg-secondary/70', 'bg-primary/60'];
const VISIBLE_COUNT = 2;

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    api.getReviews(6).then((res) => setReviews(res.data || [])).catch(() => {});
  }, []);

  if (!reviews.length) return null;

  const visible = Array.from({ length: Math.min(VISIBLE_COUNT, reviews.length) }, (_, i) =>
    reviews[(active + i) % reviews.length]
  );

  const step = reviews.length >= VISIBLE_COUNT ? VISIBLE_COUNT : 1;
  const goPrev = () => setActive((i) => (i - step + reviews.length) % reviews.length);
  const goNext = () => setActive((i) => (i + step) % reviews.length);

  return (
    <section className="pb-16 md:pb-20">
      <div className="site-container">
        <Reveal variant="scale" className="mb-6 md:mb-8">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
            <div className="min-w-0 text-center sm:text-left">
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                Our Happy Clients
              </h2>
              <p className="mt-1 max-w-lg text-base text-muted sm:mt-2">
                Real stories from families who love our freeze-dried fruit
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={goPrev}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-sage/60 bg-white text-lg text-primary shadow-sm transition hover:bg-cream"
                aria-label="Previous client reviews"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={goNext}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-sage/60 bg-white text-lg text-primary shadow-sm transition hover:bg-cream"
                aria-label="Next client reviews"
              >
                ›
              </button>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <Reveal variant="left">
            <div className="flex flex-col gap-4">
              {visible.map((review) => (
                <ClientReviewCard key={`${review.id}-${active}`} review={review} />
              ))}
            </div>
          </Reveal>

          <Reveal variant="right" delay={120}>
            <article className="flex h-full min-h-full flex-col rounded-[1.75rem] bg-primary p-7 text-white transition duration-500 hover:shadow-[0_20px_48px_rgba(41,70,51,0.2)] md:p-9">
              <div className="mb-3">
                <StarRating rating={4.5} size="md" />
              </div>
              <p className="font-heading text-2xl font-semibold leading-snug md:text-[1.65rem]">
                More than 50K+
                <span className="block text-white/85">Satisfied Customers</span>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/75">
                Trusted across India for premium freeze-dried fruit snacks and powders — real fruit, zero preservatives.
              </p>

              <div className="mt-auto pt-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">
                  Loved by families nationwide
                </p>
                <div className="flex -space-x-2">
                  {AVATAR_COLORS.map((color, i) => (
                    <span
                      key={i}
                      className={`flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-primary ${color} text-xs font-bold text-white`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        </div>

        <Reveal variant="scale" delay={180} className="mt-5">
          <div className="rounded-2xl border border-sage/50 bg-cream-dark/50 px-6 py-4 text-center text-sm text-muted">
            Join thousands who snack smarter with NaturePure Fresh — shop bestsellers or explore fruit powders today.
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ClientReviewCard({ review }) {
  return (
    <article className="neo-card flex flex-col rounded-[1.75rem] p-6 md:p-7">
      <div className="mb-3">
        <StarRating rating={review.rating} size="md" />
      </div>

      <blockquote className="flex-1 text-base italic leading-relaxed text-primary/85">
        &ldquo;{review.comment}&rdquo;
      </blockquote>

      <footer className="mt-5 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-sm font-bold text-secondary">
          {review.user_name?.charAt(0) || 'N'}
        </span>
        <div>
          <strong className="block text-sm text-primary">{review.user_name}</strong>
          {review.is_verified && (
            <span className="text-xs text-success">Verified buyer</span>
          )}
        </div>
      </footer>
    </article>
  );
}
