import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOtpCountdown } from '../hooks/useOtpCountdown';
import { OTP_EXPIRY_SECONDS, OTP_RESEND_COOLDOWN_SECONDS } from '../utils/authConfig';
import { notifySuccess } from '../utils/notify';
import {
  AuthSplitLayout,
  AuthPageHeader,
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
import { authFormStackCompact } from '../components/auth/authTheme';
import { formatIndianPhone } from '../components/auth/AuthForm';

export default function RegisterPage() {
  const {
    sendRegistrationOtp,
    resendRegistrationOtp,
    verifyRegistrationOtp,
    authLoading,
    isAuthenticated,
  } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [showOptional, setShowOptional] = useState(false);
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [pendingMobile, setPendingMobile] = useState('');
  const [expiresAt, setExpiresAt] = useState(null);
  const [demoOtp, setDemoOtp] = useState('');
  const [resendIn, setResendIn] = useState(0);
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

  const resetOtpState = () => {
    setOtpSent(false);
    setPendingMobile('');
    setExpiresAt(null);
    setDemoOtp('');
    setOtp('');
    setResendIn(0);
  };

  const buildRegistrationPayload = () => {
    const base = { name, mobile };
    if (!showOptional) return base;

    const trimmedEmail = email.trim();
    const trimmedAddress = address.trim();
    const usingOptional = trimmedEmail || password || trimmedAddress;

    if (!usingOptional) return base;

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      throw new Error('Please enter a valid email or hide optional fields');
    }
    if (!trimmedAddress || trimmedAddress.length < 8) {
      throw new Error('Please enter your full address or hide optional fields');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    return {
      ...base,
      email: trimmedEmail,
      address: trimmedAddress,
      password,
    };
  };

  const handleStart = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const payload = buildRegistrationPayload();
      const res = await sendRegistrationOtp(payload);
      setStep(2);
      setOtpSent(true);
      setPendingMobile(res.data.mobile);
      setExpiresAt(res.data.expiresAt || Date.now() + OTP_EXPIRY_SECONDS * 1000);
      setDemoOtp(res.data.demoOtp || '');
      setOtp('');
      setResendIn(OTP_RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err.message || 'Could not send OTP');
    }
  };

  const handleResend = async () => {
    if (resendIn > 0 || !pendingMobile) return;
    setError('');
    try {
      const res = await resendRegistrationOtp(pendingMobile);
      setExpiresAt(res.data.expiresAt || Date.now() + OTP_EXPIRY_SECONDS * 1000);
      setDemoOtp(res.data.demoOtp || '');
      setResendIn(OTP_RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err.message || 'Could not resend OTP');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (otpExpired) {
      setError('OTP expired. Please request a new one.');
      return;
    }
    try {
      const res = await verifyRegistrationOtp(pendingMobile, otp);
      const msg = res.message || 'Account created — mobile verified. You are signed in.';
      setSuccess(msg);
      notifySuccess('Welcome to NaturePure Fresh!');
      setTimeout(() => navigate('/account', { replace: true }), 900);
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  const goBack = () => {
    setError('');
    setSuccess('');
    resetOtpState();
    setStep(1);
  };

  return (
    <AuthSplitLayout compact>
      <AuthPageHeader
        compact
        title={step === 1 ? 'Sign Up' : 'Verify Mobile'}
        subtitle={
          step === 1
            ? 'Register with your mobile number and OTP in seconds'
            : 'Enter the OTP to verify your mobile and activate your account'
        }
      />

      <AuthError message={error} />
      <AuthSuccess message={success} />

      {step === 1 ? (
        <form onSubmit={handleStart} className={authFormStackCompact}>
          <ClayAuthField
            id="name"
            icon="user"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />

          <ClayPhoneField id="mobile" value={mobile} onChange={setMobile} />

          <AuthHint>
            Duplicate mobile numbers are blocked. After OTP verification, your account is created and you receive a
            session token (mock demo).
          </AuthHint>

          <button
            type="button"
            onClick={() => setShowOptional((v) => !v)}
            className="text-left text-xs font-semibold text-[#3D6049] underline underline-offset-2"
          >
            {showOptional ? 'Hide optional email & password' : 'Add email & password (optional)'}
          </button>

          {showOptional && (
            <>
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
                id="address"
                icon="map"
                placeholder="Delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                autoComplete="street-address"
              />
              <ClayAuthField
                id="password"
                type={showPassword ? 'text' : 'password'}
                icon="lock"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                rightSlot={
                  <PasswordToggle visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />
                }
              />
              <ClayAuthField
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                icon="lock"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                rightSlot={
                  <PasswordToggle
                    visible={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword((v) => !v)}
                  />
                }
              />
            </>
          )}

          <ClaySubmitButton loading={authLoading}>Send OTP</ClaySubmitButton>
        </form>
      ) : (
        <form onSubmit={handleVerify} className={authFormStackCompact}>
          <p className="px-1 text-xs text-[#7C8A80]">
            OTP sent to {formatIndianPhone(pendingMobile)} · expires in {Math.floor(OTP_EXPIRY_SECONDS / 60)} minutes
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
              Mock OTP: <strong className="text-[#294633]">{demoOtp}</strong>
            </AuthHint>
          )}

          <ClaySubmitButton loading={authLoading}>Verify &amp; Sign Up</ClaySubmitButton>
        </form>
      )}

      <AuthFooter compact>
        {step === 1 ? (
          <>
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#294633] hover:underline">
              Login
            </Link>
          </>
        ) : (
          <button type="button" onClick={goBack} className="font-bold text-[#294633] hover:underline">
            ← Change mobile number
          </button>
        )}
      </AuthFooter>
    </AuthSplitLayout>
  );
}
