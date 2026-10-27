import { useEffect, useMemo, useState } from 'react';
import { cn } from '../../../lib/cn';
import { getProductGalleryViews } from '../../../data/productGallery';
import ProductVisual from '../../ui/ProductVisual';
import { getBadgeClass, PRODUCT_BADGE_CHIP } from '../../../utils/helpers';

export default function ProductDetailGallery({ product, imageRef, className }) {
  const views = useMemo(() => getProductGalleryViews(product), [product]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [product?.id, product?.slug]);

  const activeView = views[activeIndex] || views[0];
  const activeIsPdf =
    activeView?.mediaType === 'pdf' || String(activeView?.src || '').toLowerCase().endsWith('.pdf');
  const activeIsMarketing = activeView?.mediaType === 'marketing';
  const displayProduct =
    activeView && !activeIsPdf && !activeIsMarketing ? { ...product, image: activeView.src } : product;

  return (
    <div className={cn('product-detail-gallery w-full', className)}>
      <div className="product-detail-gallery__frame max-lg:border-0 max-lg:bg-white max-lg:p-0 max-lg:shadow-none">
        <div
          className="product-detail-gallery__canvas product-detail-gallery__canvas--mobile max-lg:w-full max-lg:max-w-none max-lg:rounded-none max-lg:border-0"
          ref={imageRef}
        >
          {activeIsPdf ? (
            <iframe
              src={activeView.src}
              title={activeView.label || 'Product information'}
              className="relative z-[1] h-full min-h-[min(70vw,22rem)] w-full border-0 bg-white sm:min-h-[24rem]"
            />
          ) : activeIsMarketing ? (
            <img
              src={activeView.src}
              alt=""
              className="relative z-[1] h-full w-full object-contain object-center bg-cream p-1"
              decoding="async"
            />
          ) : (
            <ProductVisual product={displayProduct} hoverZoom compactMedia hideBadge={!!product.badge} />
          )}
          {product.badge ? (
            <span
              className={cn(
                'pointer-events-none absolute left-2 top-2 z-10',
                PRODUCT_BADGE_CHIP,
                getBadgeClass(product.badge)
              )}
            >
              {product.badge}
            </span>
          ) : null}
        </div>

        {views.length > 1 ? (
        <div className="product-detail-gallery__thumbs">
          {views.map((view, i) => {
            const thumbIsPdf =
              view.mediaType === 'pdf' || String(view.src || '').toLowerCase().endsWith('.pdf');
            return (
              <button
                key={`${view.src}-${i}`}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={cn(
                  'product-detail-gallery__thumb',
                  i === activeIndex && 'product-detail-gallery__thumb--active'
                )}
                aria-label={view.label}
                aria-current={i === activeIndex ? 'true' : undefined}
              >
                {thumbIsPdf ? (
                  <span className="flex h-full w-full flex-col items-center justify-center gap-0.5 bg-cream-dark px-1 text-[0.6rem] font-bold uppercase leading-tight text-primary">
                    PDF
                  </span>
                ) : (
                  <img src={view.src} alt="" loading="lazy" decoding="async" />
                )}
              </button>
            );
          })}
        </div>
        ) : null}
      </div>
    </div>
  );
}
