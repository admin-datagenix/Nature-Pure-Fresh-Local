import { cn } from '../../../lib/cn';
import { CartIcon } from '../../ui/CommerceIcons';
import ComingSoonButton from '../ComingSoonButton';

export default function StickyPurchaseBar({
  onAddToCart,
  disabled,
  className,
}) {
  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-[120] border-t border-sage/40 bg-white px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(41,70,51,0.12)]',
        className
      )}
      role="group"
      aria-label="Purchase actions"
    >
      <div className="mx-auto flex max-w-lg gap-2.5">
        <button
          type="button"
          onClick={onAddToCart}
          disabled={disabled}
          className="neo-btn inline-flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50"
        >
          <CartIcon className="h-4 w-4 shrink-0" />
          Add to Cart
        </button>
        <ComingSoonButton compact className="min-h-0 flex-1 py-2.5" />
      </div>
    </div>
  );
}
