import BrandLogo from '../ui/BrandLogo';
import { cn } from '../../lib/cn';
import {
  authPage,
  authCard,
  authCardCompact,
  authInput,
  authButton,
  authToggleTrack,
  authToggleTrackCompact,
  authToggleActive,
  authToggleInactive,
  authFieldIcon,
  authFieldWrap,
} from './authTheme';
import { AuthSceneBackground } from './AuthSceneDecor';

/* ── Lucide-style line icons ── */
const iconStroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function UserIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...iconStroke} aria-hidden="true">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LockIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...iconStroke} aria-hidden="true">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function PhoneIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...iconStroke} aria-hidden="true">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function MailIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...iconStroke} aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function MapPinIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...iconStroke} aria-hidden="true">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function EyeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

const ICON_MAP = { user: UserIcon, lock: LockIcon, phone: PhoneIcon, mail: MailIcon, map: MapPinIcon };

function FieldIcon({ icon, tall = false }) {
  const Icon = ICON_MAP[icon] || UserIcon;
  return (
    <Icon
      className={cn(
        'pointer-events-none absolute left-5 h-[18px] w-[18px]',
        tall ? 'top-3.5' : 'top-1/2 -translate-y-1/2',
        authFieldIcon
      )}
    />
  );
}

/* ── Centered auth card layout (login + register) ── */
export function AuthSplitLayout({ children, compact = false }) {
  return (
    <div className={authPage}>
      <AuthSceneBackground />

      <div className={cn('relative z-10 flex h-full items-center justify-center overflow-y-auto px-5 sm:px-6 md:px-8', compact ? 'py-4' : 'py-8')}>
        <div className={cn(compact ? authCardCompact : authCard, 'relative z-30 w-full')}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Header ── */
export function AuthPageHeader({ title, subtitle, showBrand = true, compact = false }) {
  return (
    <header className={cn('text-center', compact ? 'mb-3.5' : 'mb-7')}>
      {showBrand && (
        <div className={cn('flex justify-center', compact ? 'mb-3' : 'mb-5')}>
          <BrandLogo logoOnly className="justify-center" imageClassName={compact ? 'max-w-[200px]' : 'max-w-[250px]'} />
        </div>
      )}
      <h1 className={cn('font-bold leading-tight tracking-tight text-[#294633]', compact ? 'text-[1.4rem]' : 'text-[1.75rem]')}>
        {title}
      </h1>
      {subtitle && (
        <p className={cn('text-[#7C8A80]', compact ? 'mt-1 text-sm' : 'mt-2 text-[0.9375rem]')}>{subtitle}</p>
      )}
    </header>
  );
}

export function AuthModeTabs({ mode, onChange, compact = false }) {
  return (
    <div className={compact ? authToggleTrackCompact : authToggleTrack} role="tablist" aria-label="Login method">
      {[
        { id: 'email', label: 'Email' },
        { id: 'mobile', label: 'Mobile' },
      ].map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={mode === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex-1 rounded-full text-[0.9375rem] font-semibold transition-all duration-200',
            mode === tab.id ? authToggleActive : authToggleInactive
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function AuthStepTabs({ step, labels, compact = false }) {
  return (
    <div className={compact ? authToggleTrackCompact : authToggleTrack}>
      {labels.map((label, i) => {
        const active = step === i + 1;
        return (
          <span
            key={label}
            className={cn(
              'flex flex-1 items-center justify-center rounded-full text-center text-xs font-semibold sm:text-sm',
              active ? authToggleActive : authToggleInactive
            )}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}

/* ── Fields ── */
export function ClayAuthField({
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  autoComplete,
  required = true,
  icon = 'user',
  rightSlot,
  inputMode,
  maxLength,
  label,
}) {
  const fieldLabel = label || placeholder;

  return (
    <div className={authFieldWrap}>
      <label htmlFor={id} className="sr-only">
        {fieldLabel}
      </label>
      <FieldIcon icon={icon} />
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
        className={cn(authInput, 'pl-12', rightSlot ? 'pr-12' : 'pr-5')}
      />
      {rightSlot && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
      )}
    </div>
  );
}

export function ClayTextArea({
  id,
  placeholder,
  value,
  onChange,
  autoComplete,
  required = true,
  rows = 3,
  label,
}) {
  return (
    <div className={authFieldWrap}>
      <label htmlFor={id} className="sr-only">
        {label || placeholder}
      </label>
      <FieldIcon icon="map" tall />
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        rows={rows}
        className={cn(
          authInput,
          'h-auto min-h-[68px] resize-none rounded-[24px] py-3.5 pl-12 pr-5 leading-relaxed'
        )}
      />
    </div>
  );
}

export function ClayPhoneField({ id, value, onChange, placeholder = 'Mobile number' }) {
  return (
    <div className={authFieldWrap}>
      <label htmlFor={id} className="sr-only">
        Mobile number
      </label>
      <FieldIcon icon="phone" />
      <span className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 text-[0.9375rem] font-medium text-[#3D6049]">
        +91
      </span>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
        placeholder={placeholder}
        autoComplete="tel"
        required
        className={cn(authInput, 'pl-[5.25rem] pr-5')}
      />
    </div>
  );
}

export function ClayOtpInput({ value, onChange }) {
  return (
    <ClayAuthField
      id="otp"
      icon="lock"
      inputMode="numeric"
      maxLength={6}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
      placeholder="Enter 6-digit OTP"
      label="One-time password"
      autoComplete="one-time-code"
    />
  );
}

export function PasswordToggle({ visible, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-full p-2 text-[#7C8A80] transition hover:text-[#3D6049]"
      aria-label={visible ? 'Hide password' : 'Show password'}
    >
      {visible ? <EyeOffIcon className="h-[1.125rem] w-[1.125rem]" /> : <EyeIcon className="h-[1.125rem] w-[1.125rem]" />}
    </button>
  );
}

export function ClaySubmitButton({ loading, children }) {
  return (
    <button type="submit" disabled={loading} className={authButton}>
      {loading ? 'Please wait…' : children}
    </button>
  );
}

export function AuthError({ message, compact = false }) {
  if (!message) return null;
  return (
    <div
      className={cn(
        'rounded-xl border border-strawberry/15 bg-strawberry/5 px-3 text-sm text-strawberry',
        compact ? 'mb-2.5 py-2' : 'mb-5 py-3'
      )}
      role="alert"
    >
      {message}
    </div>
  );
}

export function AuthSuccess({ message }) {
  if (!message) return null;
  return (
    <div className="mb-5 rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-primary" role="status">
      {message}
    </div>
  );
}

export function AuthOtpStatus({ otpSent, otpExpiresIn, otpExpired, resendIn, onResend, resendDisabled }) {
  if (!otpSent) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-[#7C8A80]">
      <span>
        {otpExpired ? (
          <span className="font-medium text-strawberry">OTP expired — request a new one</span>
        ) : (
          <>OTP expires in <strong className="text-[#294633]">{Math.floor(otpExpiresIn / 60)}:{String(otpExpiresIn % 60).padStart(2, '0')}</strong></>
        )}
      </span>
      <button
        type="button"
        onClick={onResend}
        disabled={resendDisabled || resendIn > 0}
        className="shrink-0 font-medium text-[#294633] hover:underline disabled:opacity-50"
      >
        {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend OTP'}
      </button>
    </div>
  );
}

export function AuthHint({ children }) {
  return (
    <p className="rounded-full bg-[#EEF2EA] px-4 py-2.5 text-center text-xs leading-relaxed text-[#7C8A80] shadow-[inset_2px_2px_6px_rgba(61,96,73,0.05)]">
      {children}
    </p>
  );
}

export function AuthFooter({ children, compact = false }) {
  return (
    <p className={cn('text-center text-sm text-[#7C8A80]', compact ? 'mt-3.5' : 'mt-7')}>
      {children}
    </p>
  );
}

export const FloatingAuthField = ClayAuthField;
export const FloatingTextArea = ClayTextArea;
export const FloatingPhoneField = ClayPhoneField;
export const FloatingOtpInput = ClayOtpInput;
