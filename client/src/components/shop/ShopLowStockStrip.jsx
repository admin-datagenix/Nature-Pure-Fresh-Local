import { Link } from 'react-router-dom';
import { getProductImage } from '../../data/productImages';
import { getProductCardTone } from '../../utils/productLayout';
import { STORE_SETTINGS } from '../../config/storeSettings';
import { lowStockLabel } from '../../utils/stockDisplay';
import { formatPrice } from '../../utils/helpers';

export default function ShopLowStockStrip({ products }) {
  if (STORE_SETTINGS.showLowStockBadges === false || !products?.length) return null;

  return (
    <section
      className="mb-6 overflow-hidden rounded-xl border border-mango/40 bg-gradient-to-r from-mango/20 via-cream to-cream-dark/80 shadow-[0_4px_16px_rgba(41,70,51,0.06)]"
      aria-label="Low stock — selling fast"
    >
      <div className="flex items-center gap-2 border-b border-mango/25 px-4 py-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mango/45 text-sm" aria-hidden>
          🔥
        </span>
        <div className="min-w-0">
          <p className="font-heading text-sm font-semibold text-primary">Selling fast</p>
          <p className="text-[0.7rem] text-muted">Only a few packs left — grab before they&apos;re gone</p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto p-3 pb-3.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((product) => {
          const shortName = product.name.replace(/^Freeze Dried /i, '');
          const label = lowStockLabel(product);
          const tone = getProductCardTone(product);

          return (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className="group w-[7.25rem] shrink-0 sm:w-[7.75rem]"
            >
              <div
                className="relative aspect-square overflow-hidden rounded-lg border border-sage/50 shadow-sm transition group-hover:border-secondary/60"
                style={{ backgroundColor: tone }}
              >
                <img
                  src={getProductImage(product)}
                  alt=""
                  className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                {label && (
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-strawberry/95 to-strawberry/80 px-1 py-1 text-center text-[0.62rem] font-bold uppercase tracking-wide text-white">
                    {label}
                  </span>
                )}
              </div>
              <p className="mt-1.5 line-clamp-2 text-[0.7rem] font-medium leading-snug text-primary group-hover:text-secondary">
                {shortName}
              </p>
              <p className="mt-0.5 text-xs font-bold text-primary">{formatPrice(product.price)}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
