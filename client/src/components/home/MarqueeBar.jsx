import { MARQUEE_OFFERS } from '../../utils/helpers';

/** Infinite horizontal offer strip — clipped so the page does not scroll sideways. */
export default function MarqueeBar() {
  const items = [...MARQUEE_OFFERS, ...MARQUEE_OFFERS];

  return (
    <div className="marquee-bar w-full max-w-full shrink-0 overflow-hidden bg-primary py-2.5">
      <div
        className="flex w-max animate-marquee items-center motion-reduce:animate-none"
        aria-hidden="true"
      >
        {items.map((badge, i) => (
          <span
            key={`${badge}-${i}`}
            className="flex shrink-0 items-center gap-2 px-5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/90 sm:px-8 sm:text-xs sm:tracking-[0.15em]"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
            {badge}
          </span>
        ))}
      </div>
      <p className="sr-only">{MARQUEE_OFFERS.join('. ')}</p>
    </div>
  );
}
