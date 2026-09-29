import { cn } from '../../lib/cn';

const STEPS = [
  { id: 1, label: 'Cart' },
  { id: 2, label: 'Address' },
  { id: 3, label: 'Payment' },
  { id: 4, label: 'Summary' },
];

export default function StepIndicator({ currentStep }) {
  return (
    <nav aria-label="Checkout progress" className="checkout-steps mx-auto mb-8 max-w-2xl">
      <ol className="flex items-start justify-between">
        {STEPS.map((step, i) => {
          const isActive = currentStep === step.id;
          const isComplete = currentStep > step.id;
          const isLast = i === STEPS.length - 1;

          return (
            <li key={step.id} className={cn('flex flex-1 items-start', isLast && 'flex-none')}>
              <div className="flex w-full min-w-0 flex-col items-center">
                <div className="relative flex w-full items-center justify-center">
                  {!isLast ? (
                    <span
                      aria-hidden
                      className={cn(
                        'absolute left-[calc(50%+1rem)] top-4 h-0.5 w-[calc(100%-2rem)] -translate-y-1/2',
                        isComplete ? 'bg-secondary' : 'bg-sage/45'
                      )}
                    />
                  ) : null}
                  <div
                    className={cn(
                      'relative z-[1] flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition',
                      isComplete && 'bg-secondary text-white',
                      isActive && 'border-2 border-secondary bg-white text-secondary',
                      !isActive && !isComplete && 'border-2 border-sage/50 bg-white text-muted'
                    )}
                  >
                    {isComplete ? (
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
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
                </div>
                <span
                  className={cn(
                    'mt-2 text-center text-[0.65rem] font-semibold sm:text-xs',
                    isActive || isComplete ? 'text-primary' : 'text-muted'
                  )}
                >
                  {step.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
