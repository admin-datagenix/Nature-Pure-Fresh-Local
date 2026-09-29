const STEPS = [
  { id: 'placed', label: 'Order placed', short: 'Placed' },
  { id: 'accepted', label: 'Accepted', short: 'Accepted' },
  { id: 'processing', label: 'In progress', short: 'Progress' },
  { id: 'shipped', label: 'On the way', short: 'On way' },
  { id: 'delivered', label: 'Delivered', short: 'Delivered' },
];

function statusToActiveIndex(status) {
  const s = String(status || 'confirmed').toLowerCase();
  if (s.includes('deliver')) return 4;
  if (s.includes('ship') || s.includes('transit') || s.includes('way')) return 3;
  if (s.includes('process') || s.includes('pack')) return 2;
  if (s.includes('accept') || s.includes('confirm')) return 2;
  return 2;
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function formatStepWhen(date, { time = false } = {}) {
  if (!date || Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    ...(time
      ? { hour: 'numeric', minute: '2-digit', hour12: true }
      : {}),
  });
}

function formatExpectedRange(start, end) {
  const a = formatStepWhen(start);
  const b = formatStepWhen(end);
  if (!a) return '';
  if (!b || a === b) return `Expected ${a}`;
  return `Expected ${a} – ${b}`;
}

export function buildOrderTrackingSteps(order) {
  const created = new Date(order?.created_at || Date.now());
  const delivery = new Date(order?.estimated_delivery || addDays(created, 4));
  const activeIndex = statusToActiveIndex(order?.status);
  const allComplete = activeIndex >= STEPS.length - 1 && String(order?.status || '').toLowerCase().includes('deliver');

  const whenByIndex = [
    { done: formatStepWhen(created, { time: true }) },
    { done: formatStepWhen(addMinutes(created, 15), { time: true }) },
    { expected: formatStepWhen(addDays(created, 1)) },
    {
      expected: formatExpectedRange(addDays(created, 2), addDays(delivery, -1)),
    },
    { expected: formatStepWhen(delivery) },
  ];

  return STEPS.map((step, index) => {
    let state = 'upcoming';
    if (allComplete) state = 'complete';
    else if (index < activeIndex) state = 'complete';
    else if (index === activeIndex) state = 'current';

    const when = whenByIndex[index] || {};
    let caption = '';
    if (state === 'complete') caption = when.done || when.expected || '';
    else if (state === 'current') caption = when.expected || when.done || '';
    else caption = when.expected || '';

    return { ...step, state, caption };
  });
}

export { STEPS };
