import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { buildHomePage } from '../../api/mock/cms/homePage';
import useCategoryTree from '../../hooks/useCategoryTree';
import { buildCategoryHomeCards } from '../../utils/categoryHomeCards';
import Reveal from '../ui/Reveal';
import { cn } from '../../lib/cn';

const FALLBACK_SECTION = buildHomePage().categorySection;

const CARD_BASE =
  'category-promo-card group block overflow-hidden rounded-[1.25rem] border border-sage/50 shadow-[0_8px_24px_rgba(41,70,51,0.08)]';

function cardThemeClass(slug) {
  if (slug === 'fruit-snacks') return 'category-promo-card--chunks';
  if (slug === 'baking-essentials') return 'category-promo-card--powder';
  return '';
}

function CategoryCardImage({ cat, layout }) {
  if (!cat.hasImage || !cat.image) return null;

  const panelClass = cn(
    'category-promo-card__panel overflow-visible',
    cat.imagePanelClass || 'bg-transparent',
    layout === 'mobile'
      ? 'relative flex aspect-[5/4] w-full items-center justify-center'
      : 'pointer-events-none absolute bottom-0 right-0 top-0 w-[52%] sm:w-[50%] md:w-[48%]'
  );

  const imgClass = cn(
    'category-promo-card__img category-promo-card__img--theme',
    layout === 'mobile'
      ? 'h-full w-full max-h-full max-w-full object-contain object-center'
      : cat.imageClass
  );

  const handleImgError = (e) => {
    const el = e.currentTarget;
    const tried = el.dataset.fallbackStage || '0';
    const src = el.src || '';
    if (tried === '0' && cat.imageOpaque && !src.includes(cat.imageOpaque)) {
      el.dataset.fallbackStage = '1';
      el.src = cat.imageOpaque;
      return;
    }
    if (tried === '1' && cat.imageFallback && !src.includes(cat.imageFallback)) {
      el.dataset.fallbackStage = '2';
      el.src = cat.imageFallback;
    }
  };

  return (
    <div className={panelClass} aria-hidden>
      <img
        src={cat.image}
        alt=""
        className={imgClass}
        loading="lazy"
        decoding="async"
        onError={handleImgError}
      />
    </div>
  );
}

function CategoryPromoCard({ cat, layout = 'desktop' }) {
  const hasImage = Boolean(cat.hasImage && cat.image);
  const isMobileStack = layout === 'mobile';

  if (isMobileStack) {
    return (
      <Link
        to={`/shop/${cat.slug}`}
        className={cn(CARD_BASE, cardThemeClass(cat.slug), 'flex min-w-0 flex-col gap-3 p-4 sm:gap-4 sm:p-5')}
      >
        <span className="category-promo-card__decor" aria-hidden="true" />
        {cat.eyebrow ? (
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-secondary sm:text-xs">
            {cat.eyebrow}
          </p>
        ) : null}
        <h3 className="font-heading text-lg font-semibold leading-tight text-primary sm:text-xl">
          {cat.label}
        </h3>
        {hasImage ? <CategoryCardImage cat={cat} layout="mobile" /> : null}
        <span
          className="category-promo-card__cta inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm sm:w-auto sm:self-start"
        >
          Shop Now
          <span aria-hidden="true">→</span>
        </span>
      </Link>
    );
  }

  return (
    <Link
      to={`/shop/${cat.slug}`}
      className={cn(
        CARD_BASE,
        cardThemeClass(cat.slug),
        'relative min-h-[200px] md:min-h-[220px]'
      )}
    >
      <span className="category-promo-card__decor" aria-hidden="true" />
      <div
        className={cn(
          'category-promo-card__content relative z-10 flex h-full min-h-[inherit] flex-col justify-center px-5 py-5 sm:px-6 sm:py-6 md:px-7',
          hasImage && 'max-w-[56%] sm:max-w-[54%]',
          !hasImage && 'max-w-full'
        )}
      >
        {cat.eyebrow ? (
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-secondary sm:text-xs">
            {cat.eyebrow}
          </p>
        ) : null}
        <h3
          className={cn(
            'font-heading text-[1.2rem] font-semibold leading-[1.15] text-primary sm:text-[1.65rem] md:text-[1.85rem]',
            cat.eyebrow && 'mt-1'
          )}
        >
          {cat.label}
        </h3>
        {cat.subline ? (
          <p className="mt-2 text-[0.7rem] leading-snug text-muted sm:text-xs md:text-sm line-clamp-1">
            {cat.subline}
          </p>
        ) : null}
        <span className="category-promo-card__cta mt-4 inline-flex w-fit items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-sm sm:mt-5 sm:px-4 sm:py-2.5 sm:text-sm">
          Shop Now
          <span aria-hidden="true">→</span>
        </span>
      </div>

      {hasImage ? <CategoryCardImage cat={cat} layout="desktop" /> : null}
    </Link>
  );
}

export default function CategoryCards({ section }) {
  const data = section || FALLBACK_SECTION;
  const { categories, loading } = useCategoryTree();
  const cards = useMemo(() => buildCategoryHomeCards(categories), [categories]);

  if (loading && cards.length === 0) {
    return (
      <section className="pt-8 pb-5 md:pt-10 md:pb-14">
        <div className="site-container">
          <div className="mb-6 h-8 w-48 animate-pulse rounded-lg bg-sage/40 md:mb-8" />
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-5">
            <div className="min-h-[200px] animate-pulse rounded-[1.25rem] bg-sage/30" />
            <div className="min-h-[200px] animate-pulse rounded-[1.25rem] bg-sage/30" />
          </div>
        </div>
      </section>
    );
  }

  if (!cards.length) return null;

  return (
    <section className="pt-8 pb-5 md:pt-10 md:pb-14">
      <div className="site-container">
        <Reveal
          variant="blur"
          className="mb-5 flex flex-nowrap items-center justify-between gap-3 md:mb-8"
        >
          <h2
            className="min-w-0 shrink font-heading text-[1.35rem] font-semibold leading-none tracking-tight text-primary whitespace-nowrap sm:text-3xl md:text-[2rem]"
          >
            {data.title}
          </h2>
          <Link
            to={data.viewAllLink?.to || '/shop'}
            className="shrink-0 text-sm font-medium text-muted underline underline-offset-2 decoration-muted/60 transition hover:text-primary hover:decoration-primary"
          >
            {data.viewAllLink?.label || 'View all'} <span aria-hidden="true">→</span>
          </Link>
        </Reveal>

        {/* Mobile: vertical cards — title → image → Shop Now */}
        <div className="flex flex-col gap-4 md:hidden">
          {cards.map((cat, i) => (
            <Reveal key={cat.slug} variant="up" delay={i * 80}>
              <CategoryPromoCard cat={cat} layout="mobile" />
            </Reveal>
          ))}
        </div>

        {/* Tablet/desktop: 2-column promo cards with description */}
        <div className="hidden gap-4 md:grid md:grid-cols-2 md:gap-5">
          {cards.map((cat, i) => (
            <Reveal key={cat.slug} variant={i === 0 ? 'left' : 'right'} delay={i * 100}>
              <CategoryPromoCard cat={cat} layout="desktop" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
