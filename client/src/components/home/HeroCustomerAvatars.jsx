import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { cn } from '../../lib/cn';

const AVATAR_COLORS = ['bg-mango/90', 'bg-strawberry/80', 'bg-secondary/80', 'bg-primary/70'];

const DEFAULT_COUNT = '50K+';

export default function HeroCustomerAvatars({ className, style }) {
  const [count, setCount] = useState(DEFAULT_COUNT);

  useEffect(() => {
    api
      .getStats()
      .then((res) => setCount(res.data?.happyCustomers || DEFAULT_COUNT))
      .catch(() => {});
  }, []);

  return (
    <div className={cn('flex items-center gap-3', className)} style={style}>
      <div className="flex -space-x-2.5">
        {AVATAR_COLORS.map((color, i) => (
          <span
            key={i}
            className={`flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-white ${color} text-xs font-bold text-white`}
          >
            {String.fromCharCode(65 + i)}
          </span>
        ))}
      </div>
      <p className="text-sm text-muted">
        <strong className="font-semibold text-primary">{count}</strong> Happy Customers
      </p>
    </div>
  );
}
