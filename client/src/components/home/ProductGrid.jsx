import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import ProductCard, { ProductCardSkeleton } from '../shop/ProductCard';
import { filterFallbackProducts } from '../../data/fallbackProducts';
import { PRODUCT_GRID_CLASS } from '../../utils/productLayout';
import Reveal from '../ui/Reveal';

export default function ProductGrid({
  title = 'Best Seller',
  subtitle = 'Our most-loved freeze-dried fruits, rated by thousands of happy snackers',
  limit = 4,
  shopLink = '/shop',
  shopLinkLabel = 'View all',
  selectable = true,
}) {
  const [products, setProducts] = useState(() => filterFallbackProducts({ category: 'all', limit }));
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const toggleSelectProduct = useCallback((id) => {
    setSelectedProductId((current) => (current === id ? null : id));
  }, []);

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

  return (
    <section className="pb-16 md:pb-20">
      <div className="site-container">
        <Reveal variant="scale" className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-primary md:text-[2rem]">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 max-w-xl text-base text-muted">{subtitle}</p>
            )}
          </div>
          <Link
            to={shopLink}
            className="hidden shrink-0 text-sm font-medium text-muted transition hover:text-primary sm:inline-flex sm:items-center sm:gap-1"
          >
            {shopLinkLabel} <span aria-hidden="true">→</span>
          </Link>
        </Reveal>

        {loading ? (
          <div className={PRODUCT_GRID_CLASS}>
            {[...Array(limit)].map((_, i) => (
              <ProductCardSkeleton key={i} className="h-full" />
            ))}
          </div>
        ) : (
          <div className={PRODUCT_GRID_CLASS}>
            {products.slice(0, limit).map((p, i) => (
              <Reveal key={p.id} variant="up" delay={i * 85} className="h-full">
                <ProductCard
                  product={p}
                  className="h-full"
                  selected={selectable && selectedProductId === p.id}
                  onSelect={selectable ? toggleSelectProduct : undefined}
                />
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link to={shopLink} className="text-sm font-medium text-muted hover:text-primary">
            {shopLinkLabel} →
          </Link>
        </div>
      </div>
    </section>
  );
}
