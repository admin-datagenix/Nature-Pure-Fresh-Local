import { Link } from 'react-router-dom';
import { BRAND_NAME } from '../../api/client';
import { cn } from '../../lib/cn';

export function AuthField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  required = true,
  rightSlot,
  inputMode,
  maxLength,
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-sm font-medium text-primary">{label}</span>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          inputMode={inputMode}
          maxLength={maxLength}
          className={cn(
            'w-full rounded-xl border border-[#e8e4df] bg-white px-4 py-3 text-sm text-[#3a3a3a] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10',
            rightSlot && 'pr-12'
          )}
        />
        {rightSlot && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightSlot}</div>
        )}
      </div>
    </label>
  );
}

export function AuthTextArea({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  required = true,
  rows = 3,
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-sm font-medium text-primary">{label}</span>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        rows={rows}
        className="w-full resize-none rounded-xl border border-[#e8e4df] bg-white px-4 py-3 text-sm text-[#3a3a3a] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </label>
  );
}

export function PasswordToggle({ visible, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-lg p-1.5 text-[#6b6b6b] transition hover:bg-cream hover:text-primary"
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

export function AuthModeTabs({ mode, onChange }) {
  return (
    <div className="mb-4 grid grid-cols-2 gap-2">
      {[
        { id: 'email', label: 'Email' },
        { id: 'mobile', label: 'Mobile No' },
      ].map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'rounded-xl py-2.5 text-sm font-semibold transition',
            mode === tab.id
              ? 'bg-primary text-white'
              : 'border border-[#e8e4df] bg-white text-[#6b6b6b] hover:border-primary hover:text-primary'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12 md:px-6">
      <div className="mb-8 text-center">
        <Link to="/" className="inline-flex items-center gap-2 font-heading text-xl font-semibold text-primary">
          <span className="text-2xl">🍃</span>
          {BRAND_NAME}
        </Link>
        <h1 className="mt-6 font-heading text-3xl font-semibold text-primary">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-[#6b6b6b]">{subtitle}</p>}
      </div>

      <div className="rounded-2xl border border-[#e8e4df] bg-white p-6 shadow-[0_8px_30px_rgba(45,62,46,0.06)] md:p-8">
        {children}
      </div>

      {footer && <div className="mt-6 text-center text-sm text-[#6b6b6b]">{footer}</div>}
    </div>
  );
}

export function AuthError({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-xl border border-strawberry/20 bg-strawberry/5 px-4 py-3 text-sm text-strawberry" role="alert">
      {message}
    </div>
  );
}

export function AuthSubmitButton({ loading, children, className }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={cn(
        'w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
    >
      {loading ? 'Please wait…' : children}
    </button>
  );
}

export function PhoneField({ id, label, value, onChange }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-sm font-medium text-primary">{label}</span>
      <div className="flex overflow-hidden rounded-xl border border-[#e8e4df] bg-white transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
        <span className="flex items-center border-r border-[#e8e4df] bg-cream px-3 text-sm font-medium text-primary">
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
          className="w-full px-4 py-3 text-sm text-[#3a3a3a] outline-none"
        />
      </div>
    </label>
  );
}

export function OtpInput({ value, onChange }) {
  return (
    <label htmlFor="otp" className="block">
      <span className="mb-1.5 block text-sm font-medium text-primary">Enter 6-digit OTP</span>
      <input
        id="otp"
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
        placeholder="• • • • • •"
        autoComplete="one-time-code"
        required
        className="w-full rounded-xl border border-[#e8e4df] bg-white px-4 py-3 text-center text-2xl tracking-[0.45em] text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </label>
  );
}

export function formatIndianPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  const normalized = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
  if (normalized.length !== 10) return phone;
  return `+91 ${normalized.slice(0, 5)} ${normalized.slice(5)}`;
}
