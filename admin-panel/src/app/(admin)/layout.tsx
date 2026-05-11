'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRequireAdmin } from '@/lib/auth-context';
import { signOut } from '@/lib/auth';
// All admin pages depend on client-side Firebase Auth; skip SSG.

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: '◳' },
  { href: '/users', label: 'Users', icon: '◉' },
  { href: '/kyc', label: 'KYC Queue', icon: '🛡' },
  { href: '/loans', label: 'Loans', icon: '$' },
  { href: '/agreements', label: 'Agreements', icon: '📄' },
  { href: '/reports', label: 'Reports', icon: '◫' },
  { href: '/audit', label: 'Audit Log', icon: '✎' },
  { href: '/config', label: 'Configuration', icon: '⚙' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { uid, profile, loading } = useRequireAdmin();

  if (loading || !uid) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/40">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 border-r border-border bg-bg-surface flex flex-col">
        <div className="px-5 py-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-black">♥</span>
            </div>
            <div>
              <div className="text-sm font-bold leading-tight">
                <span className="text-primary-light">Lend</span>{' '}
                <span className="text-secondary">LOVE</span>
              </div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider">Admin</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5 text-sm">
          {NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(n.href + '/');
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                  active
                    ? 'bg-primary/15 text-primary-light'
                    : 'text-white/70 hover:bg-bg-elevated hover:text-white'
                }`}
              >
                <span className="w-5 text-center text-base opacity-80">{n.icon}</span>
                <span>{n.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-border space-y-2 text-sm">
          <div className="px-3 text-xs text-white/50 leading-tight">
            <div className="font-semibold text-white/80">
              {profile?.fullName ?? 'Admin'}
            </div>
            <div className="truncate">{profile?.email}</div>
            <div className="mt-1 inline-block bg-primary/15 text-primary-light px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
              {profile?.adminTier ?? 'admin'}
            </div>
          </div>
          <button
            onClick={async () => {
              await signOut();
              window.location.href = '/login';
            }}
            className="w-full text-left px-3 py-2 rounded-md text-danger hover:bg-danger/10 transition"
          >
            ↩ Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <div className="px-8 py-6 max-w-[1400px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
