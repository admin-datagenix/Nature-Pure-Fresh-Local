import { cn } from '../../lib/cn';
import { formatPrice } from '../../utils/helpers';

export default function ProductWeightPicker({ options, value, onChange }) {
  if (!options?.length) return null;

  return (
    <div className="mt-6">
      <p className="text-sm font-semibold text-primary">Select pack size</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt.grams;
          return (
            <button
              key={opt.grams}
              type="button"
              onClick={() => onChange(opt.grams)}
              className={cn(
                'label-chip flex min-w-[5.5rem] flex-col items-center border px-3 py-2 text-center transition',
                active
                  ? 'border-primary bg-primary text-white shadow-[0_6px_16px_rgba(41,70,51,0.2)]'
                  : 'border-sage/60 bg-white text-primary hover:border-primary/60 hover:bg-cream'
              )}
            >
              <span className="text-sm font-bold">{opt.grams}g</span>
              <span className={cn('text-[0.65rem] font-medium', active ? 'text-white/90' : 'text-muted')}>
                {formatPrice(opt.price)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
