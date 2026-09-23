import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { TRUST_FEATURES } from '../../utils/helpers';
import { cn } from '../../lib/cn';
import Reveal from '../ui/Reveal';
import TrustFeatureIcon from '../ui/TrustFeatureIcon';

const ICON_COLORS = {
  natural: '#4a7c59',
  premium: '#f5a623',
  sustainable: '#3D6049',
  expert: '#294633',
};

const DEFAULT_STATS = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '8+', label: 'Fruit Varieties' },
  { value: '98%', label: 'Customer Satisfaction' },
];

function TrustFeature({ feature, index, centered }) {
  const iconColor = ICON_COLORS[feature.icon] || '#3D6049';

  return (
    <Reveal delay={index * 50}>
      <article
        className={cn(
          'flex flex-col',
          centered ? 'items-center text-center' : 'sm:flex-row sm:items-start sm:text-left'
        )}
      >
        <div className={cn('flex items-center gap-2', centered && 'justify-center')}>
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-sage/60 bg-fresh shadow-sm"
            style={{ color: iconColor }}
          >
            <TrustFeatureIcon name={feature.icon} />
          </div>
          <h3 className="text-sm font-semibold leading-tight text-primary md:text-base">{feature.title}</h3>
        </div>
        <p
          className={cn(
            'mt-1 text-xs leading-snug text-muted md:text-sm',
            centered && 'max-w-[11.5rem]',
            !centered && 'sm:ml-11 sm:mt-0.5'
          )}
        >
          {feature.desc}
        </p>
      </article>
    </Reveal>
  );
}

export default function TrustCard({ overlap = false, embedded = false }) {
  const isFloating = overlap || !embedded;
  const centered = overlap || embedded;
  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    api
      .getStats()
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
    <div
      className={cn(
        isFloating && !overlap && 'site-container relative',
        overlap && 'mx-5 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-20'
      )}
    >
      <div
        className={cn(
          'relative bg-white',
          isFloating && 'overflow-hidden rounded-[1.25rem] shadow-[0_16px_40px_rgba(41,70,51,0.1)]'
        )}
      >
        <div
          className={cn(
            'grid grid-cols-1 gap-5 bg-white sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-3',
            overlap
              ? 'px-5 py-4 md:px-8 md:py-5'
              : embedded
                ? 'border-t border-sage/40 px-5 py-5 md:px-8'
                : 'px-5 py-6 lg:px-8 lg:py-7'
          )}
        >
          {TRUST_FEATURES.map((f, i) => (
            <TrustFeature key={f.title} feature={f} index={i} centered={centered} />
          ))}
        </div>

        <div
          className={cn(
            'bg-white',
            overlap ? 'px-4 pb-4 md:px-6 md:pb-5' : 'px-4 pb-4 md:px-6 md:pb-5'
          )}
        >
          <div className="relative overflow-hidden rounded-xl bg-primary px-4 py-4 md:px-6 md:py-5">
            <div className="pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden="true">
              <div className="absolute -left-8 top-0 h-24 w-24 rounded-full bg-white blur-2xl" />
              <div className="absolute -right-8 bottom-0 h-24 w-24 rounded-full bg-secondary blur-2xl" />
            </div>

            <div className="relative flex flex-col divide-y divide-white/15 sm:flex-row sm:divide-x sm:divide-y-0">
              {stats.map((s, i) => (
                <Reveal
                  key={s.label}
                  delay={i * 60}
                  className="flex flex-1 flex-col items-center py-2 text-center first:pt-0 last:pb-0 sm:py-0"
                >
                  <span className="font-heading text-2xl font-bold text-white md:text-[1.75rem]">{s.value}</span>
                  <span className="mt-0.5 max-w-[10rem] text-xs leading-snug text-white/85 md:text-sm">{s.label}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
