import { cn } from '../../lib/cn';
import { getProductImage, isProductImageUrl } from '../../data/productImages';
import { getProductCardTone } from '../../utils/productLayout';
import { getFruitKey, getProductFruit } from './FruitArt';
import ProductHoverZoom from './ProductHoverZoom';

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

function ProductToneBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-[18%] rounded-full bg-white/35 blur-2xl" aria-hidden="true" />
  );
}

export default function ProductVisual({ product, className, plain = false, hideBadge = false, hoverZoom = false }) {
  const type = getProductType(product);
  const imageSrc = getProductImage(product);
  const usePhoto = isProductImageUrl(imageSrc);
  const tone = getProductCardTone(product);

  if (usePhoto) {
    return (
      <div
        className={cn('relative h-full w-full overflow-hidden', className)}
        style={!plain ? { backgroundColor: tone } : undefined}
      >
        {!plain && <ProductToneBackdrop />}
        {hoverZoom ? (
          <ProductHoverZoom src={imageSrc} alt={product.name} className="relative z-[1] h-full w-full" />
        ) : (
          <div className="relative z-[1] flex h-full w-full items-center justify-center p-3 sm:p-4">
            <img
              src={imageSrc}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="max-h-full max-w-full object-contain transition duration-500 ease-out group-hover:scale-[1.06]"
            />
          </div>
        )}
        {!hideBadge && <TypeBadge type={type} />}
      </div>
    );
  }

  const FruitVisual = getProductFruit(product);
  const isCluster = type === 'combo' || type === 'powder';

  return (
    <div
      className={cn('relative h-full w-full overflow-hidden', className)}
      style={!plain ? { backgroundColor: tone } : undefined}
    >
      {!plain && <ProductToneBackdrop />}

      <div className={cn('relative z-[1] flex h-full items-center justify-center', plain ? 'p-2' : 'p-4 sm:p-5')}>
        {isCluster ? (
          <FruitVisual className="relative h-full w-full max-h-[88%] max-w-[88%] transition duration-500 ease-out group-hover:scale-[1.06]" />
        ) : (
          <FruitVisual className="h-full w-full max-h-[86%] max-w-[86%] drop-shadow-xl transition duration-500 ease-out group-hover:scale-[1.06]" />
        )}
      </div>

      {!hideBadge && <TypeBadge type={type} />}
    </div>
  );
}

function TypeBadge({ type }) {
  return (
    <span className="label-chip pointer-events-none absolute bottom-3 left-3 z-10 bg-white/92 px-2.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider text-primary/75 backdrop-blur-sm">
      {TYPE_LABELS[type]}
    </span>
  );
}

export function getProductVisualColors(product) {
  return { light: getProductCardTone(product) };
}
