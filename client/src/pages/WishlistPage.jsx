import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/shop/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { PRODUCT_GRID_SHOP_CLASS } from '../utils/productLayout';

export default function WishlistPage() {
  const { ids, count, clear } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!ids.length) {
      setProducts([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    api
      .getProducts({ limit: 200 })
      .then((res) => {
        if (cancelled) return;
        const list = res.data || res.products || [];
        const order = new Map(ids.map((id, i) => [id, i]));
        const matched = list
          .filter((p) => order.has(p.id))
          .sort((a, b) => order.get(a.id) - order.get(b.id));
        setProducts(matched);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ids]);

  if (loading && count > 0) return <LoadingSpinner />;

  if (count === 0) {
    return (
      <div className="site-container py-16 text-center">
        <h1 className="font-heading text-3xl font-semibold text-primary">My Wishlist</h1>
        <p className="mt-3 text-muted">Save products you love — tap the heart on any item.</p>
        <Link
          to="/shop"
          className="neo-btn mt-8 inline-flex rounded-full px-8 py-3.5 text-base font-semibold"
        >
          Browse shop
        </Link>
      </div>
    );
  }

  return (
    <div className="site-container pb-16 pt-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-primary">My Wishlist</h1>
          <p className="mt-1 text-sm text-muted">
            {count} item{count === 1 ? '' : 's'} saved
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={clear}
            className="text-sm font-semibold text-muted underline-offset-2 hover:text-primary hover:underline"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className={PRODUCT_GRID_SHOP_CLASS}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} layout="grid" />
        ))}
      </div>

      {count > products.length && (
        <p className="mt-6 text-center text-sm text-muted">
          Some saved items are no longer available.
        </p>
      )}
    </div>
  );
}
