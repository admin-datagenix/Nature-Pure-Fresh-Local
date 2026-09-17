import { cn } from '../../lib/cn';
import { getFruitKey, getProductFruit } from './FruitArt';

const TYPE_LABELS = {
  powder: 'Powder',
  combo: 'Variety',
  chunks: 'Chunks',
};

function getProductType(product) {
  const key = getFruitKey(product?.name || '');
  if (key === 'powder') return 'powder';
  if (key === 'combo') return 'combo';
  return 'chunks';
}

function isExternalImage(src) {
  return src && (/^https?:\/\//.test(src) || /\.(png|jpe?g|webp|avif)(\?|$)/i.test(src));
}

export default function ProductVisual({ product, className, plain = false, hideBadge = false }) {
  const type = getProductType(product);
  const usePhoto = isExternalImage(product?.image);

  if (usePhoto) {
    return (
      <div className={cn('relative h-full w-full overflow-hidden', !plain && 'bg-cream-dark', className)}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain p-2 transition duration-700 ease-out group-hover:scale-105"
        />
        {!plain && <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />}
        {!hideBadge && <TypeBadge type={type} />}
      </div>
    );
  }

  const FruitVisual = getProductFruit(product);
  const isCluster = type === 'combo' || type === 'powder';

  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden',
        !plain && 'bg-gradient-to-br from-white via-cream to-cream-dark',
        className
      )}
    >
      {!plain && (
        <>
          <div className="pointer-events-none absolute -left-8 top-8 h-32 w-32 rounded-full bg-secondary/10 blur-2xl" />
          <div className="pointer-events-none absolute -right-6 bottom-6 h-28 w-28 rounded-full bg-mango/10 blur-2xl" />
        </>
      )}

      <div className={cn('relative flex h-full items-center justify-center', plain ? 'p-2' : 'p-4 sm:p-5')}>
        {isCluster ? (
          <FruitVisual className="relative h-full w-full max-h-[88%] max-w-[88%]" />
        ) : (
          <FruitVisual className="h-full w-full max-h-[86%] max-w-[86%] drop-shadow-xl transition duration-500 ease-out group-hover:scale-[1.06]" />
        )}
      </div>

      {!plain && <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />}
      {!hideBadge && <TypeBadge type={type} />}
    </div>
  );
}

function TypeBadge({ type }) {
  return (
    <span className="absolute bottom-3 left-3 rounded-full bg-white/92 px-2.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider text-primary/75 backdrop-blur-sm">
      {TYPE_LABELS[type]}
    </span>
  );
}

export function getProductVisualColors(product) {
  const type = getProductType(product);
  const map = {
    powder: { light: '#FFD93D' },
    combo: { light: '#A9DFBF' },
    chunks: { light: '#EDE4D3' },
  };
  return map[type] || map.chunks;
}
