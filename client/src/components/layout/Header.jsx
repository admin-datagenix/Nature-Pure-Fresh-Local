import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../ui/BrandLogo';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { CART_FLY_TARGET_ID, WISHLIST_FLY_TARGET_ID } from '../../utils/flyToCart';
import ProfileMenu from './ProfileMenu';
import useCategoryTree from '../../hooks/useCategoryTree';
import { cn } from '../../lib/cn';


function SearchIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c0-4 3.5-7 7-7s7 3 7 7" strokeLinecap="round" />
    </svg>
  );
}

function CartIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M3 3h2l1.5 9.5a2 2 0 002 1.7h9.8a2 2 0 001.95-1.6L21 6H6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="19" r="1.2" fill="currentColor" />
      <circle cx="17" cy="19" r="1.2" fill="currentColor" />
    </svg>
  );
}

function HeartIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path
        d="M12 21s-7-4.5-7-10a4 4 0 117 0 4 4 0 117 0c0 5.5-7 10-7 10z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenuIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

const navLinkClass = ({ isActive }) =>
  cn(
    'relative px-1 py-2 text-base font-medium transition-colors',
    isActive ? 'text-primary' : 'text-primary/70 hover:text-primary',
    isActive && 'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-secondary'
  );

export default function Header() {
  const { cart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const shopRef = useRef(null);
  const { categories } = useCategoryTree();
  const { assets, navigation } = useSiteConfig();
  const navLinksAfterShop = navigation?.headerAfterShop || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const [countPop, setCountPop] = useState(false);
  const [wishlistBounce, setWishlistBounce] = useState(false);
  const [wishlistCountPop, setWishlistCountPop] = useState(false);
  const prevCartCount = useRef(cart.itemCount);
  const prevWishlistCount = useRef(wishlistCount);

  useEffect(() => {
    const onBounce = () => {
      setCartBounce(true);
      window.setTimeout(() => setCartBounce(false), 560);
    };
    window.addEventListener('cart-icon-bounce', onBounce);
    return () => window.removeEventListener('cart-icon-bounce', onBounce);
  }, []);

  useEffect(() => {
    const onBounce = () => {
      setWishlistBounce(true);
      window.setTimeout(() => setWishlistBounce(false), 560);
    };
    window.addEventListener('wishlist-icon-bounce', onBounce);
    return () => window.removeEventListener('wishlist-icon-bounce', onBounce);
  }, []);

  useEffect(() => {
    if (cart.itemCount > prevCartCount.current) {
      setCountPop(true);
      window.setTimeout(() => setCountPop(false), 500);
    }
    prevCartCount.current = cart.itemCount;
  }, [cart.itemCount]);

  useEffect(() => {
    if (wishlistCount > prevWishlistCount.current) {
      setWishlistCountPop(true);
      window.setTimeout(() => setWishlistCountPop(false), 500);
    }
    prevWishlistCount.current = wishlistCount;
  }, [wishlistCount]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (shopRef.current && !shopRef.current.contains(e.target)) {
        setShopOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
    setMobileOpen(false);
  };

  const accountPath = '/login';
  const accountLabel = 'Login';

  return (
    <header className="sticky top-0 z-50 w-full max-w-full overflow-visible border-b border-sage/50 bg-white shadow-[0_4px_20px_rgba(41,70,51,0.05)]">
      <div className="site-container flex min-w-0 items-center gap-2 py-3 sm:gap-3 md:gap-5 lg:py-3.5">
        <BrandLogo
          bareLogo
          logoOnly
          src={assets?.logoNavbar}
          className="navbar-brand-slot min-w-0 max-w-[46vw] sm:max-w-none"
          imageClassName="navbar-brand-logo"
        />

        <nav className="hidden items-center gap-6 lg:ml-2 lg:flex xl:ml-4 xl:gap-8" aria-label="Main navigation">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          <div ref={shopRef} className="relative">
            <div className="flex items-center">
              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  cn(
                    'px-1 py-2 text-base font-medium transition-colors',
                    isActive ? 'text-primary' : 'text-primary/70 hover:text-primary'
                  )
                }
              >
                Shop
              </NavLink>
              <button
                type="button"
                onClick={() => setShopOpen((o) => !o)}
                className={cn(
                  'rounded-md p-1 transition-colors',
                  shopOpen ? 'text-primary' : 'text-primary/70 hover:text-primary'
                )}
                aria-expanded={shopOpen}
                aria-haspopup="true"
                aria-label="Shop categories"
              >
                <ChevronIcon className={cn('h-4 w-4 transition', shopOpen && 'rotate-180')} />
              </button>
            </div>

            {shopOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 w-[min(calc(100vw-2rem),32rem)] rounded-2xl border border-sage/60 bg-white p-3 shadow-[0_16px_40px_rgba(41,70,51,0.12)] xl:w-[36rem]">
                <Link
                  to="/shop"
                  onClick={() => setShopOpen(false)}
                  className="mb-2 block rounded-xl px-3 py-2.5 text-sm font-semibold text-primary transition hover:bg-cream"
                >
                  All Products
                </Link>
                <div className="grid gap-0.5 sm:grid-cols-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/shop/${cat.slug}`}
                      onClick={() => setShopOpen(false)}
                      className="rounded-xl px-3 py-2.5 transition hover:bg-cream"
                    >
                      <span className="block text-sm font-semibold text-primary">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {navLinksAfterShop.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-2">
          <form onSubmit={handleSearch} className="hidden md:block">
            <div className="flex w-[180px] items-center gap-2 rounded-full border border-sage/50 bg-cream px-4 py-2.5 lg:w-[240px] xl:w-[280px]">
              <SearchIcon className="h-4 w-4 shrink-0 text-muted" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full bg-transparent text-sm text-primary outline-none placeholder:text-muted"
              />
            </div>
          </form>

          {isAuthenticated && (
            <Link
              id={CART_FLY_TARGET_ID}
              to="/cart"
              data-cart-fly-target=""
              className={cn(
                'relative rounded-full p-2 text-primary/80 transition hover:bg-cream hover:text-primary sm:p-2.5',
                cartBounce && 'cart-fly-target-bounce'
              )}
              aria-label="Shopping cart"
            >
              <CartIcon className="h-5 w-5" data-cart-fly-icon />
              {cart.items.length > 0 && (
                <span
                  className={cn(
                    'absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-secondary px-1 text-[0.62rem] font-bold text-white',
                    countPop && 'cart-count-pop'
                  )}
                >
                  {cart.items.length}
                </span>
              )}
            </Link>
          )}

          {isAuthenticated && (
            <Link
              id={WISHLIST_FLY_TARGET_ID}
              to="/wishlist"
              className={cn(
                'relative rounded-full p-2 text-primary/80 transition hover:bg-cream hover:text-primary sm:p-2.5',
                wishlistBounce && 'cart-fly-target-bounce'
              )}
              aria-label="Wishlist"
            >
              <HeartIcon className="h-5 w-5" data-wishlist-fly-icon />
              {wishlistCount > 0 && (
                <span
                  className={cn(
                    'absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-secondary px-1 text-[0.62rem] font-bold text-white',
                    wishlistCountPop && 'cart-count-pop'
                  )}
                >
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>
          )}

          {isAuthenticated ? (
            <ProfileMenu
              open={profileOpen}
              onToggle={() => setProfileOpen((o) => !o)}
              onClose={() => setProfileOpen(false)}
            />
          ) : (
            <Link
              to={accountPath}
              className="rounded-full p-2 text-primary/80 transition hover:bg-cream hover:text-primary sm:p-2.5"
              aria-label={accountLabel}
            >
              <UserIcon className="h-5 w-5" />
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sage/55 bg-cream text-primary lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        className={cn(
          'overflow-hidden border-t border-sage/50 bg-white transition-all duration-300 lg:hidden',
          mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <nav className="space-y-1 px-4 py-4" aria-label="Mobile navigation">
          {[
            { to: '/', label: 'Home', end: true },
            { to: '/shop', label: 'Shop' },
            ...(navLinksAfterShop.length
              ? navLinksAfterShop.map((link) => ({ to: link.to, label: link.label }))
              : [
                  { to: '/about', label: 'About Us' },
                  { to: '/process', label: 'Process' },
                  { to: '/contact', label: 'Contact Us' },
                ]),
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'block rounded-xl px-3 py-2.5 text-base font-medium',
                  isActive ? 'bg-cream text-primary' : 'text-primary/75 hover:bg-cream/80'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
