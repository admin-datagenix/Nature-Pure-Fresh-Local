import { cn } from '../../lib/cn';

export default function ShopViewToggle({ view, onChange }) {
  return (
    <div
      className="inline-flex rounded-full border border-sage/55 bg-white p-0.5"
      role="group"
      aria-label="Product view"
    >
      <button
        type="button"
        onClick={() => onChange('grid')}
        aria-pressed={view === 'grid'}
        className={cn(
          'rounded-full px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm',
          view === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-primary'
        )}
      >
        Grid
      </button>
      <button
        type="button"
        onClick={() => onChange('list')}
        aria-pressed={view === 'list'}
        className={cn(
          'rounded-full px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm',
          view === 'list' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-primary'
        )}
      >
        List
      </button>
    </div>
  );
}
