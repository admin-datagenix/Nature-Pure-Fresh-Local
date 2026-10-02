import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';
import AccountOrderCard from './AccountOrderCard';
import { ORDER_FILTER_TABS, filterOrdersByTab, isOrderOngoing } from './accountOrderHelpers';

export default function AccountOrdersPanel({ orders, loading, activeTab, onTabChange }) {
  const visibleOrders = useMemo(() => filterOrdersByTab(orders, activeTab), [orders, activeTab]);

  const tabCounts = useMemo(() => {
    const counts = { all: orders.length };
    ORDER_FILTER_TABS.forEach((tab) => {
      if (tab.id !== 'all') counts[tab.id] = filterOrdersByTab(orders, tab.id).length;
    });
    return counts;
  }, [orders]);

  const highlightOrderId = useMemo(() => {
    const ongoing = visibleOrders.find((o) => isOrderOngoing(o));
    return ongoing?.id ?? null;
  }, [visibleOrders]);

  return (
    <section className="account-orders-panel">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-primary md:text-2xl">My Orders</h2>
          <p className="mt-1 text-sm text-muted">Track packages, view details, and download invoices</p>
        </div>
        {!loading && orders.length > 0 && (
          <p className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-primary/85">
            {visibleOrders.length} shown
          </p>
        )}
      </div>

      <div
        className="account-orders-panel__tabs mt-5 flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:thin]"
        role="tablist"
        aria-label="Order filters"
      >
        {ORDER_FILTER_TABS.map((tab) => {
          const selected = activeTab === tab.id;
          const count = tabCounts[tab.id] ?? 0;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition',
                selected
                  ? 'bg-primary text-white shadow-[0_4px_14px_rgba(41,70,51,0.18)]'
                  : 'border border-sage/40 bg-white text-primary/80 hover:border-sage/70 hover:bg-cream/50'
              )}
            >
              <span>{tab.label}</span>
              {!loading && count > 0 && (
                <span
                  className={cn(
                    'min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-[0.6875rem] font-bold tabular-nums leading-none',
                    selected ? 'bg-white/20 text-white' : 'bg-sage/25 text-primary/70'
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="account-orders-panel__empty rounded-2xl border border-sage/30 bg-white py-16 text-center shadow-[0_2px_12px_rgba(41,70,51,0.04)]">
            <p className="text-sm text-muted">Loading your orders…</p>
          </div>
        ) : visibleOrders.length === 0 ? (
          <div className="account-orders-panel__empty rounded-2xl border border-dashed border-sage/40 bg-white py-16 text-center shadow-[0_2px_12px_rgba(41,70,51,0.04)]">
            <p className="text-sm font-medium text-primary/90">
              {orders.length === 0 ? 'You have not placed any orders yet.' : 'No orders match this filter.'}
            </p>
            <p className="mt-1 text-xs text-muted">
              {orders.length === 0 ? 'Explore our freeze-dried snacks and powders.' : 'Try another tab or shop again.'}
            </p>
            <Link to="/shop" className="neo-btn mt-5 inline-flex px-6 py-2.5 text-sm font-semibold">
              Browse products
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {visibleOrders.map((order) => (
              <li key={order.id}>
                <AccountOrderCard order={order} highlightActive={order.id === highlightOrderId} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
