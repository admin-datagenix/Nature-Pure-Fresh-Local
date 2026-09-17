import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatIndianPhone } from '../components/auth/AuthForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function AccountPage() {
  const { user, loading, authLoading, logout, isAuthenticated } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: { pathname: '/account' } }} />;
  }

  const firstName = user.name.split(' ')[0];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-6">
      <h1 className="font-heading text-3xl font-semibold text-primary">My Account</h1>
      <p className="mt-2 text-sm text-[#6b6b6b]">Manage your Fresh Nature profile</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[#e8e4df] bg-white shadow-sm">
        <div className="border-b border-[#e8e4df] bg-cream/50 px-6 py-5">
          <p className="text-sm text-[#6b6b6b]">Signed in as</p>
          <p className="mt-1 font-heading text-xl font-semibold text-primary">{user.name}</p>
          <p className="text-sm text-[#6b6b6b]">{user.email}</p>
          {user.phone && (
            <p className="mt-1 text-sm text-[#6b6b6b]">
              {formatIndianPhone(user.phone)}
              {user.phone_verified && (
                <span className="ml-2 text-xs font-semibold text-secondary">Verified</span>
              )}
            </p>
          )}
          {user.address && (
            <p className="mt-2 text-sm leading-relaxed text-[#6b6b6b]">{user.address}</p>
          )}
        </div>

        <div className="space-y-4 px-6 py-6">
          <div className="rounded-xl bg-cream px-4 py-4 text-sm text-[#6b6b6b]">
            <p className="font-medium text-primary">Hi {firstName}! 👋</p>
            <p className="mt-1 leading-relaxed">
              Your account is ready. Order history and saved addresses will appear here once the .NET backend is connected.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex rounded-full border border-primary px-5 py-2.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
          >
            Continue Shopping
          </Link>

          <button
            type="button"
            onClick={logout}
            disabled={authLoading}
            className="block text-sm font-medium text-strawberry transition hover:underline disabled:opacity-50"
          >
            {authLoading ? 'Signing out…' : 'Sign Out'}
          </button>
        </div>
      </div>
    </div>
  );
}
