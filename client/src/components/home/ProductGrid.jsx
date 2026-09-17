import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import ProductCard, { ProductCardSkeleton } from '../shop/ProductCard';
import { filterFallbackProducts } from '../../data/fallbackProducts';
import { PRODUCT_GRID_FEATURED_CLASS } from '../../utils/productLayout';
import Reveal from '../ui/Reveal';

export default function ProductGrid({
  title = 'Best Sellers',
  subtitle = 'Our most-loved freeze-dried fruits, rated by thousands of happy snackers',
  limit = 8,
  shopLink = '/shop',
  shopLinkLabel = 'View All Products',
}) {
  const scrollerRef = useRef(null);
  const [products, setProducts] = useState(() => filterFallbackProducts({ category: 'all', limit }));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fallback = filterFallbackProducts({ category: 'all', limit });

    async function load() {
      setLoading(true);
      try {
        const res = await api.getBestsellers(limit);
        if (cancelled) return;
        const list = (res.data || res.products || []).slice(0, limit);
        setProducts(list.length ? list : fallback);
      } catch {
        if (!cancelled) setProducts(fallback);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [limit]);

  const scrollByCard = (direction) => {
    scrollerRef.current?.scrollBy({ left: direction * 290, behavior: 'smooth' });
  };

  return (
    <section className="pb-16 md:pb-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal className="mb-6 flex items-end justify-between gap-4 md:mb-8">
          <div>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-primary md:text-[2rem]">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 max-w-xl text-sm text-[#6b6b6b]">{subtitle}</p>
            )}
          </div>
          <Link
            to={shopLink}
            className="hidden shrink-0 text-sm font-medium text-[#6b6b6b] transition hover:text-primary sm:inline-flex sm:items-center sm:gap-1"
          >
            {shopLinkLabel} <span aria-hidden="true">→</span>
          </Link>
        </Reveal>

        <div className="relative rounded-[2.25rem] bg-cream-dark px-6 py-7 sm:px-12 sm:py-9">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            className="absolute left-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-primary/10 bg-cream text-lg text-primary shadow-sm sm:flex"
            aria-label="Previous products"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            className="absolute right-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-primary/10 bg-cream text-lg text-primary shadow-sm sm:flex"
            aria-label="Next products"
          >
            ›
          </button>

          {loading ? (
            <div className={PRODUCT_GRID_FEATURED_CLASS}>
              {[...Array(limit)].map((_, i) => <ProductCardSkeleton key={i} compact />)}
            </div>
          ) : (
            <div ref={scrollerRef} className={PRODUCT_GRID_FEATURED_CLASS}>
              {products.slice(0, limit).map((p) => (
                <ProductCard key={p.id} product={p} compact />
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link to={shopLink} className="text-sm font-medium text-[#6b6b6b] hover:text-primary">
            {shopLinkLabel} →
          </Link>
        </div>
      </div>
    </section>
  );
}
