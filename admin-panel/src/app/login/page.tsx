'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmail, signInAsDemoAdmin } from '@/lib/auth';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { uid, profile, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState<'none' | 'signin' | 'demo'>('none');
  const [error, setError] = useState('');

  useEffect(() => {
    if (loading) return;
    if (uid && profile?.role === 'admin') {
      router.replace('/dashboard');
    }
  }, [uid, profile, loading, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy('signin');
    try {
      await signInWithEmail(email, password);
      // AuthProvider will fetch the profile; redirect happens via effect above
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : 'Sign in failed';
      setError(m);
    } finally {
      setBusy('none');
    }
  };

  const handleDemoAdmin = async () => {
    setError('');
    setBusy('demo');
    try {
      await signInAsDemoAdmin();
      router.replace('/dashboard');
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : 'Could not start demo';
      setError(m);
    } finally {
      setBusy('none');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-3xl text-black">♥</span>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              <span className="text-primary-light">Lend</span>{' '}
              <span className="text-secondary">LOVE</span>
              <span className="text-xs text-white/40 align-super">™</span>
            </h1>
            <p className="text-white/60 text-sm mt-1">Admin Panel</p>
          </div>
        </div>

        <form onSubmit={handleSignIn} className="space-y-3">
          <div>
            <label className="block text-xs text-white/60 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg-elevated border border-border rounded-md px-3 py-2.5 text-sm outline-none focus:border-primary"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg-elevated border border-border rounded-md px-3 py-2.5 text-sm outline-none focus:border-primary"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-danger border border-danger/30 bg-danger/10 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy !== 'none'}
            className="w-full bg-primary hover:bg-primary-light disabled:opacity-50 text-black font-semibold rounded-md py-2.5 transition"
          >
            {busy === 'signin' ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center gap-3 text-xs text-white/40">
          <div className="flex-1 h-px bg-border" />
          <span>Quick Demo</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button
          onClick={handleDemoAdmin}
          disabled={busy !== 'none'}
          className="w-full bg-secondary hover:bg-secondary-dark disabled:opacity-50 text-black font-semibold rounded-md py-2.5 transition"
        >
          {busy === 'demo' ? 'Starting…' : 'Continue as Demo Admin'}
        </button>

        <p className="text-xs text-white/30 text-center">
          Demo admin sees all data with full super-admin access. Audit logging is recorded.
        </p>
      </div>
    </main>
  );
}
