import { cn } from '../../lib/cn';

/** Shop + About header art — export at 1920×700 px (aspect 1920/700 ≈ 2.74:1). */
export const CATEGORY_BANNER_ASPECT_CLASS = 'aspect-[1920/700]';

/** About page + shop category headers — contained banner with rounded frame */
const INSET_WRAPPER_CLASS = 'site-container pt-4 sm:pt-5 md:pt-10';
export const CATEGORY_BANNER_ROUND_CLASS = 'rounded-xl sm:rounded-2xl md:rounded-3xl';
const INSET_HEADER_CLASS = cn(
  'mb-0 max-w-none overflow-hidden border border-sage/25',
  CATEGORY_BANNER_ROUND_CLASS
);
const INSET_IMAGE_CLASS = 'h-full w-full object-cover object-center';

export function InsetCategoryBanner({
  src,
  title,
  className,
  imageClassName,
  imageFallback,
  wide = false,
  aspectClass,
}) {
  if (!src) return null;

  return (
    <div className={wide ? 'w-full px-3 pt-4 sm:px-4 sm:pt-5 md:px-5 md:pt-10' : INSET_WRAPPER_CLASS}>
      <CategoryBannerHero
        src={src}
        title={title}
        className={cn(INSET_HEADER_CLASS, className)}
        imageClassName={cn(INSET_IMAGE_CLASS, imageClassName)}
        imageFallback={imageFallback}
        aspectClass={aspectClass}
      />
    </div>
  );
}

export default function CategoryBannerHero({
  src,
  title,
  className,
  imageClassName,
  imageFallback,
  aspectClass = CATEGORY_BANNER_ASPECT_CLASS,
}) {
  if (!src) return null;

  return (
    <header
      className={cn(
        'category-banner-hero relative mx-auto mb-10 w-full max-w-[1920px] overflow-hidden bg-cream',
        aspectClass,
        CATEGORY_BANNER_ROUND_CLASS,
        className
      )}
      aria-label={title}
    >
      <img
        src={src}
        alt=""
        className={cn('category-banner-hero__img pointer-events-none', imageClassName)}
        decoding="async"
        fetchPriority="high"
        onError={(e) => {
          if (!imageFallback || e.currentTarget.dataset.fallbackApplied) return;
          e.currentTarget.dataset.fallbackApplied = '1';
          e.currentTarget.src = imageFallback;
        }}
      />
      {title ? <h1 className="sr-only">{title}</h1> : null}
    </header>
  );
}
