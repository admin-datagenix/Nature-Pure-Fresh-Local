import { Link } from 'react-router-dom';
import { Mango, Banana, Jamun, Grapes, Strawberry } from '../ui/FruitArt';
import { BRAND_NAME } from '../../api/client';
import { cn } from '../../lib/cn';

const AUTH_NAV = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About Us' },
];

export function AuthSplitLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-cream via-white to-secondary/15 lg:flex lg:w-[42%] xl:w-[44%]">
        <div className="pointer-events-none absolute -left-10 top-16 h-56 w-56 rounded-full bg-mango/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-20 right-0 h-64 w-64 rounded-full bg-secondary/15 blur-3xl" />

        <div className="relative flex w-full flex-col justify-between p-10 xl:p-14">
          <Link to="/" className="inline-flex items-center gap-2 font-heading text-xl font-semibold text-primary">
            <span className="text-2xl">🍃</span>
            {BRAND_NAME}
          </Link>

          <div className="relative mx-auto aspect-square w-full max-w-[420px]">
            <Mango className="absolute left-[4%] top-[8%] h-[38%] w-[38%] -rotate-12 drop-shadow-xl" />
            <Strawberry className="absolute right-[2%] top-[14%] h-[34%] w-[34%] rotate-6 drop-shadow-xl" />
            <Banana className="absolute bottom-[18%] left-[0%] h-[32%] w-[32%] -rotate-6 drop-shadow-xl" />
            <Jamun className="absolute bottom-[8%] right-[18%] h-[28%] w-[28%] drop-shadow-xl" />
            <Grapes className="absolute left-[32%] top-[38%] h-[36%] w-[36%] drop-shadow-xl" />
          </div>

          <p className="max-w-sm text-sm leading-relaxed text-[#6b6b6b]">
            100% real fruit snacks — freeze-dried to lock in flavour, crunch and natural goodness.
          </p>
        </div>
      </div>

      <div className="relative flex min-h-screen flex-1 flex-col bg-white">
        <div className="flex items-center justify-end gap-6 px-6 py-6 md:px-10 md:py-8">
          {AUTH_NAV.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-secondary transition hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-12 md:px-12 lg:px-16 xl:px-20">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function AuthModeTabs({ mode, onChange }) {
  return (
    <div className="mb-6 flex rounded-full bg-cream p-1">
      {[
        { id: 'email', label: 'Email' },
        { id: 'mobile', label: 'Mobile No' },
      ].map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex-1 rounded-full py-2.5 text-sm font-semibold transition',
            mode === tab.id ? 'bg-white text-primary shadow-sm' : 'text-[#6b6b6b] hover:text-primary'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function PasswordToggle({ visible, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-full p-1.5 text-secondary transition hover:bg-cream hover:text-primary"
      aria-label={visible ? 'Hide password' : 'Show password'}
    >
      {visible ? (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 4.24A10.94 10.94 0 0112 5c5 0 9.27 3.11 11 7-1.02 2.28-2.77 4.18-4.94 5.36M6.11 6.11C4.06 7.45 2.5 9.58 1.5 12c1.73 3.89 6 7 10.5 7 1.06 0 2.08-.16 3.03-.45" strokeLinecap="round" />
        </svg>
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" strokeLinecap="round" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );
}

export function FloatingAuthField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  required = true,
  rightSlot,
  inputMode,
  maxLength,
}) {
  return (
    <label htmlFor={id} className="relative block">
      <span className="pointer-events-none absolute left-5 top-2.5 z-10 text-[0.65rem] font-semibold uppercase tracking-wide text-secondary">
        {label}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        inputMode={inputMode}
        maxLength={maxLength}
        className={cn(
          'w-full rounded-full border border-secondary/25 bg-cream/80 px-5 pb-3.5 pt-7 text-sm font-medium text-primary outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10',
          rightSlot && 'pr-12'
        )}
      />
      {rightSlot && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pt-2">{rightSlot}</div>
      )}
    </label>
  );
}

export function FloatingTextArea({
  id,
  label,
  value,
  onChange,
  autoComplete,
  required = true,
  rows = 3,
}) {
  return (
    <label htmlFor={id} className="relative block">
      <span className="pointer-events-none absolute left-5 top-2.5 z-10 text-[0.65rem] font-semibold uppercase tracking-wide text-secondary">
        {label}
      </span>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        rows={rows}
        className="w-full resize-none rounded-[1.5rem] border border-secondary/25 bg-cream/80 px-5 pb-3.5 pt-7 text-sm font-medium text-primary outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
      />
    </label>
  );
}

export function FloatingPhoneField({ id, label, value, onChange }) {
  return (
    <label htmlFor={id} className="relative block">
      <span className="pointer-events-none absolute left-[4.5rem] top-2.5 z-10 text-[0.65rem] font-semibold uppercase tracking-wide text-secondary">
        {label}
      </span>
      <div className="flex overflow-hidden rounded-full border border-secondary/25 bg-cream/80 transition focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
        <span className="flex items-center border-r border-secondary/20 bg-cream px-4 pb-3.5 pt-7 text-sm font-semibold text-primary">
          +91
        </span>
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
          placeholder="9876543210"
          autoComplete="tel"
          required
          className="w-full bg-transparent px-4 pb-3.5 pt-7 text-sm font-medium text-primary outline-none"
        />
      </div>
    </label>
  );
}

export function AuthDivider({ label = 'OR' }) {
  return (
    <div className="flex items-center gap-4">
      <span className="h-px flex-1 bg-secondary/25" />
      <span className="text-xs font-bold tracking-widest text-secondary">{label}</span>
      <span className="h-px flex-1 bg-secondary/25" />
    </div>
  );
}
