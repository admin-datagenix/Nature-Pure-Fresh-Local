import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { TRUST_FEATURES } from '../../utils/helpers';

const DEFAULT_STATS = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '8+', label: 'Fruit Varieties' },
  { value: '98%', label: 'Customer Satisfaction' },
];

function TrustIcon({ type }) {
  const cls = 'h-5 w-5 text-[#6b6b6b]';
  switch (type) {
    case 'flask':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 3h6v7l4 9a2 2 0 01-2 2H7a2 2 0 01-2-2l4-9V3z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 3h6" strokeLinecap="round" />
        </svg>
      );
    case 'drop':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 3c3 5 7 8.5 7 12a7 7 0 11-14 0c0-3.5 4-7 7-12z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'leaf':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="7" />
          <path d="M11 8c-2 3-2 6 0 9M11 8c2 3 2 6 0 9M8 11h6" strokeLinecap="round" />
        </svg>
      );
    case 'expert':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="8" r="3" />
          <path d="M6 20v-1a4 4 0 014-4h4a4 4 0 014 4v1" strokeLinecap="round" />
          <path d="M16 4l2 1M18 7l2-1" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function TrustCard() {
  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    api.getStats()
      .then((res) => {
        const d = res.data;
        setStats([
          { value: d.happyCustomers, label: 'Happy Customers' },
          { value: `${d.productCount}+`, label: 'Fruit Varieties' },
          { value: d.satisfactionRate, label: 'Customer Satisfaction' },
        ]);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative z-10 -mt-14 px-4 md:-mt-20 md:px-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_-12px_rgba(45,62,46,0.18)]">
        {/* Top — feature highlights */}
        <div className="grid grid-cols-1 gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 lg:px-10 lg:py-12">
          {TRUST_FEATURES.map((f) => (
            <div key={f.title} className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3f3f3]">
                <TrustIcon type={f.icon} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1a1a1a]">{f.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#777]">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom — stats bar */}
        <div className="relative overflow-hidden bg-[#5b6743] px-6 py-9 md:px-10 md:py-10">
          <span className="pointer-events-none absolute -bottom-2 left-2 text-5xl opacity-20">🍃</span>
          <span className="pointer-events-none absolute -bottom-2 right-2 text-5xl opacity-20">🍃</span>

          <div className="relative flex flex-col divide-y divide-white/15 sm:flex-row sm:divide-x sm:divide-y-0">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-1 flex-col items-center py-4 text-center first:pt-0 last:pb-0 sm:py-0">
                <span className="font-heading text-3xl font-bold text-white md:text-4xl">{s.value}</span>
                <span className="mt-1 text-sm text-white/85">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
