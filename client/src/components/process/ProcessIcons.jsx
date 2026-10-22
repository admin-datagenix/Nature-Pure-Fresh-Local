export function ProcessIcon({ name, className = 'h-6 w-6' }) {
  const icons = {
    leaf: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 21c-4-4-6-8-6-12a6 6 0 0112 0c0 4-2 8-6 12z" strokeLinecap="round" />
        <path d="M12 21V9" strokeLinecap="round" />
      </svg>
    ),
    heart: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 20s-6-3.5-6-9a4 4 0 117 0 4 4 0 117 0c0 5.5-6 9-6 9z" />
        <path d="M12 8v4M10 10h4" strokeLinecap="round" />
      </svg>
    ),
    beaker: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M9 3h6M10 3v6l-4 9a2 2 0 001.8 3h10.4a2 2 0 001.8-3l-4-9V3" strokeLinejoin="round" />
      </svg>
    ),
    shield: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    aroma: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M8 16c0-3 2-5 4-5s4 2 4 5" strokeLinecap="round" />
        <path d="M12 4v3M9 6l1.5 2M15 6l-1.5 2" strokeLinecap="round" />
      </svg>
    ),
    calendar: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16" strokeLinecap="round" />
      </svg>
    ),
    feather: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M20 4C14 4 8 10 6 20c6-2 12-8 14-16z" strokeLinejoin="round" />
      </svg>
    ),
    hand: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M8 11V6a2 2 0 114 0v5M12 11V5a2 2 0 114 0v8" strokeLinecap="round" />
        <path d="M8 14v2a4 4 0 008 0v-5" strokeLinecap="round" />
      </svg>
    ),
    snow: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 2v20M4 6l16 12M20 6L4 18M2 12h20" strokeLinecap="round" />
      </svg>
    ),
    gear: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
      </svg>
    ),
    fruit: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 21c-5-3-7-7-7-11a7 7 0 0114 0c0 4-2 8-7 11z" />
        <path d="M12 8c2-3 5-4 7-3" strokeLinecap="round" />
      </svg>
    ),
    badge: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 3l2.5 5 5.5.8-4 3.9 1 5.5L12 16.5 7 18.2l1-5.5-4-3.9 5.5-.8L12 3z" strokeLinejoin="round" />
      </svg>
    ),
  };
  return icons[name] || icons.leaf;
}
