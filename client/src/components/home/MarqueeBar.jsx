import { MARQUEE_OFFERS } from '../../utils/helpers';

/** Static offer strip — no horizontal animation (prevents page sideways drift). */
export default function MarqueeBar() {
  return (
    <div className="w-full max-w-full shrink-0 overflow-hidden bg-primary py-2.5">
      <ul className="site-container flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 sm:gap-x-8">
        {MARQUEE_OFFERS.map((badge) => (
          <li
            key={badge}
            className="flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/90 sm:text-xs sm:tracking-[0.15em]"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" aria-hidden="true" />
            {badge}
          </li>
        ))}
      </ul>
    </div>
  );
}
