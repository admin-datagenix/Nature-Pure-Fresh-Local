import { cn } from '../../lib/cn';

/** Same size/radius as ProductPage `BTN_OUTLINE`; border via `.coming-soon-btn` in CSS. */
const BTN_OUTLINE =
  'neo-btn-ghost inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed';

function ClockIcon({ className }) {
  return (
    <svg
      className={cn('h-4 w-4 shrink-0 opacity-90', className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Disabled purchase CTA — same border/radius as Buy now (`neo-btn-ghost`).
 */
export default function ComingSoonButton({ className, compact = false }) {
  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      className={cn(
        BTN_OUTLINE,
        'coming-soon-btn cursor-not-allowed',
        compact &&
          'min-h-10 w-full min-w-0 whitespace-nowrap px-2 py-2 text-[0.8125rem] font-semibold',
        className
      )}
    >
      <ClockIcon className={compact ? 'h-4 w-4' : 'h-[1.125rem] w-[1.125rem]'} />
      Coming soon
    </button>
  );
}
