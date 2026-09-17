import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

export default function CartPage() {
  const { cart, updateItem, clear, loading } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <h1 className="mb-8 font-heading text-3xl text-primary">Your Cart</h1>
        <div className="py-16 text-center">
          <span className="mb-4 block text-5xl">🛒</span>
          <p className="mb-6 text-[#6b6b6b]">Your cart is empty</p>
          <Link to="/shop" className="inline-flex rounded-full bg-primary px-7 py-3 text-sm font-medium text-white hover:bg-primary-light">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const shipping = cart.subtotal >= 999 ? 0 : 49;
  const total = cart.subtotal + shipping;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl text-primary">Your Cart ({cart.itemCount} items)</h1>
        <button onClick={clear} disabled={loading} className="text-sm text-strawberry underline disabled:opacity-50">
          Clear Cart
        </button>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b border-[#e8e4df] py-5">
              <div>
                <h3 className="font-medium text-primary">{item.name}</h3>
                <span className="text-sm text-[#6b6b6b]">{formatPrice(item.price)}</span>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex overflow-hidden rounded-lg border border-[#e8e4df]">
                  <button onClick={() => updateItem(item.product_id, item.quantity - 1)} disabled={loading} className="w-9 hover:bg-cream">−</button>
                  <span className="flex w-9 items-center justify-center text-sm font-semibold">{item.quantity}</span>
                  <button onClick={() => updateItem(item.product_id, item.quantity + 1)} disabled={loading} className="w-9 hover:bg-cream">+</button>
                </div>
                <span className="min-w-[80px] text-right font-semibold text-primary">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="sticky top-[120px] h-fit rounded-xl bg-white p-7 shadow-sm">
          <h3 className="mb-5 font-heading text-lg text-primary">Order Summary</h3>
          <div className="space-y-2 text-sm text-[#6b6b6b]">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(cart.subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
            <div className="flex justify-between border-t border-[#e8e4df] pt-4 text-lg font-bold text-primary">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
          </div>
          <button className="mt-4 w-full rounded-full bg-primary py-3 font-medium text-white hover:bg-primary-light">
            Proceed to Checkout
          </button>
          <Link to="/shop" className="mt-4 block text-center text-sm text-[#6b6b6b] hover:text-primary">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
