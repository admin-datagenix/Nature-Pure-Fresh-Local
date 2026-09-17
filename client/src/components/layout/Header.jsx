import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { BRAND_NAME } from '../../api/client';

const NAV_LINKS = [
  { to: '/shop', label: 'Shop' },
  { to: '/shop/combos', label: 'Collections' },
  { to: '/about', label: 'About' },
  { to: '/about#process', label: 'Ingredients' },
];

export default function Header() {
  const { cart } = useCart();
  const { user, isAuthenticated, logout, authLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const firstName = user?.name?.split(' ')[0];

  return (
    <>
      <div className="flex h-10 items-center bg-primary text-xs text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 px-4">
          <span>Free shipping on orders above ₹999</span>
          <span className="hidden opacity-50 sm:inline">·</span>
          <span className="hidden sm:inline">100% Real Fruit</span>
          <span className="hidden opacity-50 md:inline">·</span>
          <span className="hidden md:inline">No Added Sugar</span>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-[#e8e4df] bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-4 md:gap-6 md:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2 font-heading text-xl font-semibold text-primary">
            <span className="text-2xl">🍃</span>
            {BRAND_NAME}
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-[#3a3a3a] transition hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/account"
                  className="hidden text-sm font-medium text-[#3a3a3a] transition hover:text-primary sm:inline"
                >
                  Hi, {firstName}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={authLoading}
                  className="hidden text-sm font-medium text-[#6b6b6b] transition hover:text-primary sm:inline disabled:opacity-50"
                >
                  Logout
                </button>
                <Link
                  to="/account"
                  className="rounded-full p-1.5 text-lg sm:hidden"
                  aria-label="My account"
                >
                  👤
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-[#3a3a3a] transition hover:text-primary"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-light sm:inline-flex"
                >
                  Sign Up
                </Link>
              </>
            )}

            <Link to="/shop" className="p-1 text-xl" aria-label="Search products">🔍</Link>
            <Link to="/cart" className="relative p-1 text-xl" aria-label="Shopping cart">
              🛒
              {cart.itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-strawberry text-[0.65rem] font-bold text-white">
                  {cart.itemCount}
                </span>
              )}
            </Link>
            <button className="text-2xl text-primary lg:hidden" aria-label="Open menu">☰</button>
          </div>
        </div>
      </header>
    </>
  );
}
