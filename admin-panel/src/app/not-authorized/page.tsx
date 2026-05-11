'use client';

import Link from 'next/link';
import { signOut } from '@/lib/auth';

export default function NotAuthorizedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-sm text-center space-y-4">
        <div className="text-5xl">⚠</div>
        <h1 className="text-2xl font-bold text-danger">Not authorized</h1>
        <p className="text-white/60 text-sm">
          You're signed in but your account does not have admin access.
        </p>
        <button
          onClick={async () => {
            await signOut();
            window.location.href = '/login';
          }}
          className="bg-bg-surface hover:bg-bg-elevated border border-border rounded-md px-4 py-2 text-sm"
        >
          Sign in as a different user
        </button>
        <div>
          <Link href="/login" className="text-primary-light text-sm">
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}
