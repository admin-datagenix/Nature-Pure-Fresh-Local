import { useEffect } from 'react';
import { initCartFlyListener } from '../../utils/flyToCart';

/** Fixed layer for fly-to-cart clones (above toasts). */
export default function CartFlyLayer() {
  useEffect(() => initCartFlyListener(), []);
  return <div id="cart-fly-layer" className="cart-fly-layer" aria-hidden="true" />;
}
