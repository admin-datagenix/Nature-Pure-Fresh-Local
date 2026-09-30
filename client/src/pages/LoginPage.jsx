import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOtpCountdown } from '../hooks/useOtpCountdown';
import { OTP_RESEND_COOLDOWN_SECONDS } from '../utils/authConfig';
import { notifySuccess } from '../utils/notify';
import {
  AuthSplitLayout,
  AuthPageHeader,
  AuthModeTabs,
  ClayAuthField,
  ClayPhoneField,
  ClayOtpInput,
  ClaySubmitButton,
  PasswordToggle,
  AuthError,
  AuthOtpStatus,
  AuthHint,
  AuthFooter,
} from '../components/auth/AuthSplitLayout';
import { authFormStackCompact } from '../components/auth/authTheme';
import { formatIndianPhone } from '../components/auth/AuthForm';

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
  const [expiresAt, setExpiresAt] = useState(null);
  const [resendIn, setResendIn] = useState(0);
  const [demoOtp, setDemoOtp] = useState('');
  const [error, setError] = useState('');

  const { otpExpiresIn, otpExpired } = useOtpCountdown({ expiresAt, resendIn, active: otpSent });

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
    setExpiresAt(null);
    setDemoOtp('');
    setOtp('');
    setResendIn(0);
  };

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setError('');
    resetOtpState();
    if (nextMode === 'email') setMobile('');
    else {
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
      notifySuccess('Welcome back!');
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
      setExpiresAt(res.data.expiresAt || Date.now() + 5 * 60 * 1000);
      setDemoOtp(res.data.demoOtp || '');
      setOtp('');
      setResendIn(OTP_RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err.message || 'Could not send OTP');
    }
  };

  const handleResendOtp = async () => {
    if (resendIn > 0 || !pendingMobile) return;
    setError('');
    try {
      const res = await resendLoginOtp(pendingMobile);
      setExpiresAt(res.data.expiresAt || Date.now() + 5 * 60 * 1000);
      setDemoOtp(res.data.demoOtp || '');
      setResendIn(OTP_RESEND_COOLDOWN_SECONDS);
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
    if (otpExpired) {
      setError('OTP expired. Please request a new one.');
      return;
    }
    try {
      await verifyLoginOtp(pendingMobile, otp);
      notifySuccess('Signed in successfully');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'OTP sign in failed');
    }
  };

  return (
    <AuthSplitLayout compact>
      <AuthPageHeader compact title="Welcome Back!" subtitle="Sign in with password or mobile OTP" />

      <AuthModeTabs compact mode={mode} onChange={handleModeChange} />
      <AuthError compact message={error} />

      {mode === 'email' ? (
        <form onSubmit={handlePasswordSubmit} className={authFormStackCompact}>
          <ClayAuthField
            id="email"
            type="email"
            icon="mail"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <ClayAuthField
            id="password"
            type={showPassword ? 'text' : 'password'}
            icon="lock"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            rightSlot={
              <PasswordToggle visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />
            }
          />

          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-muted transition hover:text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <ClaySubmitButton loading={authLoading}>Login</ClaySubmitButton>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className={authFormStackCompact}>
          <ClayPhoneField
            id="mobile"
            value={mobile}
            onChange={(value) => {
              setMobile(value);
              if (otpSent && value !== pendingMobile) resetOtpState();
            }}
          />

          {otpSent && (
            <p className="px-1 text-xs text-muted">
              OTP sent to {formatIndianPhone(pendingMobile)}
            </p>
          )}

          <AuthOtpStatus
            otpSent={otpSent}
            otpExpiresIn={otpExpiresIn}
            otpExpired={otpExpired}
            resendIn={resendIn}
            onResend={handleResendOtp}
            resendDisabled={authLoading}
          />

          {otpSent && <ClayOtpInput value={otp} onChange={setOtp} />}

          {demoOtp && (
            <AuthHint>
              Mock OTP: <strong className="text-primary">{demoOtp}</strong>
            </AuthHint>
          )}

          <ClaySubmitButton loading={authLoading}>
            {otpSent ? 'Sign In with OTP' : 'Send OTP'}
          </ClaySubmitButton>
        </form>
      )}

      <AuthFooter compact>
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-bold text-primary hover:underline">
          Sign Up
        </Link>
      </AuthFooter>
    </AuthSplitLayout>
  );
}
