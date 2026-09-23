import { useMemo } from 'react';
import { cn } from '../../lib/cn';

function buildPriceSteps(min, max) {
  const anchors = [
    min,
    199, 299, 399, 499, 599, 699, 799, 899, 999,
    1099, 1199, 1299, 1399, 1499, 1599, 1699, 1799, 1899, 1999, 2099, max,
  ];
  const steps = [...new Set(anchors.filter((v) => v >= min && v <= max))].sort((a, b) => a - b);
  if (steps[0] !== min) steps.unshift(min);
  if (steps[steps.length - 1] !== max) steps.push(max);
  return steps;
}

function formatInr(n) {
  return `₹${n.toLocaleString('en-IN')}`;
}

function FlipkartSelect({ value, onChange, options, ariaLabel, className }) {
  return (
    <div className={cn('relative min-w-0', className)}>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={ariaLabel}
        className="shop-price-select w-full cursor-pointer"
      >
        {options.map((v) => (
          <option key={v} value={v}>
            {formatInr(v)}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/** Flipkart-style price filter: range slider + min/max dropdowns. */
export default function PriceRangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  onChangeMin,
  onChangeMax,
  className,
}) {
  const steps = useMemo(() => buildPriceSteps(min, max), [min, max]);
  const lo = Math.min(valueMin, valueMax);
  const hi = Math.max(valueMin, valueMax);
  const span = max - min || 1;
  const leftPct = ((lo - min) / span) * 100;
  const widthPct = ((hi - lo) / span) * 100;

  const minOptions = useMemo(() => {
    let opts = steps.filter((v) => v <= hi && v < max);
    if (!opts.includes(lo)) opts = [...opts, lo].sort((a, b) => a - b);
    return opts.length ? opts : [min];
  }, [steps, lo, hi, min, max]);

  const maxOptions = useMemo(() => {
    let opts = steps.filter((v) => v >= lo);
    if (!opts.includes(hi)) opts = [...opts, hi].sort((a, b) => a - b);
    return opts.length ? opts : [max];
  }, [steps, lo, hi, max]);

  const handleMinSelect = (v) => {
    onChangeMin(v);
    if (v > hi) onChangeMax(v);
  };

  const handleMaxSelect = (v) => {
    onChangeMax(v);
    if (v < lo) onChangeMin(v);
  };

  return (
    <div className={cn('shop-price-filter', className)}>
      <div className="relative mb-4 h-6">
        <div className="shop-price-track absolute left-0 right-0 top-1/2 -translate-y-1/2" />
        <div
          className="shop-price-track-active absolute top-1/2 -translate-y-1/2"
          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={10}
          value={lo}
          onChange={(e) => handleMinSelect(Number(e.target.value))}
          className="shop-range-thumb absolute inset-0 z-20 w-full bg-transparent"
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={10}
          value={hi}
          onChange={(e) => handleMaxSelect(Number(e.target.value))}
          className="shop-range-thumb absolute inset-0 z-30 w-full bg-transparent"
          aria-label="Maximum price"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted">Min</span>
          <FlipkartSelect
            value={lo}
            onChange={handleMinSelect}
            options={minOptions}
            ariaLabel="Minimum price"
          />
        </div>
        <div>
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted">Max</span>
          <FlipkartSelect
            value={hi}
            onChange={handleMaxSelect}
            options={maxOptions.length ? maxOptions : [hi]}
            ariaLabel="Maximum price"
          />
        </div>
      </div>

      <p className="mt-2.5 text-center text-xs text-muted">
        {formatInr(lo)} to {formatInr(hi)}
      </p>
    </div>
  );
}
