import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/account';

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
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

  const handleStart = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await sendRegistrationOtp({ name, mobile });
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
      setTimeout(() => navigate(redirectTo, { replace: true }), 900);
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

          <ClaySubmitButton loading={authLoading}>Send OTP</ClaySubmitButton>
        </form>
      ) : (
        <form onSubmit={handleVerify} className={authFormStackCompact}>
          <p className="px-1 text-xs text-muted">
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
              Mock OTP: <strong className="text-primary">{demoOtp}</strong>
            </AuthHint>
          )}

          <ClaySubmitButton loading={authLoading}>Verify &amp; Sign Up</ClaySubmitButton>
        </form>
      )}

      <AuthFooter compact>
        {step === 1 ? (
          <>
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary hover:underline">
              Login
            </Link>
          </>
        ) : (
          <button type="button" onClick={goBack} className="font-bold text-primary hover:underline">
            ← Change mobile number
          </button>
        )}
      </AuthFooter>
    </AuthSplitLayout>
  );
}
