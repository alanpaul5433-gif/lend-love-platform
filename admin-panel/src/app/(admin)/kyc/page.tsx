'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchKycSubmissions,
  approveKyc,
  rejectKyc,
  flagForManualReview,
  type KycRow,
} from '@/lib/kyc-service';
import type { KycStatus } from '@lendlove/shared';

type Filter = KycStatus | 'all';

const FILTER_LABELS: Record<Filter, string> = {
  all: 'All',
  none: 'No KYC',
  pending: 'Pending',
  manual_review: 'Manual Review',
  approved: 'Approved',
  rejected: 'Rejected',
};

export default function KycQueuePage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const submissionsQ = useQuery({
    queryKey: ['admin', 'kyc', filter],
    queryFn: () => fetchKycSubmissions(filter),
  });

  const selected = useMemo(
    () => submissionsQ.data?.find((s) => s.id === selectedId) ?? null,
    [submissionsQ.data, selectedId]
  );

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">KYC Review Queue</h1>
          <p className="text-sm text-white/50">
            {submissionsQ.data?.length ?? 0} submissions
          </p>
        </div>
        <button
          onClick={() => submissionsQ.refetch()}
          className="text-xs px-3 py-1.5 bg-bg-surface border border-border rounded-md hover:bg-bg-elevated"
        >
          ⟳ Refresh
        </button>
      </div>

      <div className="flex gap-1 text-xs bg-bg-surface border border-border rounded-md p-1 mb-4 overflow-x-auto">
        {(Object.keys(FILTER_LABELS) as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded whitespace-nowrap ${
              filter === f
                ? 'bg-primary text-black font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[420px,1fr] gap-4">
        <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
          {submissionsQ.isLoading ? (
            <div className="text-white/40 text-sm text-center py-10">Loading…</div>
          ) : (submissionsQ.data?.length ?? 0) === 0 ? (
            <div className="text-white/40 text-sm text-center py-10">No submissions</div>
          ) : (
            <ul className="divide-y divide-border">
              {submissionsQ.data!.map((row) => (
                <li key={row.id}>
                  <button
                    onClick={() => setSelectedId(row.id)}
                    className={`w-full text-left px-4 py-3 transition ${
                      selectedId === row.id
                        ? 'bg-primary/5'
                        : 'hover:bg-bg-elevated'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold truncate">
                          {row.user?.fullName ?? 'Unknown user'}
                        </div>
                        <div className="text-xs text-white/50 truncate">
                          {row.user?.email ?? row.userId.slice(0, 12)}
                        </div>
                      </div>
                      <StatusBadge status={row.status} />
                    </div>
                    <div className="text-[11px] text-white/40 mt-1">
                      Submitted{' '}
                      {new Date(row.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                      {row.confidenceScore != null
                        ? ` · ${Math.round(row.confidenceScore * 100)}% confidence`
                        : ''}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <KycDetailPanel row={selected} />
      </div>
    </div>
  );
}

function KycDetailPanel({ row }: { row: KycRow | null }) {
  const qc = useQueryClient();
  const [rejectionReason, setRejectionReason] = useState('');
  const [showReject, setShowReject] = useState(false);

  const approveMut = useMutation({
    mutationFn: () => approveKyc(row!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'kyc'] });
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
  const rejectMut = useMutation({
    mutationFn: (reason: string) => rejectKyc(row!, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'kyc'] });
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      setShowReject(false);
      setRejectionReason('');
    },
  });
  const flagMut = useMutation({
    mutationFn: () => flagForManualReview(row!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'kyc'] }),
  });

  if (!row) {
    return (
      <div className="bg-bg-surface border border-border rounded-xl p-10 flex items-center justify-center text-white/40">
        Select a submission to review
      </div>
    );
  }

  return (
    <div className="bg-bg-surface border border-border rounded-xl p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold">{row.user?.fullName ?? 'Unknown user'}</h2>
          <div className="text-sm text-white/50">{row.user?.email}</div>
          <div className="text-xs text-white/40 mt-1">
            Submission #{row.id.slice(0, 8)}
          </div>
        </div>
        <StatusBadge status={row.status} />
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs">
        <Info label="Confidence" value={row.confidenceScore != null ? `${Math.round(row.confidenceScore * 100)}%` : '—'} />
        <Info label="AML Flag" value={row.amlFlag ? 'YES' : 'No'} color={row.amlFlag ? 'text-danger' : 'text-primary-light'} />
        <Info
          label="Reviewed"
          value={row.reviewedAt
            ? new Date(row.reviewedAt).toLocaleDateString()
            : 'Not yet'}
        />
      </div>

      <div>
        <h3 className="text-xs uppercase tracking-wider text-white/50 mb-2">
          Documents
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <DocCard label="Government ID" url={row.documents?.idUrl} />
          <DocCard label="Selfie" url={row.documents?.selfieUrl} />
          <DocCard label="Proof of Address" url={row.documents?.addressUrl} />
        </div>
      </div>

      {row.rejectionReason ? (
        <div className="border border-danger/30 bg-danger/10 rounded-md p-3 text-sm">
          <div className="text-xs uppercase tracking-wider text-danger mb-1">
            Previous rejection reason
          </div>
          {row.rejectionReason}
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        {showReject ? (
          <>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Explain to the user what was wrong with the submission…"
              className="w-full bg-bg-elevated border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-danger min-h-[80px]"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowReject(false);
                  setRejectionReason('');
                }}
                className="flex-1 bg-bg-elevated border border-border hover:bg-bg-surface rounded-md py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => rejectMut.mutate(rejectionReason)}
                disabled={!rejectionReason.trim() || rejectMut.isPending}
                className="flex-1 bg-danger hover:bg-danger-light disabled:opacity-50 text-white font-semibold rounded-md py-2 text-sm"
              >
                {rejectMut.isPending ? 'Rejecting…' : 'Confirm Reject'}
              </button>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => approveMut.mutate()}
              disabled={approveMut.isPending || row.status === 'approved'}
              className="bg-primary hover:bg-primary-light disabled:opacity-40 text-black font-semibold rounded-md py-2 text-sm"
            >
              ✓ Approve
            </button>
            <button
              onClick={() => setShowReject(true)}
              disabled={row.status === 'rejected'}
              className="bg-danger/10 hover:bg-danger/20 border border-danger/30 text-danger font-semibold rounded-md py-2 text-sm disabled:opacity-40"
            >
              ✕ Reject
            </button>
            <button
              onClick={() => flagMut.mutate()}
              disabled={row.status === 'manual_review' || flagMut.isPending}
              className="bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 text-secondary font-semibold rounded-md py-2 text-sm disabled:opacity-40"
            >
              ⚑ Flag for review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: KycStatus }) {
  const map: Record<KycStatus, { text: string; cls: string }> = {
    none: { text: 'No KYC', cls: 'bg-bg-elevated text-white/50' },
    pending: { text: 'Pending', cls: 'bg-secondary/15 text-secondary' },
    manual_review: { text: 'Manual Review', cls: 'bg-danger/15 text-danger' },
    approved: { text: 'Approved', cls: 'bg-primary/15 text-primary-light' },
    rejected: { text: 'Rejected', cls: 'bg-danger/15 text-danger' },
  };
  const s = map[status];
  return (
    <span className={`${s.cls} px-2 py-0.5 rounded text-[10px] uppercase tracking-wider whitespace-nowrap`}>
      {s.text}
    </span>
  );
}

function Info({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="bg-bg-elevated border border-border rounded-lg p-3">
      <div className="text-[10px] uppercase tracking-wider text-white/40">{label}</div>
      <div className={`font-bold tabular-nums ${color ?? 'text-white'}`}>{value}</div>
    </div>
  );
}

function DocCard({ label, url }: { label: string; url?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">{label}</div>
      {url ? (
        <>
          <button
            onClick={() => setOpen(true)}
            className="w-full aspect-[4/3] rounded-md overflow-hidden border border-border bg-bg-elevated hover:border-primary transition"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={label} className="w-full h-full object-cover" />
          </button>
          {open && (
            <div
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8 cursor-zoom-out"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={label} className="max-w-full max-h-full rounded-md" />
            </div>
          )}
        </>
      ) : (
        <div className="w-full aspect-[4/3] rounded-md border border-dashed border-border bg-bg-elevated flex items-center justify-center text-white/30 text-xs">
          Not uploaded
        </div>
      )}
    </div>
  );
}
