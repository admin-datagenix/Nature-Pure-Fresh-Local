import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { renderStars } from '../../utils/helpers';
import Reveal from '../ui/Reveal';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.getReviews(6).then((res) => setReviews(res.data)).catch(() => {});
  }, []);

  if (!reviews.length) return null;

  return (
    <section className="pb-16 pt-4 md:pb-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[#6b6b6b]">Real reviews from verified buyers</p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.id} delay={i * 80}>
              <blockquote className="h-full rounded-xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="mb-3 text-sm tracking-tight text-mango">{renderStars(r.rating)}</div>
                <p className="mb-4 text-sm italic leading-relaxed text-[#3a3a3a]">&ldquo;{r.comment}&rdquo;</p>
                <footer className="text-xs text-[#6b6b6b]">
                  <strong className="text-primary">{r.user_name}</strong>
                  {r.is_verified && <span className="ml-1.5 font-medium text-success">Verified buyer</span>}
                  {r.product_name && <span className="mt-1 block text-[0.7rem]">· {r.product_name}</span>}
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
