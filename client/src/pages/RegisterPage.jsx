import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AuthShell,
  AuthField,
  AuthTextArea,
  AuthError,
  AuthSubmitButton,
  PhoneField,
  OtpInput,
  PasswordToggle,
  formatIndianPhone,
} from '../components/auth/AuthForm';

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
  const [demoOtp, setDemoOtp] = useState('');
  const [resendIn, setResendIn] = useState(0);
  const [error, setError] = useState('');

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
    setDemoOtp('');
    setOtp('');
    setResendIn(0);
  };

  const validateDetails = () => {
    if (!name.trim() || name.trim().length < 2) {
      throw new Error('Please enter your full name');
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      throw new Error('Please enter a valid email address');
    }
    if (!address.trim() || address.trim().length < 8) {
      throw new Error('Please enter your full address');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }
  };

  const handleDetailsContinue = (e) => {
    e.preventDefault();
    setError('');
    try {
      validateDetails();
      setStep(2);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSendOtp = async () => {
    setError('');
    try {
      validateDetails();
      const res = await sendRegistrationOtp({ name, email, address, password, mobile });
      setOtpSent(true);
      setPendingMobile(res.data.mobile);
      setDemoOtp(res.data.demoOtp || '');
      setOtp('');
      setResendIn(60);
    } catch (err) {
      setError(err.message || 'Could not send OTP');
    }
  };

  const handleResend = async () => {
    if (resendIn > 0 || !pendingMobile) return;
    setError('');
    try {
      const res = await resendRegistrationOtp(pendingMobile);
      setDemoOtp(res.data.demoOtp || '');
      setResendIn(60);
    } catch (err) {
      setError(err.message || 'Could not resend OTP');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    if (!otpSent) {
      await handleSendOtp();
      return;
    }

    try {
      await verifyRegistrationOtp(pendingMobile, otp);
      navigate('/account', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  const goBackToDetails = () => {
    setError('');
    resetOtpState();
    setStep(1);
  };

  return (
    <AuthShell
      title={step === 1 ? 'Create Account' : 'Verify Mobile'}
      subtitle={
        step === 1
          ? 'Join Fresh Nature for faster checkout and order updates'
          : 'Enter your mobile number and the OTP we send you'
      }
      footer={
        step === 1 ? (
          <>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <button type="button" onClick={goBackToDetails} className="font-medium text-primary hover:underline">
            ← Back to name and address
          </button>
        )
      }
    >
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
        Step {step} of 2
      </p>
      <AuthError message={error} />

      {step === 1 ? (
        <form onSubmit={handleDetailsContinue} className="space-y-4">
          <AuthField
            id="name"
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />

          <AuthField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />

          <AuthTextArea
            id="address"
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="House no., street, city, PIN"
            autoComplete="street-address"
          />

          <AuthField
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            rightSlot={
              <PasswordToggle visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />
            }
          />

          <AuthField
            id="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat password"
            autoComplete="new-password"
            rightSlot={
              <PasswordToggle
                visible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((v) => !v)}
              />
            }
          />

          <AuthSubmitButton loading={false}>Continue</AuthSubmitButton>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
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
                : 'We will send a verification OTP'}
            </span>
            {otpSent && (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendIn > 0 || authLoading}
                className="shrink-0 text-xs font-medium text-primary hover:underline disabled:opacity-50"
              >
                {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend OTP'}
              </button>
            )}
          </div>

          {otpSent && <OtpInput value={otp} onChange={setOtp} />}

          {demoOtp && (
            <p className="rounded-xl bg-cream px-4 py-3 text-xs leading-relaxed text-[#6b6b6b]">
              Mock SMS OTP (demo): <strong className="text-primary">{demoOtp}</strong>
            </p>
          )}

          <AuthSubmitButton loading={authLoading}>
            {otpSent ? 'Create Account' : 'Send OTP'}
          </AuthSubmitButton>
        </form>
      )}
    </AuthShell>
  );
}
