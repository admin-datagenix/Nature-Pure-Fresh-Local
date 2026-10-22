import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { buildHomePage } from '../../api/mock/cms/homePage';
import useCategoryTree from '../../hooks/useCategoryTree';
import { buildCategoryHomeCards } from '../../utils/categoryHomeCards';
import Reveal from '../ui/Reveal';
import { cn } from '../../lib/cn';

const FALLBACK_SECTION = buildHomePage().categorySection;

const CARD_BASE =
  'group isolate block overflow-hidden rounded-[1.25rem] border border-sage/40 bg-white transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(41,70,51,0.1)]';

function CategoryPromoCard({ cat, layout = 'desktop' }) {
  const hasImage = Boolean(cat.hasImage && cat.image);
  const isMobileStack = layout === 'mobile';

  if (isMobileStack) {
    return (
      <Link
        to={`/shop/${cat.slug}`}
        className={cn(CARD_BASE, 'flex min-w-0 flex-col p-4')}
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="min-w-0 font-heading text-base font-semibold leading-tight text-primary sm:text-lg">
            {cat.label}
          </h3>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-white shadow-sm">
            Shop Now
            <span aria-hidden="true">→</span>
          </span>
        </div>
        {hasImage ? (
          <div className="mt-3 overflow-hidden rounded-xl border border-sage/30 bg-cream/40">
            <img
              src={cat.image}
              alt=""
              className="aspect-[2/1] w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : null}
      </Link>
    );
  }

  return (
    <Link
      to={`/shop/${cat.slug}`}
      className={cn(
        CARD_BASE,
        'relative min-h-[200px] md:min-h-[220px]'
      )}
    >
      <div
        className={cn(
          'relative z-10 flex h-full min-h-[inherit] flex-col justify-center px-5 py-5 sm:px-6 sm:py-6 md:px-7',
          hasImage ? 'max-w-[56%] sm:max-w-[54%]' : 'max-w-full'
        )}
      >
        <h3 className="font-heading text-[1.2rem] font-semibold leading-[1.15] text-primary sm:text-[1.65rem] md:text-[1.85rem]">
          {cat.label}
        </h3>
        {cat.subline ? (
          <p className="mt-2 text-[0.7rem] leading-relaxed text-muted sm:text-xs md:text-sm line-clamp-4">
            {cat.subline}
          </p>
        ) : null}
        <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition group-hover:gap-2.5 sm:mt-5 sm:px-4 sm:py-2.5 sm:text-sm">
          Shop Now
          <span aria-hidden="true">→</span>
        </span>
      </div>

      {hasImage ? (
        <div
          className="pointer-events-none absolute bottom-2.5 right-2.5 top-2.5 w-[50%] overflow-hidden rounded-2xl sm:w-[48%] md:w-[46%]"
          aria-hidden
        >
          <img
            src={cat.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-right transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}
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

        {/* Mobile: stacked wide cards — title, then image below (no description) */}
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
