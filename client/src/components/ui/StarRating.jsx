import { cn } from '../../lib/cn';

const EMPTY = 'text-sage/90';

function StarGlyph({ fill }) {
  if (fill >= 1) {
    return <span className="text-[#f5a623]">★</span>;
  }
  if (fill <= 0) {
    return <span className={EMPTY}>★</span>;
  }
  return (
    <span className="relative inline-block leading-none" aria-hidden="true">
      <span className={EMPTY}>★</span>
      <span
        className="absolute left-0 top-0 overflow-hidden text-[#f5a623]"
        style={{ width: '50%' }}
      >
        ★
      </span>
    </span>
  );
}

/**
 * Golden star row — pass `rating` (e.g. 4.5) for full + half stars, or `filledCount` for whole stars only.
 */
export default function StarRating({
  filledCount,
  rating,
  total = 5,
  size = 'sm',
  className,
}) {
  const sizeCls = size === 'md' ? 'text-base tracking-tight' : 'text-sm tracking-tight';

  const value =
    rating != null && !Number.isNaN(Number(rating))
      ? Math.min(total, Math.max(0, Number(rating)))
      : Math.min(total, Math.max(0, Math.floor(filledCount ?? 0)));

  return (
    <span className={cn('inline-flex items-center gap-px', sizeCls, className)} aria-hidden="true">
      {Array.from({ length: total }, (_, i) => {
        const starFill = Math.min(1, Math.max(0, value - i));
        const displayFill = starFill >= 0.75 ? 1 : starFill >= 0.25 ? 0.5 : 0;
        return <StarGlyph key={i} fill={displayFill} />;
      })}
    </span>
  );
}
