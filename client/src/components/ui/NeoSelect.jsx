import { cn } from '../../lib/cn';

function ChevronDown({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function NeoSelect({ className, wrapperClassName, children, ...props }) {
  return (
    <div className={cn('relative min-w-0', wrapperClassName)}>
      <select
        {...props}
        className={cn(
          'neo-input neo-select w-full cursor-pointer text-sm text-primary',
          className
        )}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
    </div>
  );
}
