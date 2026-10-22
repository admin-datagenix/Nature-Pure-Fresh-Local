import { cn } from '../../../lib/cn';

export default function QuantitySelector({ qty, onChange, className, disabled, compact = false }) {
  const btnSize = compact ? 'h-9 w-8 text-base' : 'h-9 w-9 text-lg';
  const countWidth = compact ? 'min-w-[1.75rem]' : 'min-w-[2.25rem]';

  return (
    <div className={cn('flex shrink-0 items-center', compact ? 'gap-2' : 'gap-3', className)}>
      <span
        className={cn(
          'shrink-0 font-semibold uppercase tracking-wide text-primary',
          compact ? 'text-[0.625rem] leading-none' : 'text-xs sm:text-sm'
        )}
      >
        Qty
      </span>
      <div className="neo-qty !h-9 !rounded-md">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, qty - 1))}
          disabled={disabled || qty <= 1}
          className={cn(
            'flex items-center justify-center text-primary transition hover:bg-cream active:scale-95 disabled:opacity-40',
            btnSize
          )}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span
          className={cn(
            'flex items-center justify-center text-sm font-bold tabular-nums leading-none text-primary',
            countWidth
          )}
        >
          {qty}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(99, qty + 1))}
          disabled={disabled}
          className={cn(
            'flex items-center justify-center text-primary transition hover:bg-cream active:scale-95 disabled:opacity-40',
            btnSize
          )}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  );
}
