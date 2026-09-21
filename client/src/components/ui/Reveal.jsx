import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';

const VARIANTS = {
  up: ['reveal-hidden', 'reveal-visible'],
  down: ['reveal-hidden-down', 'reveal-visible-down'],
  left: ['reveal-hidden-left', 'reveal-visible-left'],
  right: ['reveal-hidden-right', 'reveal-visible-right'],
  scale: ['reveal-hidden-scale', 'reveal-visible-scale'],
  blur: ['reveal-hidden-blur', 'reveal-visible-blur'],
};

export default function Reveal({
  children,
  className = '',
  delay = 0,
  variant = 'up',
  as: Tag = 'div',
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hiddenCls, visibleCls] = VARIANTS[variant] || VARIANTS.up;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn(visible ? visibleCls : hiddenCls, className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
