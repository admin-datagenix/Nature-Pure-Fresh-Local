const ICONS = {
  vegan: (
    <svg viewBox="0 0 24 24" fill="none" className="h-[1.35rem] w-[1.35rem]" aria-hidden="true">
      <path
        d="M12 3c-1.2 4.2-4.2 6.2-4.2 10.2a4.2 4.2 0 108.4 0C16.2 9.2 13.2 7.2 12 3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  glutenFree: (
    <svg viewBox="0 0 24 24" fill="none" className="h-[1.35rem] w-[1.35rem]" aria-hidden="true">
      <path d="M6 18l12-12M8 6h8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  nonFried: (
    <svg viewBox="0 0 24 24" fill="none" className="h-[1.35rem] w-[1.35rem]" aria-hidden="true">
      <path d="M4 14h16M7 10l5-6 5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 14v4h6v-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  realFruit: (
    <svg viewBox="0 0 24 24" fill="none" className="h-[1.35rem] w-[1.35rem]" aria-hidden="true">
      <circle cx="12" cy="13" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7V4M10 4h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  noSugar: (
    <svg viewBox="0 0 24 24" fill="none" className="h-[1.35rem] w-[1.35rem]" aria-hidden="true">
      <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  zeroPreservatives: (
    <svg viewBox="0 0 24 24" fill="none" className="h-[1.35rem] w-[1.35rem]" aria-hidden="true">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  madeInIndia: (
    <svg viewBox="0 0 24 24" fill="none" className="h-[1.35rem] w-[1.35rem]" aria-hidden="true">
      <rect x="4" y="6" width="16" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  highFibre: (
    <svg viewBox="0 0 24 24" fill="none" className="h-[1.35rem] w-[1.35rem]" aria-hidden="true">
      <path d="M8 20V8l4-4 4 4v12" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6 20h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
};

export default function BenefitFeatureIcon({ name }) {
  return ICONS[name] || ICONS.realFruit;
}
