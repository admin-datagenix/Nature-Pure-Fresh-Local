import { cn } from '../../lib/cn';
import { useWishlist } from '../../context/WishlistContext';
import { HeartIcon } from '../ui/CommerceIcons';
import { buildFlyPayload } from '../../utils/flyToCart';

export default function WishlistButton({
  productId,
  productName,
  className,
  iconClassName,
  variant = 'floating',
  imageSrc,
  flySourceRef,
}) {
  const { isWishlisted, toggle } = useWishlist();
  const active = isWishlisted(productId);
  const label = productName?.replace(/^Freeze Dried /i, '') || 'Product';

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (active) {
      toggle(productId, label);
      return;
    }

    const fly = imageSrc
      ? buildFlyPayload({
          imageSrc,
          sourceElement: flySourceRef?.current ?? e.currentTarget,
          event: e,
        })
      : null;

    toggle(productId, label, fly ? { fly } : {});
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? `Remove ${label} from wishlist` : `Add ${label} to wishlist`}
      aria-pressed={active}
      className={cn(
        'flex items-center justify-center transition duration-200',
        variant === 'floating' &&
          'h-9 w-9 rounded-full border border-sage/50 bg-white/95 text-primary shadow-[0_4px_12px_rgba(41,70,51,0.12)] hover:border-secondary hover:text-secondary sm:h-8 sm:w-8',
        variant === 'toolbar' &&
          'size-10 shrink-0 rounded-md border border-sage/70 bg-white text-primary hover:border-primary/50 hover:bg-cream-dark',
        active && 'border-secondary/60 text-secondary',
        className
      )}
    >
      <HeartIcon className={cn('h-4 w-4', iconClassName)} filled={active} />
    </button>
  );
}
