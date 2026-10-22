import { cn } from '../../lib/cn';
import { formatPrice, shouldShowSaleTags } from '../../utils/helpers';

export default function ProductWeightPicker({ options, value, onChange, className, inline = false }) {
  if (!options?.length) return null;

  const selected = options.find((o) => o.grams === value) ?? options[0];
  const price = selected?.price;
  const compare = selected?.compare_at_price;
  const showCompare =
    shouldShowSaleTags() && compare != null && Number(compare) > Number(price);

  return (
    <div
      className={cn(
        'mt-4 grid gap-x-6 gap-y-2',
        inline ? 'grid-cols-[minmax(0,1fr)_auto] items-center' : 'sm:grid-cols-2 sm:items-start',
        className
      )}
    >
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary sm:text-sm">Pack size</p>
        <div className={cn('mt-2 flex flex-wrap gap-2', inline && 'mt-1.5')}>
          {options.map((opt) => {
            const active = value === opt.grams;
            return (
              <button
                key={opt.grams}
                type="button"
                onClick={() => onChange(opt.grams)}
                className={cn(
                  'label-chip border px-4 py-2 text-center transition',
                  inline ? 'min-w-[4.5rem] text-sm' : 'min-w-[5.25rem]',
                  active
                    ? 'border-primary bg-primary text-white shadow-[0_6px_16px_rgba(41,70,51,0.2)]'
                    : 'border-sage/60 bg-white text-primary hover:border-primary/60 hover:bg-cream'
                )}
              >
                <span className="text-base font-bold">{opt.grams}g</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={cn(inline && 'text-right')}>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary sm:text-sm">Price</p>
        <div
          className={cn(
            'mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5',
            inline && 'mt-1.5 justify-end'
          )}
        >
          {showCompare ? (
            <span className="text-sm font-medium text-muted line-through decoration-sage/80 sm:text-base">
              {formatPrice(compare)}
            </span>
          ) : null}
          <span className="text-xl font-bold text-primary sm:text-2xl">{formatPrice(price)}</span>
        </div>
      </div>
    </div>
  );
}
