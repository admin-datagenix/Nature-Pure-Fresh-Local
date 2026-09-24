import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CHUNKS_CATEGORY_BANNER,
  CHUNKS_CATEGORY_BANNER_FALLBACK,
  POWDER_CATEGORY_BANNER,
} from '../../data/brand';
import Reveal from '../ui/Reveal';

const CARD_CLASS =
  'group relative isolate block min-h-[168px] overflow-hidden rounded-[1.25rem] border border-sage/40 bg-white transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(41,70,51,0.1)] sm:min-h-[200px] md:min-h-[220px]';

const SHOP_CATEGORIES = [
  {
    slug: 'fruit-snacks',
    label: 'Chunks',
    eyebrow: 'Freeze-dried snacks',
    subline: 'Crunchy fruit slices & cubes · real fruit · no added sugar',
    image: CHUNKS_CATEGORY_BANNER,
    imageFallback: CHUNKS_CATEGORY_BANNER_FALLBACK,
    imageWidth: 'w-[54%] sm:w-[52%] md:w-[50%]',
    imageClass:
      'absolute bottom-0 right-0 h-full w-[115%] max-w-none -translate-x-[4%] object-contain object-bottom object-right drop-shadow-[0_12px_28px_rgba(41,70,51,0.12)] transition duration-500 group-hover:scale-[1.03] sm:-translate-x-[6%]',
  },
  {
    slug: 'baking-essentials',
    label: 'Powder',
    eyebrow: 'Fruit powders',
    subline: '100% fruit for smoothies, baking & everyday nutrition · 16 flavours',
    image: POWDER_CATEGORY_BANNER,
    imageWidth: 'w-[54%] sm:w-[52%] md:w-[50%]',
    imageClass:
      'absolute bottom-0 right-0 h-full w-[115%] max-w-none -translate-x-[5%] object-contain object-bottom object-right drop-shadow-[0_12px_28px_rgba(41,70,51,0.1)] transition duration-500 group-hover:scale-[1.02] sm:-translate-x-[7%]',
  },
];

function CategoryCardImage({ cat }) {
  const [src, setSrc] = useState(cat.image);

  return (
    <img
      src={src}
      alt={cat.label}
      className={cat.imageClass}
      decoding="async"
      onError={() => {
        if (cat.imageFallback && src !== cat.imageFallback) setSrc(cat.imageFallback);
      }}
    />
  );
}

function CategoryPromoCard({ cat }) {
  return (
    <Link to={`/shop/${cat.slug}`} className={CARD_CLASS}>
      <div className="relative z-10 flex h-full min-h-[inherit] max-w-[56%] flex-col justify-center px-5 py-5 sm:max-w-[54%] sm:px-6 sm:py-6 md:px-7">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-secondary sm:text-xs">
          {cat.eyebrow}
        </p>
        <h3 className="font-heading mt-1.5 text-2xl font-semibold leading-[1.1] text-primary sm:mt-2 sm:text-[1.85rem] md:text-[2rem]">
          {cat.label}
        </h3>
        <p className="mt-2 max-w-[14rem] text-[0.7rem] leading-relaxed text-muted sm:text-xs md:text-sm">
          {cat.subline}
        </p>
        <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition group-hover:gap-2.5 sm:mt-5 sm:px-4 sm:py-2.5 sm:text-sm">
          Shop Now
          <span aria-hidden="true">→</span>
        </span>
      </div>

      <div
        className={`pointer-events-none absolute inset-y-0 right-0 overflow-hidden ${cat.imageWidth}`}
        aria-hidden
      >
        <CategoryCardImage cat={cat} />
      </div>
    </Link>
  );
}

export default function CategoryCards() {
  return (
    <section className="pt-8 pb-12 md:pt-10 md:pb-14">
      <div className="site-container">
        <Reveal variant="blur" className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-primary md:text-[2rem]">
            Shop By Category
          </h2>
          <Link
            to="/shop"
            className="shrink-0 text-sm font-medium text-muted transition hover:text-primary"
          >
            View all <span aria-hidden="true">→</span>
          </Link>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          {SHOP_CATEGORIES.map((cat, i) => (
            <Reveal key={cat.slug} variant={i === 0 ? 'left' : 'right'} delay={i * 100}>
              <CategoryPromoCard cat={cat} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
