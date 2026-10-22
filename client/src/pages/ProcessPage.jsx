import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import Reveal from '../components/ui/Reveal';
import ProcessMediaFrame from '../components/process/ProcessMediaFrame';
import { ProcessIcon } from '../components/process/ProcessIcons';
import ProductCard, { ProductCardSkeleton } from '../components/shop/ProductCard';
import { filterFallbackProducts } from '../data/fallbackProducts';
import {
  PROCESS_FOOTER_TAGLINE,
  PROCESS_HERO,
  PROCESS_PILLARS,
  PROCESS_SPECS,
  PROCESS_STEPS,
} from '../data/freezeDryingProcess';
import { PRODUCT_GRID_CLASS } from '../utils/productLayout';
import { isOutOfStock } from '../utils/stockDisplay';

const PROCESS_PRODUCT_LIMIT = 4;

function inStockProducts(list, max) {
  return (list || []).filter((p) => !isOutOfStock(p)).slice(0, max);
}

export default function ProcessPage() {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fallback = inStockProducts(
      filterFallbackProducts({ category: 'all', limit: PROCESS_PRODUCT_LIMIT * 2 }),
      PROCESS_PRODUCT_LIMIT
    );

    async function load() {
      setProductsLoading(true);
      try {
        const res = await api.getBestsellers(PROCESS_PRODUCT_LIMIT);
        if (cancelled) return;
        const list = inStockProducts(res.data || res.products || [], PROCESS_PRODUCT_LIMIT);
        setProducts(list.length ? list : fallback);
      } catch {
        if (!cancelled) setProducts(fallback);
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="process-page bg-cream">
      <section className="process-hero border-b border-sage/40 bg-gradient-to-br from-white via-[#eef3ec] to-white">
        <div className="site-container py-10 md:py-12 lg:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.28fr)] lg:gap-10 xl:gap-12">
            <Reveal variant="left">
              <h1 className="font-heading text-[1.75rem] font-semibold leading-tight text-primary sm:text-3xl md:text-4xl">
                {PROCESS_HERO.title}
              </h1>
              <p className="mt-2 font-heading text-lg font-semibold text-secondary md:text-xl">
                {PROCESS_HERO.subtitle}
              </p>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-primary/90 md:text-[0.9375rem]">
                {PROCESS_HERO.description}
              </p>

              <ul className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4">
                {PROCESS_PILLARS.map((item) => (
                  <li key={item.id} className="flex flex-col items-center text-center">
                    <span
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm"
                    >
                      <ProcessIcon name={item.icon} className="h-7 w-7" />
                    </span>
                    <span className="mt-2.5 text-[0.65rem] font-semibold leading-snug text-primary sm:text-xs">
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal variant="right" delay={60} className="min-w-0 w-full lg:-mr-2 xl:-mr-4">
              <figure className="w-full overflow-hidden rounded-xl border border-sage/35 bg-white shadow-[0_12px_36px_rgba(41,70,51,0.1)]">
                <ProcessMediaFrame
                  src={PROCESS_HERO.image}
                  alt={PROCESS_HERO.imageCaption}
                  priority
                  fit="cover"
                  frameClassName="aspect-[16/10] w-full border-0 sm:aspect-[16/9] lg:aspect-[2/1] xl:min-h-[18rem]"
                />
                <figcaption className="bg-primary px-4 py-2.5 text-right text-xs font-semibold text-white sm:text-sm">
                  {PROCESS_HERO.imageCaption}
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-sage/40 bg-white py-10 md:py-14 lg:py-16">
        <div className="site-container">
          <Reveal variant="up" className="text-center">
            <h2 className="font-heading text-2xl font-semibold text-primary md:text-3xl">
              How Freeze Drying Works?
            </h2>
            <p className="mt-2 text-sm text-muted md:text-base">
              A simple process, a powerful result.
            </p>
          </Reveal>

          <div className="process-steps-scroll mt-8 md:mt-10">
            <ol
              className="process-timeline flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:pb-0"
            >
              {PROCESS_STEPS.map((step, i) => (
                <Reveal
                  key={step.step}
                  variant="up"
                  delay={i * 40}
                  className="h-full w-[min(78vw,15.5rem)] shrink-0 snap-center lg:w-auto lg:shrink"
                >
                  <li className="process-timeline__step flex h-full flex-col">
                    {i < PROCESS_STEPS.length - 1 && (
                      <span className="process-timeline__connector hidden lg:block" aria-hidden />
                    )}
                    <span
                      className="relative z-10 mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-md ring-4 ring-white"
                    >
                      {step.step}
                    </span>
                    <div
                      className="overflow-hidden rounded-xl border border-sage/45 shadow-[0_10px_28px_rgba(41,70,51,0.08)]"
                    >
                      <ProcessMediaFrame
                        src={step.image}
                        alt={step.title}
                        fit="cover"
                        frameClassName="aspect-[4/3] w-full border-0 lg:aspect-square"
                      />
                    </div>
                    <h3 className="mt-3 text-center font-heading text-sm font-semibold leading-snug text-secondary md:text-[0.9375rem]">
                      {step.title}
                    </h3>
                    <p className="mt-2 flex-1 text-center text-xs leading-relaxed text-muted md:text-sm">
                      {step.description}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-t border-sage/45 bg-white py-10 md:py-12">
        <div className="site-container">
          <Reveal variant="up" className="mb-8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-heading text-2xl font-semibold text-primary md:text-3xl">
                  Our freeze-dried fruits
                </h2>
                <p className="mt-1 text-sm text-muted md:text-base">Real fruit. Pure and simple.</p>
              </div>
              <Link
                to="/shop"
                className="neo-btn inline-flex shrink-0 px-6 py-2.5 text-sm font-semibold sm:px-7 sm:py-3"
              >
                View all products
              </Link>
            </div>
          </Reveal>

          <div>
            {productsLoading ? (
              <div className={PRODUCT_GRID_CLASS}>
                {[...Array(PROCESS_PRODUCT_LIMIT)].map((_, i) => (
                  <ProductCardSkeleton key={i} className="h-full" />
                ))}
              </div>
            ) : products.length ? (
              <div className={PRODUCT_GRID_CLASS}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} className="h-full" />
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted">No products available right now.</p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-primary text-white">
        <div className="site-container py-9 md:py-10">
          <ul
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-white/20"
          >
            {PROCESS_SPECS.map((spec, index) => (
              <li
                key={spec.id}
                className={`flex gap-3 sm:gap-4 lg:px-6 ${
                  index === 0 ? 'lg:pl-0' : ''
                } ${index === PROCESS_SPECS.length - 1 ? 'lg:pr-0' : ''}`}
              >
                <span className="shrink-0 pt-0.5 text-white">
                  <ProcessIcon name={spec.icon} className="h-9 w-9 md:h-10 md:w-10" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-heading text-sm font-semibold leading-snug md:text-base">
                    {spec.title}
                  </h3>
                  <ul className="mt-1.5 space-y-0.5 text-xs leading-relaxed text-white/88 md:text-sm">
                    {spec.lines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-8 border-t border-white/20 pt-5 text-center text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/75 sm:text-xs">
            {PROCESS_FOOTER_TAGLINE}
          </p>
        </div>
      </section>
    </div>
  );
}
