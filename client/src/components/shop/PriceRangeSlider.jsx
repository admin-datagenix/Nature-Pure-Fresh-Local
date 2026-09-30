import { useCallback, useEffect, useState } from 'react';
import { cn } from '../../lib/cn';

function formatInr(n) {
  return `₹${n.toLocaleString('en-IN')}`;
}

function clamp(n, floor, ceiling) {
  return Math.min(ceiling, Math.max(floor, n));
}

/** Price filter: gradient track, single thumb (max), min/max typed in inputs. */
export default function PriceRangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  onChangeMin,
  onChangeMax,
  className,
}) {
  const lo = clamp(Math.min(valueMin, valueMax), min, max);
  const hi = clamp(Math.max(valueMin, valueMax), min, max);

  const [minDraft, setMinDraft] = useState(String(lo));
  const [maxDraft, setMaxDraft] = useState(String(hi));

  useEffect(() => {
    setMinDraft(String(lo));
    setMaxDraft(String(hi));
  }, [lo, hi]);

  const applyMin = useCallback(
    (raw) => {
      const parsed = parseInt(String(raw).replace(/\D/g, ''), 10);
      const next = Number.isFinite(parsed) ? clamp(parsed, min, hi) : min;
      onChangeMin(next);
      if (next > hi) onChangeMax(next);
    },
    [min, hi, onChangeMin, onChangeMax]
  );

  const applyMax = useCallback(
    (raw) => {
      const parsed = parseInt(String(raw).replace(/\D/g, ''), 10);
      const next = Number.isFinite(parsed) ? clamp(parsed, lo, max) : max;
      onChangeMax(next);
      if (next < lo) onChangeMin(next);
    },
    [lo, max, onChangeMin, onChangeMax]
  );

  const handleSlider = (v) => {
    const next = clamp(v, min, max);
    onChangeMax(next);
    if (next < lo) onChangeMin(next);
  };

  return (
    <div className={cn('shop-price-filter', className)}>
      <div className="relative mb-4 pt-1">
        <div className="shop-price-track-gradient pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2" aria-hidden="true" />
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={hi}
          onChange={(e) => handleSlider(Number(e.target.value))}
          className="shop-price-range relative z-10 w-full"
          aria-label="Maximum price on scale"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted">Min</span>
          <input
            type="text"
            inputMode="numeric"
            value={minDraft}
            onChange={(e) => setMinDraft(e.target.value)}
            onBlur={() => applyMin(minDraft)}
            onKeyDown={(e) => e.key === 'Enter' && applyMin(minDraft)}
            className="neo-input w-full px-2.5 py-2 text-sm"
            aria-label="Minimum price"
            placeholder={formatInr(min)}
          />
        </div>
        <div>
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted">Max</span>
          <input
            type="text"
            inputMode="numeric"
            value={maxDraft}
            onChange={(e) => setMaxDraft(e.target.value)}
            onBlur={() => applyMax(maxDraft)}
            onKeyDown={(e) => e.key === 'Enter' && applyMax(maxDraft)}
            className="neo-input w-full px-2.5 py-2 text-sm"
            aria-label="Maximum price"
            placeholder={formatInr(max)}
          />
        </div>
      </div>

      <p className="mt-2.5 text-center text-xs text-muted">
        {formatInr(lo)} to {formatInr(hi)}
      </p>
    </div>
  );
}
