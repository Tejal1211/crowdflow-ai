// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, ArrowRight, Users } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError('Invalid email or password. Try demo mode below.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    loginDemo();
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-600 p-12 text-white relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold">CrowdFlow AI</span>
          </div>
          <p className="text-primary-200 text-sm">Smarter Stadium Experiences Powered by AI</p>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          {/* Mock live stats */}
          <div className="space-y-4 mb-10">
            {[
              { label: 'Gate A — Best Entry', val: '3 min', badge: 'Recommended', color: 'bg-emerald-400/20 text-emerald-200' },
              { label: 'North Stand', val: '72% full', badge: 'Moderate', color: 'bg-amber-400/20 text-amber-200' },
              { label: 'Burger Hub Queue', val: '8 min', badge: 'Busy', color: 'bg-red-400/20 text-red-200' },
            ].map(({ label, val, badge, color }) => (
              <div key={label} className="flex items-center justify-between bg-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm">
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-primary-200 mt-0.5">{val}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${color}`}>{badge}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-primary-200">Live data updating every 5 seconds</span>
          </div>
        </div>

        <div className="relative z-10">
          <blockquote className="text-lg font-medium text-white/90 italic leading-relaxed">
            "The stadium experience has been completely transformed. We never miss a moment waiting in queues."
          </blockquote>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">R</div>
            <div>
              <p className="text-sm font-semibold text-white">Rahul Mehta</p>
              <p className="text-xs text-primary-200">Season Ticket Holder</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right form panel */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white"
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-gray-900 text-lg">CrowdFlow AI</span>
          </div>

          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-500 mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-11"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <button type="button" className="text-xs text-primary-600 hover:underline">Forgot password?</button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
            <span className="relative bg-white px-3 text-sm text-gray-400">or</span>
          </div>

          <button
            onClick={handleDemo}
            className="w-full btn-secondary flex items-center justify-center gap-2 py-3 text-base"
          >
            <Users className="w-4 h-4" />
            Continue as Demo User
          </button>

          <p className="text-center mt-6 text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
