import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { TRUST_FEATURES } from '../../utils/helpers';
import { cn } from '../../lib/cn';
import Reveal from '../ui/Reveal';
import TrustFeatureIcon from '../ui/TrustFeatureIcon';

const DEFAULT_STATS = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '8+', label: 'Fruit Varieties' },
  { value: '98%', label: 'Customer Satisfaction' },
];

function TrustFeature({ feature, index, centered }) {
  return (
    <Reveal delay={index * 60}>
      <article
        className={cn(
          'flex flex-col items-center text-center',
          !centered && 'sm:flex-row sm:items-start sm:text-left'
        )}
      >
        <div
          className="mb-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-sage/70 bg-fresh text-secondary shadow-[0_4px_12px_rgba(41,70,51,0.06)]"
          style={{ boxShadow: `0 0 0 1px ${feature.ring || 'transparent'}, 0 4px 12px rgba(41,70,51,0.06)` }}
        >
          <TrustFeatureIcon name={feature.icon} />
        </div>
        <div className={cn('min-w-0', !centered && 'sm:pt-0.5')}>
          <h3 className="text-sm font-semibold text-primary md:text-[0.95rem]">{feature.title}</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">{feature.desc}</p>
        </div>
      </article>
    </Reveal>
  );
}

export default function TrustCard({ overlap = false, embedded = false }) {
  const isFloating = overlap || !embedded;
  const centered = overlap || embedded;
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
    <div className={cn(isFloating && !overlap && 'site-container relative')}>
      <div
        className={cn(
          'relative overflow-hidden bg-white',
          isFloating && 'rounded-[1.75rem] shadow-[0_20px_50px_rgba(41,70,51,0.12)]'
        )}
      >
        <div
          className={cn(
            'grid grid-cols-1 gap-8 bg-white sm:grid-cols-2 lg:grid-cols-4 lg:gap-6',
            overlap
              ? 'px-6 py-8 md:px-10 md:py-9'
              : embedded
                ? 'border-t border-sage/40 px-6 py-8 md:px-10 md:py-10'
                : 'px-6 py-10 lg:px-10 lg:py-12'
          )}
        >
          {TRUST_FEATURES.map((f, i) => (
            <TrustFeature key={f.title} feature={f} index={i} centered={centered} />
          ))}
        </div>

        <div className="relative overflow-hidden bg-primary px-6 py-8 md:px-10 md:py-9">
          <div className="pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden="true">
            <div className="absolute -left-8 top-0 h-32 w-32 rounded-full bg-white blur-2xl" />
            <div className="absolute -right-8 bottom-0 h-32 w-32 rounded-full bg-secondary blur-2xl" />
          </div>

          <div className="relative flex flex-col divide-y divide-white/15 sm:flex-row sm:divide-x sm:divide-y-0">
            {stats.map((s, i) => (
              <Reveal
                key={s.label}
                delay={i * 80}
                className="flex flex-1 flex-col items-center py-4 text-center first:pt-0 last:pb-0 sm:py-0"
              >
                <span className="font-heading text-3xl font-bold text-white md:text-4xl">{s.value}</span>
                <span className="mt-1 max-w-[10rem] text-sm leading-snug text-white/85">{s.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
