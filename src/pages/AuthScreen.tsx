import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { ConstellationBackground } from '../components/ConstellationBackground';
import { AroundULogo } from '../components/AroundULogo';

export type AuthSubmitPayload = {
  mode: 'signin' | 'signup';
  name?: string;
  email: string;
  password: string;
};

export function AuthScreen({ onAuth }: { onAuth: (payload: AuthSubmitPayload) => void }) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      return;
    }

    onAuth({
      mode,
      email: email.trim(),
      password,
      name: mode === 'signup' ? name.trim() : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center relative overflow-hidden px-4">
      <ConstellationBackground />

      {/* Soft ambient glow */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-primary-200/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-coral-100/30 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-surface-200/40 border border-surface-100 p-10">
          {/* Logo  */}
          <div className="text-center mb-8">
            <AroundULogo showTagline className="justify-center" emblemClassName="h-16 w-16" />
            <p className="text-ink-500 mt-4 text-sm font-medium">Find your people, in real time.</p>
          </div>

          {/* Toggle */}
          <div className="flex bg-surface-50 rounded-2xl p-1 mb-8 border border-surface-100">
            <button
              onClick={() => setMode('signup')}
              className={cn(
                "btn-tactile btn-tactile-soft btn-tactile-slow-press flex-1 cursor-pointer rounded-xl py-2.5 text-sm font-semibold",
                mode === 'signup'
                  ? "bg-white text-ink-900 shadow-sm"
                  : "text-ink-400 hover:text-ink-600"
              )}
            >
              Create Account
            </button>
            <button
              onClick={() => setMode('signin')}
              className={cn(
                "btn-tactile btn-tactile-soft btn-tactile-slow-press flex-1 cursor-pointer rounded-xl py-2.5 text-sm font-semibold",
                mode === 'signin'
                  ? "bg-white text-ink-900 shadow-sm"
                  : "text-ink-400 hover:text-ink-600"
              )}
            >
              Sign In
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <label className="block text-xs font-semibold text-ink-500 mb-1.5 ml-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="What should we call you?"
                  required={mode === 'signup'}
                  className="w-full bg-surface-50 border border-surface-200 rounded-2xl px-4 py-3.5 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all"
                />
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-semibold text-ink-500 mb-1.5 ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your.email@university.edu"
                required
                className="w-full bg-surface-50 border border-surface-200 rounded-2xl px-4 py-3.5 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-500 mb-1.5 ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  className="w-full bg-surface-50 border border-surface-200 rounded-2xl px-4 py-3.5 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn-tactile absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-ink-400 transition-colors hover:bg-surface-100 hover:text-ink-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-tactile btn-tactile-solid btn-tactile-slow-press mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary-500 py-3.5 font-semibold text-white shadow-sm shadow-primary-500/20 hover:bg-primary-600"
            >
              <span>{mode === 'signup' ? 'Get started' : 'Welcome back'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <p className="pt-1 text-center text-xs text-ink-400">
              {mode === 'signup'
                ? 'Just the essentials here. You can finish your profile in calm, guided steps next.'
                : 'Sign in to continue. You can update your profile details at any time.'}
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
