import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/shop/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { CartIcon } from '../components/ui/CommerceIcons';
import { isAuthRequiredError } from '../utils/authErrors';
import { notifyError, notifySuccess } from '../utils/notify';
import { PRODUCT_GRID_SHOP_CLASS } from '../utils/productLayout';
import { isOutOfStock } from '../utils/stockDisplay';

export default function WishlistPage() {
  const { ids, count, clear, remove } = useWishlist();
  const { addItem, loading: cartLoading } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movingId, setMovingId] = useState(null);
  const [movingAll, setMovingAll] = useState(false);

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

  const handleMoveToCart = async (product) => {
    if (isOutOfStock(product)) return;
    const label = product.name.replace(/^Freeze Dried /i, '');
    setMovingId(product.id);
    try {
      await addItem(product.id, 1, {
        weightGrams: product.weight_grams,
        slug: product.slug,
      });
      remove(product.id);
      notifySuccess(`${label} moved to cart`);
    } catch (err) {
      if (!isAuthRequiredError(err)) {
        notifyError(err.message || 'Could not move to cart');
      }
    } finally {
      setMovingId(null);
    }
  };

  const handleMoveAll = async () => {
    const inStock = products.filter((p) => !isOutOfStock(p));
    if (!inStock.length) return;
    setMovingAll(true);
    try {
      let moved = 0;
      for (const product of inStock) {
        await addItem(product.id, 1, {
          weightGrams: product.weight_grams,
          slug: product.slug,
        });
        remove(product.id);
        moved += 1;
      }
      notifySuccess(moved ? `Moved ${moved} item(s) to cart` : 'Wishlist updated');
    } catch (err) {
      if (!isAuthRequiredError(err)) {
        notifyError(err.message || 'Could not move items to cart');
      }
    } finally {
      setMovingAll(false);
    }
  };

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

  const hasInStock = products.some((p) => !isOutOfStock(p));

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
          {hasInStock && (
            <button
              type="button"
              onClick={handleMoveAll}
              disabled={movingAll || cartLoading}
              className="neo-btn-ghost px-4 py-2 text-sm font-semibold disabled:opacity-50"
            >
              {movingAll ? 'Moving…' : 'Move all to cart'}
            </button>
          )}
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
        {products.map((product) => {
          const outOfStock = isOutOfStock(product);
          const moving = movingId === product.id;
          return (
            <div key={product.id} className="flex h-full flex-col gap-2">
              <ProductCard product={product} layout="grid" className="flex-1" />
              <button
                type="button"
                onClick={() => handleMoveToCart(product)}
                disabled={outOfStock || cartLoading || moving || movingAll}
                className="neo-btn inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CartIcon className="h-4 w-4 shrink-0" />
                {moving ? 'Moving…' : outOfStock ? 'Out of stock' : 'Move to cart'}
              </button>
            </div>
          );
        })}
      </div>

      {count > products.length && (
        <p className="mt-6 text-center text-sm text-muted">
          Some saved items are no longer available.
        </p>
      )}
    </div>
  );
}
