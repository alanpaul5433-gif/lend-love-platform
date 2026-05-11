'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Index() {
  const router = useRouter();
  const { uid, profile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!uid) {
      router.replace('/login');
    } else if (profile?.role === 'admin') {
      router.replace('/dashboard');
    } else {
      router.replace('/not-authorized');
    }
  }, [uid, profile, loading, router]);

  return (
    <main className="min-h-screen flex items-center justify-center text-white/40">
      Loading…
    </main>
  );
}
