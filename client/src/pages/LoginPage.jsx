import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AuthShell,
  AuthField,
  AuthError,
  AuthSubmitButton,
  AuthModeTabs,
  PhoneField,
  OtpInput,
  PasswordToggle,
  formatIndianPhone,
} from '../components/auth/AuthForm';

export default function LoginPage() {
  const {
    login,
    sendLoginOtp,
    resendLoginOtp,
    verifyLoginOtp,
    authLoading,
    isAuthenticated,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [pendingMobile, setPendingMobile] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [resendIn, setResendIn] = useState(0);
  const [error, setError] = useState('');

  const redirectTo = location.state?.from?.pathname || '/account';

  useEffect(() => {
    if (isAuthenticated) navigate(redirectTo, { replace: true });
  }, [isAuthenticated, navigate, redirectTo]);

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const timer = setInterval(() => setResendIn((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [resendIn]);

  const resetOtpState = () => {
    setOtpSent(false);
    setPendingMobile('');
    setDemoOtp('');
    setOtp('');
    setResendIn(0);
  };

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setError('');
    resetOtpState();
    if (nextMode === 'email') {
      setMobile('');
    } else {
      setEmail('');
      setPassword('');
      setShowPassword(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  const handleSendOtp = async () => {
    setError('');
    try {
      const res = await sendLoginOtp(mobile);
      setOtpSent(true);
      setPendingMobile(res.data.mobile);
      setDemoOtp(res.data.demoOtp || '');
      setOtp('');
      setResendIn(60);
    } catch (err) {
      setError(err.message || 'Could not send OTP');
    }
  };

  const handleResendOtp = async () => {
    if (resendIn > 0 || !pendingMobile) return;
    setError('');
    try {
      const res = await resendLoginOtp(pendingMobile);
      setDemoOtp(res.data.demoOtp || '');
      setResendIn(60);
    } catch (err) {
      setError(err.message || 'Could not resend OTP');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!otpSent) {
      await handleSendOtp();
      return;
    }

    try {
      await verifyLoginOtp(pendingMobile, otp);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'OTP sign in failed');
    }
  };

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Sign in to continue shopping"
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <AuthModeTabs mode={mode} onChange={handleModeChange} />
      <AuthError message={error} />

      {mode === 'email' ? (
        <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
          <AuthField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />

          <AuthField
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
            rightSlot={
              <PasswordToggle visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />
            }
          />

          <AuthSubmitButton loading={authLoading}>Sign In</AuthSubmitButton>

          <p className="rounded-xl bg-cream px-4 py-3 text-center text-xs leading-relaxed text-[#6b6b6b]">
            Demo: <strong className="text-primary">demo@freshnature.in</strong> / <strong className="text-primary">demo123</strong>
          </p>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="mt-4 space-y-4">
          <PhoneField
            id="mobile"
            label="Mobile Number"
            value={mobile}
            onChange={(value) => {
              setMobile(value);
              if (otpSent && value !== pendingMobile) resetOtpState();
            }}
          />

          <div className="flex items-center justify-between gap-3 text-xs text-[#6b6b6b]">
            <span>
              {otpSent
                ? `OTP sent to ${formatIndianPhone(pendingMobile)}`
                : 'Enter your registered mobile number'}
            </span>
            {otpSent && (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendIn > 0 || authLoading}
                className="shrink-0 font-medium text-primary hover:underline disabled:opacity-50"
              >
                {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend OTP'}
              </button>
            )}
          </div>

          {otpSent && <OtpInput value={otp} onChange={setOtp} />}

          {demoOtp && (
            <p className="rounded-xl bg-cream px-4 py-3 text-center text-xs leading-relaxed text-[#6b6b6b]">
              Mock SMS OTP (demo): <strong className="text-primary">{demoOtp}</strong>
            </p>
          )}

          <AuthSubmitButton loading={authLoading}>
            {otpSent ? 'Sign In with OTP' : 'Send OTP'}
          </AuthSubmitButton>

          <p className="text-center text-xs text-[#6b6b6b]">
            Demo mobile: <strong className="text-primary">9876543210</strong>
          </p>
        </form>
      )}
    </AuthShell>
  );
}
