import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  User,
  GraduationCap,
  Building2,
  Briefcase,
  Users,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface AuthScreensProps {
  initialMode: 'login' | 'signup';
  onSuccess: () => void;
  onSwitchMode: (mode: 'login' | 'signup') => void;
  onCancel: () => void;
}

export const AuthScreens: React.FC<AuthScreensProps> = ({
  initialMode,
  onSuccess,
  onSwitchMode,
  onCancel,
}) => {
  const { login, register, loginAsDemo } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. You can also click "Login as Demo User" below.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name,
        email,
        password,
        role: selectedRole,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginMock = async () => {
    setIsLoading(true);
    try {
      // Clean mock for seamless experience
      await login('alex@skillproof.ai', 'password123');
      onSuccess();
    } catch (err: any) {
      setError('Google Sign-In simulation note: logged in with demo profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSelect = async (userId: string) => {
    setIsLoading(true);
    try {
      await loginAsDemo(userId);
      onSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-indigo-500 selection:text-white relative">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-2 mb-3 hover:opacity-80 transition"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">
              SkillProof <span className="text-indigo-400">AI</span>
            </span>
          </button>

          <h2 className="text-xl font-bold text-white">
            {mode === 'login' ? 'Welcome back to SkillProof AI' : 'Create your SkillProof account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'
              ? 'Sign in to access your verified skill roadmap and daily missions.'
              : 'Begin your verifiable learning path from beginner to job-ready.'}
          </p>
        </div>

        {/* Error / Notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {forgotPasswordMessage && (
          <div className="mb-4 p-3 rounded-xl bg-indigo-950/60 border border-indigo-800/80 text-indigo-300 text-xs">
            {forgotPasswordMessage}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@skillproof.ai"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordMessage('For prototype mode, you can log in using demo password "password123" or use the Demo User buttons below.')}
                  className="text-[11px] text-indigo-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Login'}
            </button>

            {/* Google Social Mock Button */}
            <button
              type="button"
              onClick={handleGoogleLoginMock}
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </button>
          </form>
        )}

        {/* SIGN UP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@college.edu or work.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* Role Selection Cards */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                What describes you best?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { role: 'student', label: 'Student', icon: GraduationCap, desc: 'College / Aspirant' },
                  { role: 'employee', label: 'Employee', icon: Briefcase, desc: 'Professional' },
                  { role: 'company_admin', label: 'Company Admin', icon: Building2, desc: 'Engineering Team' },
                  { role: 'faculty', label: 'Faculty', icon: Users, desc: 'Professor / College' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedRole === item.role;
                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => setSelectedRole(item.role as Role)}
                      className={`p-2.5 rounded-xl border text-left transition flex items-start gap-2 ${
                        isSelected
                          ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <div>
                        <span className="text-xs font-bold block text-slate-200">{item.label}</span>
                        <span className="text-[10px] text-slate-500">{item.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Continue to Onboarding'}
            </button>
          </form>
        )}

        {/* Switch Mode Link */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setMode('signup');
                  onSwitchMode('signup');
                }}
                className="text-indigo-400 font-semibold hover:underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setMode('login');
                  onSwitchMode('login');
                }}
                className="text-indigo-400 font-semibold hover:underline"
              >
                Login
              </button>
            </>
          )}
        </div>

        {/* Quick Demo Login Option */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <div className="text-[11px] text-slate-500 text-center mb-2">Or instant demo sign-in:</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleDemoSelect('usr-student-1')}
              className="flex-1 py-1.5 px-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] text-slate-300 font-medium transition text-center"
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => handleDemoSelect('usr-emp-priya')}
              className="flex-1 py-1.5 px-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] text-slate-300 font-medium transition text-center"
            >
              👨‍💼 Employee
            </button>
            <button
              type="button"
              onClick={() => handleDemoSelect('usr-admin-1')}
              className="flex-1 py-1.5 px-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] text-slate-300 font-medium transition text-center"
            >
              🏢 Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
