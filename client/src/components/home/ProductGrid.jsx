import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import ProductCard, { ProductCardSkeleton } from '../shop/ProductCard';
import { filterFallbackProducts } from '../../data/fallbackProducts';
import { PRODUCT_GRID_CLASS } from '../../utils/productLayout';
import { isOutOfStock } from '../../utils/stockDisplay';
import Reveal from '../ui/Reveal';

function inStockBestsellers(list, max) {
  return (list || []).filter((p) => !isOutOfStock(p)).slice(0, max);
}

export default function ProductGrid({
  title = 'Best Seller',
  limit = 4,
  shopLink = '/shop',
  shopLinkLabel = 'View all',
  selectable = true,
}) {
  const [products, setProducts] = useState(() =>
    inStockBestsellers(filterFallbackProducts({ category: 'all', limit: limit * 2 }), limit)
  );
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const toggleSelectProduct = useCallback((id) => {
    setSelectedProductId((current) => (current === id ? null : id));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fallback = inStockBestsellers(
      filterFallbackProducts({ category: 'all', limit: limit * 2 }),
      limit
    );

    async function load() {
      setLoading(true);
      try {
        const res = await api.getBestsellers(limit);
        if (cancelled) return;
        const list = inStockBestsellers(res.data || res.products || [], limit);
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
    <section className="pb-12 pt-1 md:pb-20 md:pt-0">
      <div className="site-container">
        <Reveal variant="scale" className="mb-4 md:mb-8">
          <div className="flex items-start justify-between gap-3">
            <h2 className="min-w-0 flex-1 font-heading text-2xl font-semibold tracking-tight text-primary sm:text-3xl md:text-[2rem]">
              {title}
            </h2>
            <Link
              to={shopLink}
              className="inline-flex shrink-0 items-center gap-1 pt-1 text-sm font-medium text-muted underline underline-offset-2 decoration-muted/60 transition hover:text-primary hover:decoration-primary"
            >
              {shopLinkLabel} <span aria-hidden="true">→</span>
            </Link>
          </div>
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

      </div>
    </section>
  );
}
