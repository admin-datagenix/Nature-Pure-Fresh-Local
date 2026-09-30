import { cn } from '../../lib/cn';

/** About page + powder shop — contained banner with rounded frame */
const INSET_WRAPPER_CLASS = 'site-container pt-4 sm:pt-5 md:pt-10';
const INSET_HEADER_CLASS = 'mb-0 max-w-none rounded-lg sm:rounded-xl md:rounded-2xl';
const INSET_IMAGE_CLASS = 'object-contain object-center';

export function InsetCategoryBanner({ src, title, className, imageClassName }) {
  if (!src) return null;

  return (
    <div className={INSET_WRAPPER_CLASS}>
      <CategoryBannerHero
        src={src}
        title={title}
        className={cn(INSET_HEADER_CLASS, className)}
        imageClassName={cn(INSET_IMAGE_CLASS, imageClassName)}
      />
    </div>
  );
}

export default function CategoryBannerHero({ src, title, className, imageClassName }) {
  if (!src) return null;

  return (
    <header
      className={cn(
        'relative mx-auto mb-10 aspect-[1920/700] w-full max-w-[1920px] overflow-hidden bg-cream',
        className
      )}
      aria-label={title}
    >
      <img
        src={src}
        alt=""
        className={cn(
          'hero-banner-img pointer-events-none absolute inset-0 h-full w-full object-contain object-center',
          imageClassName
        )}
        decoding="async"
        fetchPriority="high"
      />
      {title ? <h1 className="sr-only">{title}</h1> : null}
    </header>
  );
}
