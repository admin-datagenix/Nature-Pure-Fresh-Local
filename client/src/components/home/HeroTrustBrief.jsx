import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { TRUST_FEATURES } from '../../utils/helpers';
import TrustFeatureIcon from '../ui/TrustFeatureIcon';
import { cn } from '../../lib/cn';

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

export default function HeroTrustBrief({ className, style }) {
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
        'mt-4 w-full overflow-hidden rounded-lg border border-sage/45 bg-white/90 shadow-[0_4px_16px_rgba(41,70,51,0.06)]',
        className
      )}
      style={style}
    >
      <ul className="grid grid-cols-2 gap-x-2 gap-y-2 px-2.5 py-2.5 sm:grid-cols-4 sm:gap-x-1 sm:py-3 sm:pl-3 sm:pr-2">
        {TRUST_FEATURES.map((feature) => (
          <li key={feature.title} className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-sage/50 bg-fresh sm:h-8 sm:w-8"
              style={{ color: ICON_COLORS[feature.icon] || '#3D6049' }}
            >
              <TrustFeatureIcon name={feature.icon} />
            </span>
            <span className="text-[0.65rem] font-semibold leading-[1.15] text-primary sm:text-[0.7rem] lg:text-xs">
              {feature.title}
            </span>
          </li>
        ))}
      </ul>

      <div className="border-t border-sage/35 px-2 pb-2 pt-1.5 sm:px-2.5">
        <div className="flex divide-x divide-white/15 rounded-md bg-primary">
          {stats.map((s) => (
            <div key={s.label} className="flex min-w-0 flex-1 flex-col items-center justify-center px-1 py-1.5 text-center">
              <span className="font-heading text-sm font-bold leading-none text-white sm:text-base">{s.value}</span>
              <span className="mt-0.5 line-clamp-2 text-[0.55rem] leading-tight text-white/85 sm:text-[0.6rem]">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
