import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Lock, Mail, User, AlertCircle, Loader, HelpCircle, CheckCircle, Key } from 'lucide-react';
import AuthService from '../services/authService';

const Login = () => {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regLocation, setRegLocation] = useState('');

  // Forgot password flow state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Send OTP, 2: Verify OTP, 3: Change Password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotComplete, setForgotComplete] = useState(false);

  const resetForgotState = () => {
    setForgotStep(1);
    setForgotEmail('');
    setForgotOtp('');
    setForgotNewPassword('');
    setForgotConfirmPassword('');
    setForgotLoading(false);
    setForgotSuccess('');
    setForgotError('');
    setForgotComplete(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic Validation
    if (!loginEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (loginPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await AuthService.login(loginEmail, loginPassword);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (regName.trim().length < 3) {
      setError('Name must be at least 3 characters.');
      return;
    }
    if (!regEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await AuthService.register(regName, regEmail, regPassword, regLocation);
      // Auto-login after register
      await AuthService.login(regEmail, regPassword);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setForgotError('Please enter a valid email address.');
      return;
    }

    setForgotLoading(true);
    try {
      const response = await AuthService.forgotPassword(forgotEmail);
      // Advance to step 2 on success
      setForgotStep(2);
      setForgotSuccess(response.message || 'OTP sent successfully!');
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Error occurred. Please verify your email is registered on Traveloop.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (forgotOtp.trim().length !== 6) {
      setForgotError('OTP must be exactly 6 digits.');
      return;
    }

    setForgotLoading(true);
    try {
      const response = await AuthService.verifyOtp(forgotEmail, forgotOtp);
      // Advance to step 3 on success
      setForgotStep(3);
      setForgotSuccess(response.message || 'OTP verified successfully!');
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (forgotNewPassword.length < 6) {
      setForgotError('Password must be at least 6 characters.');
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('Passwords do not match.');
      return;
    }

    setForgotLoading(true);
    try {
      const response = await AuthService.resetPassword(forgotEmail, forgotOtp, forgotNewPassword);
      setForgotSuccess(response.message || 'Your password has been changed successfully!');
      setForgotComplete(true);
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Failed to reset password. Please request a new OTP.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-slate-100">
      {/* Premium Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full opacity-20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500 rounded-full opacity-20 blur-[120px] animate-pulse" />
      </div>

      <div className="relative w-full max-w-md mx-4">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl shadow-xl shadow-indigo-500/10 mb-4 transform hover:rotate-12 transition-transform duration-300">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-purple-200 tracking-tight">
            Traveloop
          </h1>
          <p className="mt-2 text-sm text-indigo-200/60 font-medium">Plan your next adventure with ease.</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          {/* Tab switcher */}
          <div className="flex border-b border-white/5">
            <button
              onClick={() => { setTab('login'); setError(''); }}
              className={`flex-1 py-4 text-sm font-bold transition-all duration-300 ${
                tab === 'login'
                  ? 'text-white border-b-2 border-indigo-400 bg-white/[0.03]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.01]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('register'); setError(''); }}
              className={`flex-1 py-4 text-sm font-bold transition-all duration-300 ${
                tab === 'register'
                  ? 'text-white border-b-2 border-indigo-400 bg-white/[0.03]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.01]'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="p-8">
            {/* Error Alert */}
            {error && (
              <div className="flex items-start gap-2.5 mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm text-red-200 animate-shake">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-200/70 mb-2">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="email"
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all outline-none text-sm text-white placeholder-slate-500"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-200/70">Password</label>
                    <button
                      type="button"
                      onClick={() => { resetForgotState(); setShowForgotModal(true); }}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="password"
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all outline-none text-sm text-white placeholder-slate-500"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 mt-8 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-indigo-500/20"
                >
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : null}
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <div className="text-center pt-4">
                  <p className="text-xs text-slate-400">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setTab('register')}
                      className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Sign Up here
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* REGISTER FORM */}
            {tab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-200/70 mb-2">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="text"
                      required
                      minLength={3}
                      className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all outline-none text-sm text-white placeholder-slate-500"
                      placeholder="John Doe"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-200/70 mb-2">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="email"
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all outline-none text-sm text-white placeholder-slate-500"
                      placeholder="you@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-200/70 mb-2">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all outline-none text-sm text-white placeholder-slate-500"
                      placeholder="Min. 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-200/70 mb-2">
                    Location <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="text"
                      className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all outline-none text-sm text-white placeholder-slate-500"
                      placeholder="e.g. New York, USA"
                      value={regLocation}
                      onChange={(e) => setRegLocation(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 mt-6 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-indigo-500/20"
                >
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : null}
                  {loading ? 'Creating account...' : 'Create Account & Sign In'}
                </button>

                <div className="text-center pt-4">
                  <p className="text-xs text-slate-400">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setTab('login')}
                      className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Sign In here
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          &copy; {new Date().getFullYear()} Traveloop. All rights reserved.
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-fade-in-up relative">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-500/10 rounded-2xl mb-4 text-indigo-400">
              {forgotStep === 1 ? <HelpCircle className="w-6 h-6" /> : forgotStep === 2 ? <Key className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>

            <h3 className="text-xl font-bold text-white mb-1">
              {forgotStep === 1 ? 'Password Recovery' : forgotStep === 2 ? 'Verify OTP' : 'Reset Password'}
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              {forgotStep === 1 
                ? 'Enter your email address and we\'ll send you an OTP to verify ownership.' 
                : forgotStep === 2 
                ? `Enter the 6-digit verification code sent to ${forgotEmail}.` 
                : 'Choose a strong new password of at least 6 characters.'}
            </p>

            {forgotError && (
              <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-200">
                {forgotError}
              </div>
            )}

            {/* Success message on completion */}
            {forgotComplete ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-xs text-green-200 flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-400" />
                  <span>{forgotSuccess}</span>
                </div>
                <button
                  type="button"
                  onClick={() => { resetForgotState(); setShowForgotModal(false); }}
                  className="w-full py-3.5 text-sm font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl transition-all outline-none"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <div>
                {/* Step 1: Send OTP */}
                {forgotStep === 1 && (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        type="email"
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all outline-none text-sm text-white placeholder-slate-500"
                        placeholder="you@example.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => { resetForgotState(); setShowForgotModal(false); }}
                        className="flex-1 py-3 text-sm font-semibold bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl transition-all outline-none"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="flex-1 py-3 text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl transition-all outline-none shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                      >
                        {forgotLoading ? <Loader className="w-4 h-4 animate-spin" /> : null}
                        {forgotLoading ? 'Sending...' : 'Send OTP'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 2: Verify OTP */}
                {forgotStep === 2 && (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    {forgotSuccess && (
                      <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-200">
                        {forgotSuccess}
                      </div>
                    )}
                    <div className="relative group">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all outline-none text-sm text-white placeholder-slate-500 tracking-[0.5em] font-mono text-center"
                        placeholder="------"
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setForgotStep(1)}
                        className="flex-1 py-3 text-sm font-semibold bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl transition-all outline-none"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="flex-1 py-3 text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl transition-all outline-none shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                      >
                        {forgotLoading ? <Loader className="w-4 h-4 animate-spin" /> : null}
                        {forgotLoading ? 'Verifying...' : 'Verify OTP'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 3: Change Password */}
                {forgotStep === 3 && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        type="password"
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all outline-none text-sm text-white placeholder-slate-500"
                        placeholder="New Password"
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        type="password"
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all outline-none text-sm text-white placeholder-slate-500"
                        placeholder="Confirm Password"
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setForgotStep(2)}
                        className="flex-1 py-3 text-sm font-semibold bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl transition-all outline-none"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="flex-1 py-3 text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl transition-all outline-none shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                      >
                        {forgotLoading ? <Loader className="w-4 h-4 animate-spin" /> : null}
                        {forgotLoading ? 'Resetting...' : 'Reset Password'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
