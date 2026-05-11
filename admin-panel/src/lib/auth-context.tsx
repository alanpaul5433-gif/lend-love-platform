'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthChange, fetchProfile } from './auth';
import type { User } from '@lendlove/shared';

interface AuthContextValue {
  uid: string | null;
  profile: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  uid: null,
  profile: null,
  loading: true,
  refresh: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [uid, setUid] = useState<string | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUid(u);
      if (u) {
        const p = await fetchProfile(u);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const refresh = async () => {
    if (uid) setProfile(await fetchProfile(uid));
  };

  return (
    <AuthContext.Provider value={{ uid, profile, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

/** Redirects to login if not signed in, or to dashboard if signed-in user is not an admin. */
export function useRequireAdmin() {
  const { uid, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!uid) {
      router.replace('/login');
      return;
    }
    if (profile && profile.role !== 'admin') {
      router.replace('/not-authorized');
    }
  }, [uid, profile, loading, router, pathname]);

  return { uid, profile, loading };
}
