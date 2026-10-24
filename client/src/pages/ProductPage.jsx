import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SimilarProducts from '../components/product/SimilarProducts';
import ProductDescriptionBlock from '../components/product/ProductDescriptionBlock';
import ProductWeightPicker from '../components/product/ProductWeightPicker';
import ProductDetailGallery from '../components/product/detail/ProductDetailGallery';
import ProductDetailMobileHeader from '../components/product/detail/ProductDetailMobileHeader';
import ProductInfoSection from '../components/product/detail/ProductInfoSection';
import QuantitySelector from '../components/product/detail/QuantitySelector';
import { findWeightOption, getProductWeightOptions } from '../utils/productVariants';
import { notifySuccess } from '../utils/notify';
import { useAuthGate } from '../hooks/useAuthGate';
import { CartIcon } from '../components/ui/CommerceIcons';
import ComingSoonButton from '../components/product/ComingSoonButton';
import WishlistButton from '../components/wishlist/WishlistButton';
import { getProductImage } from '../data/productImages';
import { buildFlyPayload } from '../utils/flyToCart';
import { cn } from '../lib/cn';
const BTN_PRIMARY =
  'neo-btn inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55';

const BTN_OUTLINE =
  'neo-btn-ghost inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55';

const BTN_ICON =
  'inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-sage/70 bg-white text-primary transition hover:border-primary/50 hover:bg-cream-dark active:scale-95';

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { requireAuth } = useAuthGate();
  const { addItem, loading: cartLoading } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [selectedGrams, setSelectedGrams] = useState(null);
  const [loading, setLoading] = useState(true);
  const galleryImageRef = useRef(null);

  useEffect(() => {
    document.body.classList.add('product-detail-page');
    return () => document.body.classList.remove('product-detail-page');
  }, []);

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
    if (!product) return;
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
  const handleAddToCart = async (event) => {
    if (!selectedOption || !product) return;
    if (!requireAuth('cart')) return;
    const sourceElement =
      galleryImageRef.current?.querySelector('img') ?? galleryImageRef.current;
    const fly = buildFlyPayload({
      imageSrc: getProductImage(product),
      sourceElement,
      event,
    });
    try {
      const updated = await addItem(product.id, qty, {
        weightGrams: selectedOption.grams,
        variantId: selectedOption.variant_id,
        slug: product.slug,
        ...(fly ? { fly } : {}),
      });
      if (updated) navigate('/cart');
    } catch {
      /* CartContext shows error toast */
    }
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

  const purchaseDisabled = cartLoading || !selectedOption;

  return (
    <div className="product-detail-page-root bg-cream pb-10 lg:pb-12 lg:pt-4">
      <ProductDetailMobileHeader
        className="lg:hidden"
        product={product}
        galleryImageRef={galleryImageRef}
        imageSrc={getProductImage(product)}
      />

      <div className="site-container max-lg:px-0 lg:px-4">
        <div className="hidden lg:mb-4 lg:block">
          <BackToShopLink />
        </div>

        <div className="product-detail-hero grid w-full grid-cols-1 items-start gap-2.5 max-lg:gap-3 lg:gap-6 xl:gap-8 lg:grid-cols-2">
          <ProductDetailGallery
            product={product}
            imageRef={galleryImageRef}
            className="max-lg:mx-0 lg:sticky lg:top-[5.25rem]"
          />

          <div
            className="flex flex-col max-lg:mx-0 max-lg:w-full max-lg:rounded-none max-lg:border-0 max-lg:border-t max-lg:border-sage/35 max-lg:bg-white max-lg:px-4 max-lg:pb-3 max-lg:pt-3 max-lg:shadow-none"
          >
            <ProductInfoSection
              product={product}
              selectedOption={selectedOption}
              showBadgeOnImage={!!product.badge}
            />

            <div className="mt-3 lg:mt-4">
              <div
                className="product-detail-mobile-controls grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 lg:hidden"
              >
                <ProductWeightPicker
                  options={weightOptions}
                  value={selectedGrams}
                  onChange={setSelectedGrams}
                  inline
                  className="!mt-0 min-w-0"
                />
                <QuantitySelector
                  qty={qty}
                  onChange={setQty}
                  disabled={cartLoading}
                  compact
                  className="justify-self-end"
                />
              </div>

              <ProductWeightPicker
                options={weightOptions}
                value={selectedGrams}
                onChange={setSelectedGrams}
                className="!mt-0 hidden lg:block"
              />

              <QuantitySelector
                qty={qty}
                onChange={setQty}
                disabled={cartLoading}
                className="mt-4 hidden lg:flex"
              />

              <div className="mt-2.5 grid grid-cols-2 gap-2 lg:hidden">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={purchaseDisabled}
                  className={cn(
                    BTN_PRIMARY,
                    'min-h-10 w-full min-w-0 whitespace-nowrap px-2 py-2 text-[0.8125rem] font-semibold'
                  )}
                >
                  <CartIcon className="h-4 w-4 shrink-0" />
                  Add to cart
                </button>
                <ComingSoonButton compact className="w-full min-w-0" />
              </div>
            </div>

            <div className="mt-4 hidden flex-wrap items-center gap-2 lg:flex">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={purchaseDisabled}
                className={BTN_PRIMARY}
              >
                <CartIcon className="h-[1.125rem] w-[1.125rem] shrink-0" />
                Add to cart
              </button>
              <ComingSoonButton />
              <WishlistButton
                productId={product.id}
                productSlug={product.slug}
                productName={product.name}
                variant="toolbar"
                imageSrc={getProductImage(product)}
                flySourceRef={galleryImageRef}
                weightGrams={selectedOption?.grams}
                variantId={selectedOption?.variant_id}
              />
              <button
                type="button"
                onClick={handleShare}
                className={BTN_ICON}
                aria-label="Share product"
                title="Share"
              >
                <ShareIcon className="h-[1.125rem] w-[1.125rem]" />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="flex min-w-0 items-center gap-2 text-sm text-muted sm:text-base">
                <TruckIcon className="h-4 w-4 shrink-0 text-secondary" aria-hidden />
                Free shipping over {formatPrice(999)}
              </p>
              <button
                type="button"
                onClick={handleShare}
                className={cn(
                  BTN_ICON,
                  'flex h-9 w-9 shrink-0 items-center justify-center p-0 lg:hidden'
                )}
                aria-label="Share product"
                title="Share"
              >
                <ShareIcon className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>

        <section
          className="mt-5 border-t border-sage/35 bg-white px-4 py-5 max-lg:mx-0 lg:mt-8 lg:rounded-lg lg:border lg:border-sage/40 lg:px-6 lg:py-6"
          aria-labelledby="product-description-heading"
        >
          <ProductDescriptionBlock product={product} fullText />
        </section>

        <div className="mt-6 px-4 lg:mt-8 lg:px-0">
          <SimilarProducts product={product} limit={4} dense />
        </div>
      </div>

      {product.reviews?.length > 0 && (
        <div className="site-container px-4 py-8 lg:px-4 lg:py-12">
          <h2 className="mb-4 font-heading text-lg text-primary lg:text-xl">Customer reviews</h2>
          <div className="flex flex-col gap-3">
            {product.reviews.map((r) => (
              <div key={r.id} className="rounded-md border border-sage/50 bg-white p-4">
                <p className="text-sm italic text-muted">&ldquo;{r.comment}&rdquo;</p>
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

function TruckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M3 6h11v9H3V6z" strokeLinejoin="round" />
      <path d="M14 9h4l3 3v3h-7V9z" strokeLinejoin="round" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
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
      className="inline-flex items-center gap-1 rounded-md border border-sage/70 bg-white px-2.5 py-1 text-xs font-medium text-primary transition hover:border-primary/40 hover:bg-cream-dark"
    >
      <span className="text-[0.7rem] leading-none" aria-hidden="true">←</span>
      Back to shop
    </Link>
  );
}
