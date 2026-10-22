import { cn } from '../../lib/cn';

const STEPS = [
  { id: 1, label: 'Cart' },
  { id: 2, label: 'Delivery' },
  { id: 3, label: 'Payment' },
  { id: 4, label: 'Confirm' },
];

export default function StepIndicator({ currentStep }) {
  return (
    <nav aria-label="Checkout progress" className="checkout-steps mx-auto mb-3 w-full max-w-3xl px-1 sm:mb-4 lg:max-w-4xl">
      <ol className="flex w-full items-start">
        {STEPS.map((step, i) => {
          const isActive = currentStep === step.id;
          const isComplete = currentStep > step.id;
          const isLast = i === STEPS.length - 1;
          const prevComplete = i > 0 && currentStep > STEPS[i - 1].id;

          return (
            <li key={step.id} className="flex min-w-0 flex-1 flex-col items-center">
              <div className="flex h-8 w-full items-center">
                <span
                  aria-hidden
                  className={cn(
                    'checkout-steps__line h-0.5 min-w-0 flex-1',
                    i === 0 ? 'opacity-0' : prevComplete ? 'bg-secondary' : 'bg-sage/50'
                  )}
                />
                <div
                  className={cn(
                    'checkout-steps__dot relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold leading-none tabular-nums transition',
                    isComplete && 'bg-secondary text-white',
                    isActive && 'border-2 border-secondary bg-white text-secondary',
                    !isActive && !isComplete && 'border-2 border-sage/55 bg-white text-primary/70'
                  )}
                >
                  {isComplete ? (
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  aria-hidden
                  className={cn(
                    'checkout-steps__line h-0.5 min-w-0 flex-1',
                    isLast ? 'opacity-0' : isComplete ? 'bg-secondary' : 'bg-sage/50'
                  )}
                />
              </div>
              <span
                className={cn(
                  'mt-2 max-w-[4.5rem] text-center text-[0.65rem] font-semibold leading-tight sm:max-w-none sm:text-xs',
                  isActive || isComplete ? 'text-primary' : 'text-muted'
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
