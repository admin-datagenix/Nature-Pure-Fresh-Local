import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOtpCountdown } from '../hooks/useOtpCountdown';
import { LOCKOUT_MINUTES, OTP_EXPIRY_SECONDS, OTP_RESEND_COOLDOWN_SECONDS } from '../utils/authConfig';
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
  AuthSuccess,
  AuthHint,
  AuthOtpStatus,
  AuthFooter,
} from '../components/auth/AuthSplitLayout';
import { authFormStack } from '../components/auth/authTheme';
import { formatIndianPhone } from '../components/auth/AuthForm';

export default function ForgotPasswordPage() {
  const { sendPasswordReset, resetPassword, authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('email');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [expiresAt, setExpiresAt] = useState(null);
  const [resendIn, setResendIn] = useState(0);
  const [demoOtp, setDemoOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { otpExpiresIn, otpExpired } = useOtpCountdown({ expiresAt, resendIn, active: otpSent });

  useEffect(() => {
    if (isAuthenticated) navigate('/account', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const timer = setInterval(() => setResendIn((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [resendIn]);

  const resetFlow = () => {
    setOtpSent(false);
    setExpiresAt(null);
    setOtp('');
    setDemoOtp('');
    setResendIn(0);
  };

  const handleModeChange = (next) => {
    setMode(next);
    setError('');
    setSuccess('');
    resetFlow();
  };

  const handleSendReset = async () => {
    setError('');
    setSuccess('');
    try {
      const payload = mode === 'email' ? { email } : { mobile };
      const res = await sendPasswordReset(payload);
      setOtpSent(true);
      setExpiresAt(res.data.expiresAt || Date.now() + 5 * 60 * 1000);
      setDemoOtp(res.data.demoOtp || '');
      setOtp('');
      setResendIn(OTP_RESEND_COOLDOWN_SECONDS);
      setSuccess(res.message);
    } catch (err) {
      setError(err.message || 'Could not send reset OTP');
    }
  };

  const handleResend = async () => {
    if (resendIn > 0) return;
    await handleSendReset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otpSent) {
      await handleSendReset();
      return;
    }

    if (otpExpired) {
      setError('OTP expired. Please request a new one.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const payload =
        mode === 'email'
          ? { email, otp, password }
          : { mobile, otp, password };
      const res = await resetPassword(payload);
      setSuccess(res.message);
      setTimeout(() => navigate('/login', { replace: true }), 1500);
    } catch (err) {
      setError(err.message || 'Password reset failed');
    }
  };

  return (
    <AuthSplitLayout>
      <AuthPageHeader
        title="Recover Access"
        subtitle="Reset your password with a one-time OTP"
      />

      <AuthModeTabs mode={mode} onChange={handleModeChange} />
      <AuthHint>
        Reset OTP expires in {Math.floor(OTP_EXPIRY_SECONDS / 60)} minutes. Too many failed attempts lock recovery for{' '}
        {LOCKOUT_MINUTES} minutes.
      </AuthHint>
      <AuthError message={error} />
      <AuthSuccess message={success} />

      <form onSubmit={handleSubmit} className={authFormStack}>
        {mode === 'email' ? (
          <ClayAuthField
            id="reset-email"
            type="email"
            icon="mail"
            placeholder="Registered email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (otpSent) resetFlow();
            }}
            autoComplete="email"
          />
        ) : (
          <ClayPhoneField
            id="reset-mobile"
            value={mobile}
            onChange={(value) => {
              setMobile(value);
              if (otpSent) resetFlow();
            }}
          />
        )}

        {otpSent && (
          <>
            <p className="px-1 text-xs text-muted">
              OTP sent to{' '}
              {mode === 'email' ? email : formatIndianPhone(mobile.replace(/\D/g, '').slice(-10))}
            </p>
            <AuthOtpStatus
              otpSent={otpSent}
              otpExpiresIn={otpExpiresIn}
              otpExpired={otpExpired}
              resendIn={resendIn}
              onResend={handleResend}
              resendDisabled={authLoading}
            />
            <ClayOtpInput value={otp} onChange={setOtp} />
            {demoOtp && (
              <AuthHint>
                Mock reset OTP: <strong className="text-primary">{demoOtp}</strong>
              </AuthHint>
            )}
            <ClayAuthField
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              icon="lock"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              rightSlot={
                <PasswordToggle visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />
              }
            />
            <ClayAuthField
              id="confirm-new-password"
              type={showPassword ? 'text' : 'password'}
              icon="lock"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </>
        )}

        <ClaySubmitButton loading={authLoading}>
          {otpSent ? 'Update Password' : 'Send Reset OTP'}
        </ClaySubmitButton>
      </form>

      <AuthFooter>
        Remember your password?{' '}
        <Link to="/login" className="font-bold text-primary hover:underline">
          Back to Login
        </Link>
      </AuthFooter>
    </AuthSplitLayout>
  );
}
