import {
  Children,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '../../lib/cn';

function ChevronDown({ className, open }) {
  return (
    <svg
      className={cn('h-4 w-4 transition-transform duration-200', open && 'rotate-180', className)}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 7.5l5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function parseOptions(children) {
  return Children.toArray(children)
    .map((child) => {
      if (!child || typeof child !== 'object' || !('props' in child)) return null;
      const { value, disabled, children: label } = child.props;
      const val = value ?? '';
      let text = val;
      if (typeof label === 'string' || typeof label === 'number') text = String(label);
      else if (label != null) text = String(label);
      return { value: val, label: text, disabled: Boolean(disabled) };
    })
    .filter(Boolean);
}

export default function NeoSelect({
  className,
  wrapperClassName,
  children,
  value,
  onChange,
  name,
  id: idProp,
  required,
  disabled,
  placeholder,
  'aria-label': ariaLabel,
}) {
  const autoId = useId();
  const id = idProp || autoId;
  const listboxId = `${id}-listbox`;

  const options = useMemo(() => parseOptions(children), [children]);
  const selected = options.find((o) => o.value === value);
  const displayLabel =
    selected?.label ||
    placeholder ||
    options.find((o) => o.value === '')?.label ||
    'Select';

  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const listRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  const commit = useCallback(
    (nextValue) => {
      if (disabled) return;
      onChange?.({ target: { value: nextValue, name } });
      close();
    },
    [close, disabled, name, onChange]
  );

  useEffect(() => {
    if (!open) return undefined;
    const onDocPointer = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) close();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onDocPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector('[data-selected="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [open]);

  const showPlaceholderTone = !selected || selected.value === '';

  return (
    <div ref={rootRef} className={cn('relative min-w-0', wrapperClassName)}>
      {name != null && (
        <input
          type="hidden"
          name={name}
          value={value ?? ''}
          required={required}
          tabIndex={-1}
          aria-hidden="true"
        />
      )}

      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={cn(
          'neo-input neo-select-trigger flex w-full items-center justify-between gap-2 text-left text-sm',
          showPlaceholderTone && 'text-muted',
          !showPlaceholderTone && 'text-primary',
          disabled && 'cursor-not-allowed opacity-60',
          className
        )}
      >
        <span className="min-w-0 truncate">{displayLabel}</span>
        <ChevronDown open={open} className="shrink-0 text-muted" />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={id}
          className="neo-select-panel absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-60 overflow-y-auto py-1"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li key={opt.value === '' ? '__empty' : opt.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  data-selected={isSelected ? 'true' : undefined}
                  disabled={opt.disabled}
                  onClick={() => commit(opt.value)}
                  className={cn(
                    'neo-select-option w-full px-4 py-2.5 text-left text-sm transition-colors',
                    isSelected && 'neo-select-option-active',
                    opt.disabled && 'cursor-not-allowed opacity-50'
                  )}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
