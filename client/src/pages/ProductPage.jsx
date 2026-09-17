import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';
import { formatPrice, getBadgeClass, renderStars } from '../utils/helpers';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ProductVisual from '../components/ui/ProductVisual';
import { cn } from '../lib/cn';

export default function ProductPage() {
  const { slug } = useParams();
  const { addItem, loading: cartLoading } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getProduct(slug)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner />;
  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <BackToShopLink />
        <p className="mt-8">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="pb-16 pt-8 md:pt-10">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <BackToShopLink />

        <div className="mt-8 grid gap-12 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream-dark">
          <ProductVisual product={product} />
        </div>

        <div>
          {product.badge && (
            <span className={cn('mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase', getBadgeClass(product.badge))}>
              {product.badge}
            </span>
          )}

          <h1 className="font-heading text-3xl font-semibold text-primary">{product.name}</h1>

          {product.rating > 0 && (
            <div className="mt-3 flex items-center gap-2 text-sm text-[#6b6b6b]">
              <span className="text-mango">{renderStars(product.rating)}</span>
              <span>{product.rating} ({product.review_count} reviews)</span>
            </div>
          )}

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
            {product.compare_at_price && (
              <span className="text-lg text-[#9a9a9a] line-through">{formatPrice(product.compare_at_price)}</span>
            )}
            <span className="text-sm text-[#6b6b6b]">{product.weight_grams}g pack</span>
          </div>

          <p className="mt-5 leading-relaxed text-[#6b6b6b]">{product.short_description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {(product.tags || []).map((tag) => (
              <span key={tag} className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold text-secondary">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <div className="flex overflow-hidden rounded-lg border border-[#e8e4df]">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 text-lg text-primary hover:bg-cream" aria-label="Decrease">−</button>
              <span className="flex w-10 items-center justify-center font-semibold">{qty}</span>
              <button onClick={() => setQty(Math.min(99, qty + 1))} className="w-10 text-lg text-primary hover:bg-cream" aria-label="Increase">+</button>
            </div>
            <button
              onClick={() => addItem(product.id, qty)}
              disabled={cartLoading}
              className="flex-1 rounded-full bg-primary py-3 font-medium text-white transition hover:bg-primary-light disabled:opacity-60"
            >
              Add to Cart
            </button>
          </div>

          <div className="mt-6 space-y-1.5 text-sm text-[#6b6b6b]">
            <p>✓ In stock ({product.stock} available)</p>
            <p>✓ Free shipping above ₹999</p>
            <p>✓ Made in India</p>
          </div>
        </div>
        </div>
      </div>

      {product.reviews?.length > 0 && (
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6">
          <h2 className="mb-6 font-heading text-2xl text-primary">Customer Reviews</h2>
          <div className="flex flex-col gap-5">
            {product.reviews.map((r) => (
              <div key={r.id} className="rounded-xl bg-white p-5">
                <div className="text-sm text-mango">{renderStars(r.rating)}</div>
                <p className="my-2 italic">&ldquo;{r.comment}&rdquo;</p>
                <span className="text-xs text-[#6b6b6b]">— {r.user_name}{r.is_verified ? ' (Verified)' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BackToShopLink() {
  return (
    <Link
      to="/shop"
      className="inline-flex items-center gap-2 rounded-full border border-primary bg-cream px-6 py-2 text-sm font-normal text-primary transition hover:bg-cream-dark"
    >
      <span aria-hidden="true">←</span>
      Back to Shop
    </Link>
  );
}
