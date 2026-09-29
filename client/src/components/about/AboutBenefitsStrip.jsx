import { ABOUT_BENEFITS } from '../../data/aboutBenefits';

function BenefitIcon({ id }) {
  const common = 'h-6 w-6 sm:h-7 sm:w-7';
  switch (id) {
    case 'real-fruit':
      return (
        <svg className={common} viewBox="0 0 32 32" fill="none" aria-hidden>
          <circle cx="14" cy="18" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M14 12V9M11 8c1-2 4-2 5 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="22" cy="14" r="3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'easy-mix':
      return (
        <svg className={common} viewBox="0 0 32 32" fill="none" aria-hidden>
          <path d="M8 20h16l-2 6H10l-2-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M16 8v8M13 11l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'smoothies':
      return (
        <svg className={common} viewBox="0 0 32 32" fill="none" aria-hidden>
          <path d="M12 8h8v14a4 4 0 0 1-8 0V8Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M14 6h4M20 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'travel':
      return (
        <svg className={common} viewBox="0 0 32 32" fill="none" aria-hidden>
          <rect x="9" y="11" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M13 11V9a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    default:
      return null;
  }
}

export default function AboutBenefitsStrip() {
  return (
    <div
      className="grid w-full shrink-0 grid-cols-2 gap-px overflow-hidden rounded-lg bg-white/25 text-white sm:grid-cols-4 lg:grid-cols-4"
      role="list"
      aria-label="Product benefits"
    >
      {ABOUT_BENEFITS.map((item) => (
        <div
          key={item.id}
          className="flex min-w-0 flex-col items-center gap-1.5 bg-primary px-1 py-2.5 text-center sm:gap-2 sm:px-2 sm:py-3"
          role="listitem"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-white/85 sm:h-10 sm:w-10">
            <BenefitIcon id={item.id} />
          </div>
          <p className="text-[0.5625rem] font-bold leading-tight sm:text-[0.6875rem]">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
