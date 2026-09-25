import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';
import { formatPrice, getBadgeClass, PRODUCT_BADGE_CHIP } from '../utils/helpers';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ProductVisual from '../components/ui/ProductVisual';
import StarRating from '../components/ui/StarRating';
import SimilarProducts from '../components/product/SimilarProducts';
import ProductReturnPolicy from '../components/product/ProductReturnPolicy';
import { cn } from '../lib/cn';
import ProductWeightPicker from '../components/product/ProductWeightPicker';
import { findWeightOption, getProductWeightOptions } from '../utils/productVariants';
import { notifySuccess } from '../utils/notify';
import { BuyNowIcon, CartIcon } from '../components/ui/CommerceIcons';

const BTN_PRIMARY =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(41,70,51,0.18)] transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-55';

const BTN_OUTLINE =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-primary bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-cream-dark disabled:cursor-not-allowed disabled:opacity-55';

const BTN_ICON =
  'inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-sage/70 bg-white text-primary transition hover:border-primary/50 hover:bg-cream-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, loading: cartLoading } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [selectedGrams, setSelectedGrams] = useState(null);
  const [loading, setLoading] = useState(true);

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
      notifySuccess('Product link copied');
    } catch (err) {
      if (err?.name === 'AbortError') return;
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
      <div className="site-container py-12">
        <BackToShopLink />
        <p className="mt-6 text-sm text-muted">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="pb-12 pt-4 md:pt-5">
      <div className="site-container">
        <div className="flex items-center justify-between gap-3">
          <BackToShopLink />
          <button
            type="button"
            onClick={handleShare}
            className={cn(BTN_ICON, 'md:hidden')}
            aria-label="Share product"
          >
            <ShareIcon className="h-[1.125rem] w-[1.125rem]" />
          </button>
        </div>

        <div className="product-detail-hero mt-4 grid w-full grid-cols-1 items-start gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-5 xl:gap-x-8">
          <div className="product-detail-gallery lg:sticky lg:top-[5.25rem]">
            <div className="product-detail-gallery__frame">
              <div className="product-detail-gallery__canvas">
                <ProductVisual product={product} hoverZoom compactMedia />
              </div>
            </div>
          </div>

          <div className="product-detail-info flex flex-col items-start">
            {product.badge && (
              <span className={cn('mb-1', PRODUCT_BADGE_CHIP, getBadgeClass(product.badge))}>
                {product.badge}
              </span>
            )}

            <h1 className="font-heading font-semibold text-primary">{product.name}</h1>

            {product.rating > 0 && (
              <div className="product-detail-section flex flex-wrap items-center gap-2 text-[0.75rem] text-muted">
                <StarRating rating={product.rating} total={5} size="sm" />
                <span className="font-medium text-primary">{product.rating}</span>
                <span>({product.review_count})</span>
              </div>
            )}

            <div className="product-detail-section flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="product-detail-price font-bold text-primary">
                {formatPrice(selectedOption?.price ?? product.price)}
              </span>
              {(selectedOption?.compare_at_price ?? product.compare_at_price) && (
                <span className="text-sm text-muted line-through">
                  {formatPrice(selectedOption?.compare_at_price ?? product.compare_at_price)}
                </span>
              )}
              {selectedOption && (
                <span className="text-[0.75rem] text-muted">{selectedOption.grams}g</span>
              )}
            </div>

            <p className="product-detail-section w-full leading-[1.7] text-muted">
              {product.short_description}
            </p>

            {(product.tags || []).length > 0 && (
              <div className="product-detail-section flex flex-wrap gap-1.5">
                {(product.tags || []).slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="label-chip bg-secondary/12 px-2 py-0.5 text-[0.65rem] font-semibold text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <ProductWeightPicker
              options={weightOptions}
              value={selectedGrams}
              onChange={setSelectedGrams}
              className="product-detail-section !mt-0"
            />

            <div className="product-detail-section flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:max-w-none">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary sm:sr-only">
                  Qty
                </span>
                <div className="neo-qty !rounded-md">
                  <button
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-9 text-base text-primary hover:bg-cream"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="flex w-9 items-center justify-center text-sm font-semibold">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(Math.min(99, qty + 1))}
                    className="w-9 text-base text-primary hover:bg-cream"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={cartLoading || !selectedOption}
                  className={BTN_PRIMARY}
                >
                  <CartIcon className="h-4 w-4 shrink-0" />
                  <span>Add to cart</span>
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={cartLoading || !selectedOption}
                  className={BTN_OUTLINE}
                >
                  <BuyNowIcon className="h-4 w-4 shrink-0" />
                  <span>Buy now</span>
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className={cn(BTN_ICON, 'hidden md:inline-flex')}
                  aria-label="Share product"
                  title="Share"
                >
                  <ShareIcon className="h-[1.125rem] w-[1.125rem]" />
                </button>
              </div>
            </div>

            <ul className="product-detail-section flex w-full flex-wrap gap-x-4 gap-y-2 text-[0.6875rem] leading-relaxed text-muted">
              <li>In stock · {product.stock} left</li>
              <li>Free shipping over ₹999</li>
              <li>Made in India</li>
            </ul>
          </div>
        </div>

        {product.description && (
          <div className="mt-10 border-t border-sage/40 pt-8">
            <h2 className="font-heading text-xl font-semibold text-primary">Product description</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{product.description}</p>
          </div>
        )}

        <ProductReturnPolicy />
        <SimilarProducts product={product} limit={4} />
      </div>

      {product.reviews?.length > 0 && (
        <div className="site-container py-12">
          <h2 className="mb-5 font-heading text-xl text-primary">Customer reviews</h2>
          <div className="flex flex-col gap-4">
            {product.reviews.map((r) => (
              <div key={r.id} className="rounded-md border border-sage/50 bg-white p-4">
                <StarRating rating={r.rating} total={5} size="sm" />
                <p className="my-2 text-sm italic">&ldquo;{r.comment}&rdquo;</p>
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
      <circle cx="18" cy="5" r="2.25" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="6" cy="12" r="2.25" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="18" cy="19" r="2.25" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M8.1 11.1l7.8-4.5M8.1 12.9l7.8 4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BackToShopLink() {
  return (
    <Link
      to="/shop"
      className="inline-flex items-center gap-1 rounded-sm border border-sage/70 bg-white px-2.5 py-1 text-xs font-medium text-primary transition hover:border-primary/40 hover:bg-cream-dark"
    >
      <span className="text-[0.7rem] leading-none" aria-hidden="true">
        ←
      </span>
      Back to shop
    </Link>
  );
}
