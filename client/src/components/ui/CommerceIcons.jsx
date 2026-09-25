export function CartIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3 3h2l1.2 6.4a2 2 0 002 1.6h7.6a2 2 0 001.95-1.55L18 6H6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="16" r="1.2" fill="currentColor" />
      <circle cx="15" cy="16" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function BuyNowIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M7 8V6.5a3 3 0 016 0V8M5 8h10l-.9 7.2a1 1 0 01-1 .8H6.9a1 1 0 01-1-.8L5 8z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 11.5l2 2-2 2M14 13.5H9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5 10.5l3.2 3.2L15 6.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
