import { cn } from '../../lib/cn';

export default function OrderModalShell({
  children,
  className,
  titleId,
  onDismiss,
  wide = false,
}) {
  return (
    <div className="order-success-overlay fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-primary/45 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onDismiss}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'order-success-modal relative z-[101] flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-sage/50 bg-white shadow-[0_24px_60px_rgba(41,70,51,0.22)] sm:rounded-2xl',
          wide ? 'max-w-md sm:max-w-lg' : 'max-w-[22rem] sm:max-w-sm',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
