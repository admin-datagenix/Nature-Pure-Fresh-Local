import { cn } from '../../lib/cn';

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
