import { cn } from '../../lib/cn';

const STEPS = [
  { id: 1, label: 'Cart' },
  { id: 2, label: 'Shipping' },
  { id: 3, label: 'Payment' },
  { id: 4, label: 'Confirm' },
];

export default function StepIndicator({ currentStep }) {
  return (
    <nav aria-label="Checkout progress" className="mb-10">
      <ol className="flex items-center justify-between">
        {STEPS.map((step, i) => {
          const isActive = currentStep === step.id;
          const isComplete = currentStep > step.id;
          const isLast = i === STEPS.length - 1;

          return (
            <li key={step.id} className={cn('flex flex-1 items-center', isLast && 'flex-none')}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-500',
                    isComplete && 'bg-secondary text-white',
                    isActive && 'animate-glow-pulse bg-primary text-white ring-4 ring-secondary/25',
                    !isActive && !isComplete && 'bg-cream-dark text-muted shadow-[inset_2px_2px_6px_rgba(61,96,73,0.06)]'
                  )}
                >
                  {isComplete ? (
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={cn(
                    'mt-2 hidden text-xs font-semibold sm:block',
                    isActive || isComplete ? 'text-primary' : 'text-muted'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {!isLast && (
                <div className="mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-cream-dark sm:mx-4">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-700',
                      isComplete ? 'step-connector-active w-full' : 'w-0 bg-secondary'
                    )}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
