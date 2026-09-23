import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import ProductCard from '../shop/ProductCard';
import { PRODUCT_GRID_SHOP_CLASS } from '../../utils/productLayout';

export default function SimilarProducts({ product, limit = 4 }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!product?.category_slug) return;
    let cancelled = false;
    api
      .getProducts({ category: product.category_slug, limit: limit + 4, sort: 'bestseller' })
      .then((res) => {
        if (cancelled) return;
        const list = (res.products || res.data || []).filter((p) => p.id !== product.id).slice(0, limit);
        setItems(list);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, [product?.id, product?.category_slug, limit]);

  if (!items.length) return null;

  return (
    <section className="mt-14 border-t border-sage/40 pt-10">
      <h2 className="font-heading text-xl font-semibold text-primary md:text-2xl">Similar products</h2>
      <p className="mt-1 text-sm text-muted">More from {product.category_name || 'this range'}</p>
      <div className={`${PRODUCT_GRID_SHOP_CLASS} mt-6`}>
        {items.map((p) => (
          <ProductCard key={p.id} product={p} className="h-full" />
        ))}
      </div>
    </section>
  );
}
