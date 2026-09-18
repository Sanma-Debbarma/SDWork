import React, { useState, useRef, useEffect } from 'react';
import { Mail, Loader2, ArrowLeft, CheckCircle2, AlertCircle, RefreshCw, KeyRound, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export interface LoginPageProps {
  onSendOtp?: (email: string) => Promise<void> | void;
  onVerifyOtp?: (email: string, otp: string) => Promise<void> | void;
  onResendOtp?: (email: string) => Promise<void> | void;
  onGoogleLogin?: () => Promise<void> | void;
  homeUrl?: string;
}

type AuthStep = 'email' | 'otp';

export const LoginPage: React.FC<LoginPageProps> = ({
  onSendOtp,
  onVerifyOtp,
  onResendOtp,
  onGoogleLogin,
  homeUrl = '/',
}) => {
  const { login } = useAuth();

  // Navigation & state
  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [devOtp, setDevOtp] = useState<string | null>(null);


  // Loading & process states
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Notifications & errors
  const [feedback, setFeedback] = useState<{
    type: 'error' | 'success' | 'info';
    message: string;
  } | null>(null);

  // OTP error state for box highlighting
  const [otpHasError, setOtpHasError] = useState(false);

  // 30s Countdown timer for resending OTP
  const [countdown, setCountdown] = useState(30);

  // Input refs for 6 OTP boxes
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Email validation regex
  const isValidEmail = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  // Timer countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, countdown]);

  // Focus the first OTP box when entering the OTP step
  useEffect(() => {
    if (step === 'otp') {
      const focusTimer = setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
      return () => clearTimeout(focusTimer);
    }
  }, [step]);

  // Handle Send OTP (Screen 1 submission)
  const handleSendOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setFeedback({
        type: 'error',
        message: 'Please enter your email address to continue.',
      });
      return;
    }

    if (!isValidEmail(trimmed)) {
      setFeedback({
        type: 'error',
        message: 'Please enter a valid email address (e.g. name@example.com).',
      });
      return;
    }

    setIsSendingOtp(true);
    try {
      if (onSendOtp) {
        await onSendOtp(trimmed);
      } else {
        const response = await fetch('http://127.0.0.1:5000/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmed }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to send verification code.');
        }
        if (data.dev_otp) {
          setDevOtp(data.dev_otp);
        }
      }

      // Transition to OTP screen
      setStep('otp');
      setCountdown(30);
      setOtp(['', '', '', '', '', '']);
      setOtpHasError(false);
      setFeedback({
        type: 'success',
        message: `We sent a 6-digit verification code to ${trimmed}`,
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Failed to send verification code. Please try again.',
      });
    } finally {
      setIsSendingOtp(false);
    }

  };

  // Handle OTP digit input
  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric digits
    const sanitized = value.replace(/\D/g, '');
    if (!sanitized && value !== '') return;

    const char = sanitized.slice(-1); // Take the latest typed digit
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);
    setOtpHasError(false);

    if (feedback?.type === 'error') {
      setFeedback(null);
    }

    // Auto-advance to next input if digit entered
    if (char && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace and arrow navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Current box is empty, jump to previous box and clear it
        e.preventDefault();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        otpInputRefs.current[index - 1]?.focus();
      } else if (otp[index]) {
        // Clear current box
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle pasting complete 6-digit OTP
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedText) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedText[i] || '';
    }
    setOtp(newOtp);
    setOtpHasError(false);

    // Focus the next empty box or the last box
    const nextEmptyIndex = newOtp.findIndex((digit) => !digit);
    if (nextEmptyIndex !== -1) {
      otpInputRefs.current[nextEmptyIndex]?.focus();
    } else {
      otpInputRefs.current[5]?.focus();
    }
  };

  // Handle Verify & Login (Screen 2 submission)
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const fullCode = otp.join('');
    if (fullCode.length < 6) {
      setOtpHasError(true);
      setFeedback({
        type: 'error',
        message: 'Please enter all 6 digits of your verification code.',
      });
      return;
    }

    setIsVerifyingOtp(true);
    try {
      if (onVerifyOtp) {
        await onVerifyOtp(email.trim(), fullCode);
      } else {
        const response = await fetch('http://127.0.0.1:5000/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), otp: fullCode }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Verification failed. Please try again.');
        }

        if (data.token && data.user) {
          login(data.token, data.user);
        }
      }

      // Success state
      setFeedback({
        type: 'success',
        message: 'Login verified! Loading workspace...',
      });
    } catch (err: any) {
      setOtpHasError(true);
      setFeedback({
        type: 'error',
        message: err?.message || 'Invalid verification code. Please try again.',
      });
    } finally {
      setIsVerifyingOtp(false);
    }

  };

  // Handle Resend OTP
  const handleResend = async () => {
    if (countdown > 0 || isResendingOtp) return;

    setIsResendingOtp(true);
    setFeedback(null);
    setOtpHasError(false);

    try {
      if (onResendOtp) {
        await onResendOtp(email.trim());
      } else {
        const response = await fetch('http://127.0.0.1:5000/api/auth/resend-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to resend code. Please try again.');
        }
      }

      setCountdown(30);
      setOtp(['', '', '', '', '', '']);
      setFeedback({
        type: 'success',
        message: 'A fresh verification code has been sent to your email.',
      });
      otpInputRefs.current[0]?.focus();
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Failed to resend code. Please try again.',
      });
    } finally {
      setIsResendingOtp(false);
    }
  };

  // Handle Change Email (Back to Screen 1)
  const handleChangeEmail = () => {
    setStep('email');
    setFeedback(null);
    setOtpHasError(false);
  };

  // Handle Google OAuth
  const handleGoogleSignIn = async () => {
    setFeedback(null);
    setIsGoogleLoading(true);
    try {
      if (onGoogleLogin) {
        await onGoogleLogin();
      } else {
        const response = await fetch('http://127.0.0.1:5000/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'google.user@edit.com',
            name: 'Google User',
            avatar: '/assets/anivex-avatar.png',
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Google login failed.');
        }
        if (data.token && data.user) {
          login(data.token, data.user);
        }
        setFeedback({
          type: 'success',
          message: 'Google login verified! Loading workspace...',
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Failed to authenticate with Google.',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8 bg-[#FAFAFC] relative overflow-hidden font-sans select-none">
      {/* Subtle Purple Ambient Glow Accents */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-400/[0.03] blur-[100px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Container */}
      <div className="w-full max-w-[430px] relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-7">
          <Link
            to={homeUrl}
            className="flex items-center gap-2.5 mb-5 group cursor-pointer transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500/20 rounded-lg p-1"
            title="Return to Edit.com"
          >
            {/* Play Badge Logo */}
            <div className="w-9 h-[26px] bg-[#FF0000] rounded-[7px] flex items-center justify-center shadow-sm group-hover:shadow transition-all">
              <svg
                className="w-3.5 h-3.5 text-white ml-0.5 fill-current"
                viewBox="0 0 24 24"
              >
                <polygon points="6 4, 20 12, 6 20" />
              </svg>
            </div>
            {/* Brand Title */}
            <span className="text-2xl font-bold text-[#0F0F0F] tracking-tight">
              Edit<span className="text-purple-600">.com</span>
            </span>
          </Link>

          {/* Heading */}
          <h1 className="text-2xl sm:text-[26px] font-bold text-[#0F0F0F] tracking-tight">
            {step === 'email' ? 'Welcome back' : 'Verify your email'}
          </h1>
          {/* Subtitle */}
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
            {step === 'email'
              ? 'Log in to continue to your workspace.'
              : 'We sent a 6-digit verification code to your email.'}
          </p>

          {/* User Email Pill on OTP screen */}
          {step === 'otp' && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-100/80 rounded-full">
              <Mail className="w-3.5 h-3.5 text-purple-600" />
              <span className="text-xs font-semibold text-purple-800">{email}</span>
            </div>
          )}
        </div>

        {/* Authentication Card */}
        <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 transition-all">
          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`mb-5 p-3 rounded-xl text-xs font-medium flex items-start gap-2.5 transition-all ${
                feedback.type === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-purple-50 text-purple-700 border border-purple-200'
              }`}
              role="alert"
            >
              {feedback.type === 'error' && (
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              {feedback.type === 'success' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              )}
              {feedback.type === 'info' && (
                <KeyRound className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
              )}
              <span className="flex-1 leading-relaxed">{feedback.message}</span>
              <button
                type="button"
                onClick={() => setFeedback(null)}
                className="text-current opacity-50 hover:opacity-100 font-bold ml-1"
                aria-label="Dismiss message"
              >
                ✕
              </button>
            </div>
          )}

          {/* SCREEN 1: EMAIL LOGIN */}
          {step === 'email' ? (
            <div>
              <form onSubmit={handleSendOtpSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="auth-email"
                    className="block text-xs font-semibold text-gray-700 mb-1.5"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="auth-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (feedback?.type === 'error') setFeedback(null);
                      }}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm text-[#0F0F0F] placeholder-gray-400 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 hover:border-gray-300 transition-all"
                    />
                  </div>
                </div>

                {/* Primary Action: Send OTP */}
                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full mt-2 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md hover:shadow-purple-600/20 focus:outline-none focus:ring-4 focus:ring-purple-500/25 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSendingOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <span>Send OTP</span>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-gray-400 font-semibold tracking-wider">
                    OR
                  </span>
                </div>
              </div>

              {/* Google Login Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 text-sm font-medium border border-gray-200 hover:border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-150 cursor-pointer disabled:opacity-60"
              >
                {isGoogleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                ) : (
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>
            </div>
          ) : (
            /* SCREEN 2: OTP VERIFICATION */
            <div>
              <form onSubmit={handleVerifyOtpSubmit} className="space-y-6">
                {/* 6-Digit OTP Inputs */}
                <div>
                  <label
                    htmlFor="otp-input-0"
                    className="block text-xs font-semibold text-gray-700 text-center mb-3"
                  >
                    Enter 6-digit verification code
                  </label>
                  <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-input-${index}`}
                        ref={(el) => (otpInputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        autoFocus={index === 0}
                        aria-label={`Digit ${index + 1} of verification code`}
                        className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-xl border transition-all outline-none ${
                          otpHasError
                            ? 'border-red-400 bg-red-50/20 text-red-700 focus:ring-4 focus:ring-red-100'
                            : digit
                            ? 'border-purple-600 bg-purple-50/10 text-[#0F0F0F] ring-2 ring-purple-500/10'
                            : 'border-gray-200 bg-white text-[#0F0F0F] hover:border-gray-300 focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10'
                        }`}
                      />
                    ))}
                  </div>

                  {devOtp && (
                    <div className="mt-3 flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          const digits = devOtp.split('').slice(0, 6);
                          setOtp(digits);
                          setOtpHasError(false);
                        }}
                        className="text-xs text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 px-3 py-1 rounded-full flex items-center gap-1.5 transition cursor-pointer"
                        title="Click to autofill verification code"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>Code: <strong>{devOtp}</strong> (click to autofill)</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Primary Action: Verify & Login */}
                <button
                  type="submit"
                  disabled={isVerifyingOtp || otp.join('').length < 6}
                  className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md hover:shadow-purple-600/20 focus:outline-none focus:ring-4 focus:ring-purple-500/25 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying code...</span>
                    </>
                  ) : (
                    <span>Verify & Login</span>
                  )}
                </button>
              </form>

              {/* Resend Action & Countdown */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col items-center gap-2 text-center">
                {countdown > 0 ? (
                  <p className="text-xs text-gray-500">
                    Resend OTP in <span className="font-semibold text-purple-600">{countdown}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResendingOtp}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors focus:outline-none flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isResendingOtp ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Resending OTP...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Resend OTP</span>
                      </>
                    )}
                  </button>
                )}

                {/* Change Email Navigation */}
                <button
                  type="button"
                  onClick={handleChangeEmail}
                  className="text-xs text-gray-500 hover:text-gray-800 transition-colors inline-flex items-center gap-1 mt-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Change email</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Minimal Subtle Security Footer (No Register or Sign Up links) */}
        <div className="mt-7 text-center">
          <Link
            to={homeUrl}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Edit.com</span>
          </Link>
          <p className="text-[11px] text-gray-400 mt-2.5">
            Protected by Edit.com Secure Passwordless Authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
