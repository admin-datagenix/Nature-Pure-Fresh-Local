import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';
import { formatPrice, getBadgeClass } from '../utils/helpers';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ProductVisual from '../components/ui/ProductVisual';
import StarRating from '../components/ui/StarRating';
import SimilarProducts from '../components/product/SimilarProducts';
import ProductReturnPolicy from '../components/product/ProductReturnPolicy';
import { cn } from '../lib/cn';
import ProductWeightPicker from '../components/product/ProductWeightPicker';
import { findWeightOption, getProductWeightOptions } from '../utils/productVariants';

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, loading: cartLoading } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [selectedGrams, setSelectedGrams] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareNote, setShareNote] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setQty(1);
    api
      .getProduct(slug)
      .then((res) => {
        setProduct(res.data);
        const opts = res.data.weight_options || getProductWeightOptions(res.data);
        setSelectedGrams(opts[0]?.grams ?? res.data.weight_grams ?? 50);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text: product.short_description, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareNote('Link copied');
      setTimeout(() => setShareNote(null), 2500);
    } catch {
      /* user cancelled share */
    }
  };

  const weightOptions = product?.weight_options || getProductWeightOptions(product);
  const selectedOption =
    findWeightOption(product, selectedGrams) || weightOptions[0] || null;

  const handleAddToCart = () => {
    if (!selectedOption) return;
    addItem(product.id, qty, { weightGrams: selectedOption.grams });
  };

  const handleBuyNow = async () => {
    if (!selectedOption) return;
    await addItem(product.id, qty, { weightGrams: selectedOption.grams });
    navigate('/checkout', { state: { checkoutProductIds: [product.id] } });
  };

  if (loading) return <LoadingSpinner />;
  if (!product) {
    return (
      <div className="site-container py-20">
        <BackToShopLink />
        <p className="mt-8">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="pb-16 pt-8 md:pt-10">
      <div className="site-container">
        <BackToShopLink />

        <div className="mt-8 grid gap-12 md:grid-cols-2 md:gap-16">
          <div className="rounded-[1.75rem] bg-white p-2.5 shadow-[0_12px_32px_rgba(41,70,51,0.07)]">
            <div className="relative aspect-square overflow-hidden rounded-[1.35rem] border border-sage/60">
              <ProductVisual product={product} hoverZoom />
            </div>
          </div>

          <div>
            {product.badge && (
              <span className={cn('mb-3 inline-block px-3 py-1 text-xs font-bold uppercase', getBadgeClass(product.badge))}>
                {product.badge}
              </span>
            )}

            <h1 className="font-heading text-3xl font-semibold text-primary">{product.name}</h1>

            {product.rating > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
                <StarRating rating={product.rating} total={5} size="md" />
                <span className="font-medium text-primary">{product.rating}</span>
                <span>({product.review_count} ratings)</span>
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(selectedOption?.price ?? product.price)}
              </span>
              {(selectedOption?.compare_at_price ?? product.compare_at_price) && (
                <span className="text-lg text-muted line-through">
                  {formatPrice(selectedOption?.compare_at_price ?? product.compare_at_price)}
                </span>
              )}
              {selectedOption && (
                <span className="text-sm text-muted">{selectedOption.grams}g pack</span>
              )}
            </div>

            <p className="mt-5 leading-relaxed text-muted">{product.short_description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {(product.tags || []).map((tag) => (
                <span key={tag} className="label-chip bg-secondary/15 px-2.5 py-0.5 text-xs font-semibold text-secondary">
                  {tag}
                </span>
              ))}
            </div>

            <ProductWeightPicker
              options={weightOptions}
              value={selectedGrams}
              onChange={setSelectedGrams}
            />

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-primary">Quantity</span>
              <div className="neo-qty">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 text-lg text-primary hover:bg-cream"
                  aria-label="Decrease"
                >
                  −
                </button>
                <span className="flex w-10 items-center justify-center font-semibold">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(Math.min(99, qty + 1))}
                  className="w-10 text-lg text-primary hover:bg-cream"
                  aria-label="Increase"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={cartLoading || !selectedOption}
                className="neo-btn flex-1 px-6 py-3 text-base font-semibold disabled:opacity-60"
              >
                Add to Cart
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={cartLoading || !selectedOption}
                className="neo-btn-ghost flex-1 px-6 py-3 text-base font-semibold disabled:opacity-60"
              >
                Buy Now
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleShare}
                className="label-chip inline-flex items-center gap-2 border border-sage/60 px-4 py-2 text-sm font-medium text-primary transition hover:bg-cream-dark"
              >
                <ShareIcon className="h-4 w-4" />
                Share
              </button>
              {shareNote && <span className="text-xs text-secondary">{shareNote}</span>}
            </div>

            <div className="mt-6 space-y-1.5 text-sm text-muted">
              <p>✓ In stock ({product.stock} available)</p>
              <p>✓ Free shipping above ₹999</p>
              <p>✓ Made in India · Easy returns</p>
            </div>
          </div>
        </div>

        {product.description && (
          <div className="mt-14 border-t border-sage/40 pt-10 md:mt-16">
            <h2 className="font-heading text-2xl font-semibold text-primary">Product Description</h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted">{product.description}</p>
          </div>
        )}

        <ProductReturnPolicy />
        <SimilarProducts product={product} limit={4} />
      </div>

      {product.reviews?.length > 0 && (
        <div className="site-container py-16">
          <h2 className="mb-6 font-heading text-2xl text-primary">Customer Reviews</h2>
          <div className="flex flex-col gap-5">
            {product.reviews.map((r) => (
              <div key={r.id} className="neo-card p-5">
                <StarRating rating={r.rating} total={5} size="md" />
                <p className="my-2 italic">&ldquo;{r.comment}&rdquo;</p>
                <span className="text-xs text-muted">
                  — {r.user_name}
                  {r.is_verified ? ' (Verified)' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ShareIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12v8a1 1 0 001 1h14a1 1 0 001-1v-8M16 6l-4-4-4 4M12 2v14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BackToShopLink() {
  return (
    <Link
      to="/shop"
      className="inline-flex items-center gap-2 rounded-sm border border-primary bg-cream px-6 py-2 text-sm font-normal text-primary transition hover:bg-cream-dark"
    >
      <span aria-hidden="true">←</span>
      Back to Shop
    </Link>
  );
}
