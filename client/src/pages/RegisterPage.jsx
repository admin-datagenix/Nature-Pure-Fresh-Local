import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOtpCountdown } from '../hooks/useOtpCountdown';
import { OTP_RESEND_COOLDOWN_SECONDS } from '../utils/authConfig';
import {
  AuthSplitLayout,
  AuthPageHeader,
  AuthStepTabs,
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
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mobile, setMobile] = useState('');
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

  const validateDetails = () => {
    if (!name.trim() || name.trim().length < 2) throw new Error('Please enter your full name');
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new Error('Please enter a valid email address');
    if (!address.trim() || address.trim().length < 8) throw new Error('Please enter your full address');
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters');
    if (password !== confirmPassword) throw new Error('Passwords do not match');
  };

  const handleDetailsContinue = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      validateDetails();
      setStep(2);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSendOtp = async () => {
    setError('');
    setSuccess('');
    try {
      validateDetails();
      const res = await sendRegistrationOtp({ name, email, address, password, mobile });
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

  const handleResend = async () => {
    if (resendIn > 0 || !pendingMobile) return;
    setError('');
    try {
      const res = await resendRegistrationOtp(pendingMobile);
      setExpiresAt(res.data.expiresAt || Date.now() + 5 * 60 * 1000);
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
    if (!otpSent) {
      await handleSendOtp();
      return;
    }
    if (otpExpired) {
      setError('OTP expired. Please request a new one.');
      return;
    }
    try {
      const res = await verifyRegistrationOtp(pendingMobile, otp);
      setSuccess(res.message || 'Account created! Mobile verified.');
      setTimeout(() => navigate('/account', { replace: true }), 1200);
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  const goBackToDetails = () => {
    setError('');
    setSuccess('');
    resetOtpState();
    setStep(1);
  };

  return (
    <AuthSplitLayout compact>
      <AuthPageHeader
        compact
        title={step === 1 ? 'Create Account' : 'Verify Mobile'}
        subtitle={
          step === 1
            ? 'Enter your details to get started'
            : 'Verify your mobile with OTP to complete registration'
        }
      />

      <AuthStepTabs compact step={step} labels={['Your Details', 'Verify Mobile']} />
      <AuthError message={error} />
      <AuthSuccess message={success} />

      {step === 1 ? (
        <form onSubmit={handleDetailsContinue} className={authFormStackCompact}>
          <ClayAuthField
            id="name"
            icon="user"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />

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
            placeholder="House no., street, city, PIN"
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

          <ClaySubmitButton loading={false}>Continue</ClaySubmitButton>
        </form>
      ) : (
        <form onSubmit={handleVerify} className={authFormStackCompact}>
          <AuthHint>
            Registration completes only after your mobile number is verified. Duplicate numbers are blocked.
          </AuthHint>

          <ClayPhoneField
            id="mobile"
            value={mobile}
            onChange={(value) => {
              setMobile(value);
              if (otpSent && value !== pendingMobile) resetOtpState();
            }}
          />

          {otpSent && (
            <p className="px-1 text-xs text-[#7C8A80]">
              OTP sent to {formatIndianPhone(pendingMobile)}
            </p>
          )}

          <AuthOtpStatus
            otpSent={otpSent}
            otpExpiresIn={otpExpiresIn}
            otpExpired={otpExpired}
            resendIn={resendIn}
            onResend={handleResend}
            resendDisabled={authLoading}
          />

          {otpSent && <ClayOtpInput value={otp} onChange={setOtp} />}

          {demoOtp && (
            <AuthHint>
              Mock OTP: <strong className="text-[#294633]">{demoOtp}</strong>
            </AuthHint>
          )}

          <ClaySubmitButton loading={authLoading}>
            {otpSent ? 'Verify & Create Account' : 'Send OTP'}
          </ClaySubmitButton>
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
          <button type="button" onClick={goBackToDetails} className="font-bold text-[#294633] hover:underline">
            ← Back to your details
          </button>
        )}
      </AuthFooter>
    </AuthSplitLayout>
  );
}
