import { cn } from '../../lib/cn';

function StepIcon({ state }) {
  if (state === 'complete') {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-white">
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  if (state === 'current') {
    return (
      <span className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-secondary bg-white">
        <span className="h-2 w-2 rounded-full bg-secondary" />
      </span>
    );
  }
  return <span className="block h-6 w-6 rounded-full border-2 border-sage/55 bg-cream/80" />;
}

export default function CompactOrderTrackStepper({ steps }) {
  return (
    <div className="order-track-stepper -mx-1 overflow-x-auto pb-1">
      <ol className="flex min-w-[28rem] items-start justify-between gap-0 px-1">
        {steps.map((step, index) => {
          const lineActive = step.state === 'complete';

          return (
            <li key={step.id} className="relative flex min-w-0 flex-1 flex-col items-center text-center">
              {index < steps.length - 1 ? (
                <span
                  aria-hidden
                  className={cn(
                    'absolute left-[calc(50%+0.75rem)] top-3 h-0.5 w-[calc(100%-1.5rem)] -translate-y-1/2',
                    lineActive ? 'bg-secondary/70' : 'bg-sage/45'
                  )}
                />
              ) : null}
              <StepIcon state={step.state} />
              <p
                className={cn(
                  'mt-1.5 w-full px-0.5 text-[0.62rem] font-semibold leading-tight',
                  step.state === 'upcoming' ? 'text-muted' : 'text-primary'
                )}
              >
                {step.short}
              </p>
              {step.caption ? (
                <p className="mt-0.5 w-full px-0.5 text-[0.58rem] leading-snug text-muted">{step.caption}</p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
