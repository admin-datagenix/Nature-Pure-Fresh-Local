import { useEffect, useState } from 'react';
import { OTP_RESEND_COOLDOWN_SECONDS } from '../utils/authConfig';

/** Countdown for OTP expiry and resend cooldown */
export function useOtpCountdown({ expiresAt, resendIn, active }) {
  const [otpExpiresIn, setOtpExpiresIn] = useState(0);

  useEffect(() => {
    if (!active || !expiresAt) {
      setOtpExpiresIn(0);
      return undefined;
    }

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setOtpExpiresIn(remaining);
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [active, expiresAt]);

  return {
    otpExpiresIn,
    otpExpired: active && expiresAt && otpExpiresIn <= 0,
    resendIn,
    canResend: resendIn <= 0,
    resendCooldown: OTP_RESEND_COOLDOWN_SECONDS,
  };
}
