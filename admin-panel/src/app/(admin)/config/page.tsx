'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchPlatformConfig,
  updatePlatformConfig,
} from '@/lib/config-service';
import { Toggle } from '@/components/Toggle';
import { formatDateTime } from '@/lib/format';
import { COMPLIANCE } from '@lendlove/shared';
import type { PlatformConfig } from '@lendlove/shared';

const FLAG_SECTIONS: Array<{
  title: string;
  description: string;
  flags: { key: string; label: string; description: string }[];
}> = [
  {
    title: 'Mobile Features',
    description: 'Toggle entire features on or off without redeploying.',
    flags: [
      { key: 'mobile.itemLoans', label: 'Item loans', description: 'Allow users to lend physical items' },
      {
        key: 'mobile.borrowerRequests',
        label: 'Borrower requests',
        description: 'Allow borrowers to post loan requests to marketplace',
      },
      {
        key: 'mobile.biometricLogin',
        label: 'Biometric login',
        description: 'FaceID / fingerprint quick-login',
      },
      {
        key: 'mobile.chatAttachments',
        label: 'Chat attachments',
        description: 'Allow images/PDFs in chat',
      },
    ],
  },
  {
    title: 'Compliance',
    description: 'Regulatory enforcement flags.',
    flags: [
      {
        key: 'compliance.requireKycForBorrowing',
        label: 'Require KYC to borrow',
        description: 'Block borrowing until KYC is approved',
      },
      {
        key: 'compliance.requireKycForLending',
        label: 'Require KYC to lend',
        description: 'Block creating loans until KYC is approved',
      },
      {
        key: 'compliance.amlScreeningEnforced',
        label: 'AML screening enforced',
        description: 'Route AML-flagged users to manual review queue',
      },
    ],
  },
  {
    title: 'Integrations (Production)',
    description:
      'These remain off in demo mode. Enable after Blaze upgrade + provider credentials are in Firebase config.',
    flags: [
      {
        key: 'integrations.paykings.enabled',
        label: 'Paykings payments',
        description: 'Route real-money flows through Paykings NMI gateway',
      },
      {
        key: 'integrations.idAnalyzer.enabled',
        label: 'ID Analyzer KYC',
        description: 'Replace mock KYC with real DocuPass verification',
      },
      {
        key: 'integrations.streamChat.enabled',
        label: 'Stream Chat',
        description: 'Replace Firestore chat with Stream Chat at scale',
      },
    ],
  },
  {
    title: 'Maintenance',
    description: 'Emergency switches.',
    flags: [
      {
        key: 'maintenance.readOnlyMode',
        label: 'Read-only mode',
        description: 'Block all writes platform-wide (incident response)',
      },
    ],
  },
];

export default function ConfigPage() {
  const qc = useQueryClient();
  const configQ = useQuery({
    queryKey: ['admin', 'config'],
    queryFn: fetchPlatformConfig,
  });

  // Local draft state
  const [draft, setDraft] = useState<PlatformConfig | null>(null);
  useEffect(() => {
    if (configQ.data && !draft) setDraft(configQ.data);
  }, [configQ.data, draft]);

  const mut = useMutation({
    mutationFn: (next: Partial<PlatformConfig>) =>
      updatePlatformConfig(next, configQ.data!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'config'] }),
  });

  if (!draft || !configQ.data) {
    return <div className="text-white/40 text-sm p-10">Loading configuration…</div>;
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(configQ.data);

  const setField = <K extends keyof PlatformConfig>(key: K, value: PlatformConfig[K]) =>
    setDraft({ ...draft, [key]: value });

  const setFlag = (flagKey: string, value: boolean) =>
    setDraft({
      ...draft,
      featureFlags: { ...draft.featureFlags, [flagKey]: value },
    });

  const save = () => {
    if (!configQ.data) return;
    const diff: Partial<PlatformConfig> = {};
    for (const key of Object.keys(draft) as (keyof PlatformConfig)[]) {
      if (JSON.stringify(draft[key]) !== JSON.stringify(configQ.data[key])) {
        // @ts-expect-error narrowed at runtime
        diff[key] = draft[key];
      }
    }
    mut.mutate(diff);
  };

  const revert = () => setDraft(configQ.data ?? null);

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Platform Configuration</h1>
          <p className="text-sm text-white/50">
            Changes apply across mobile, admin, and backend immediately.
            {configQ.data?.updatedAt
              ? ` Last updated ${formatDateTime(configQ.data.updatedAt)}.`
              : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={revert}
            disabled={!dirty}
            className="text-xs px-3 py-1.5 bg-bg-surface border border-border rounded-md hover:bg-bg-elevated disabled:opacity-40"
          >
            Revert
          </button>
          <button
            onClick={save}
            disabled={!dirty || mut.isPending}
            className="text-xs px-3 py-1.5 bg-primary text-black font-semibold rounded-md hover:bg-primary-light disabled:opacity-40"
          >
            {mut.isPending ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      {/* Compliance banner */}
      <div className="bg-secondary/10 border border-secondary/30 rounded-md p-4 mb-6 text-sm flex gap-3">
        <span className="text-secondary text-base">⚠</span>
        <div>
          <strong className="text-secondary">Store-compliance limits enforced.</strong>{' '}
          Apple App Store and Google Play Personal Loan Policy require APR ≤ {COMPLIANCE.MAX_APR_PERCENT}%,
          loan term ≥ {COMPLIANCE.MIN_LOAN_TERM_DAYS} days, borrower age ≥ {COMPLIANCE.MIN_AGE}.
          These limits are also enforced in client + backend code; values higher than the regulatory cap
          will be rejected by validation.
        </div>
      </div>

      {/* Numeric settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Section title="Loan Limits">
          <NumberField
            label="Minimum loan amount (USD)"
            value={draft.minLoanAmount}
            min={1}
            onChange={(v) => setField('minLoanAmount', v)}
          />
          <NumberField
            label="Maximum loan amount (USD)"
            value={draft.maxLoanAmount}
            min={1}
            onChange={(v) => setField('maxLoanAmount', v)}
          />
        </Section>

        <Section title="Compliance Caps">
          <NumberField
            label="Maximum APR (%)"
            value={draft.maxAPR}
            min={0}
            max={COMPLIANCE.MAX_APR_PERCENT}
            onChange={(v) => setField('maxAPR', v)}
            hint={`Hard cap: ${COMPLIANCE.MAX_APR_PERCENT}% (Google Play policy)`}
          />
          <NumberField
            label="Minimum loan term (days)"
            value={draft.minLoanTermDays}
            min={COMPLIANCE.MIN_LOAN_TERM_DAYS}
            onChange={(v) => setField('minLoanTermDays', v)}
            hint={`Hard floor: ${COMPLIANCE.MIN_LOAN_TERM_DAYS} days (Google Play policy)`}
          />
          <NumberField
            label="Minimum borrower age"
            value={draft.minBorrowerAge}
            min={COMPLIANCE.MIN_AGE}
            onChange={(v) => setField('minBorrowerAge', v)}
            hint={`Hard floor: ${COMPLIANCE.MIN_AGE} (legal contract age)`}
          />
        </Section>

        <Section title="Platform Economics">
          <NumberField
            label="Platform fee (% of disbursed amount)"
            value={draft.feePercent}
            min={0}
            max={20}
            step={0.1}
            onChange={(v) => setField('feePercent', v)}
            hint="Deducted on each loan disbursement."
          />
        </Section>

        <Section title="Bootstrap First Admin">
          <p className="text-xs text-white/50">
            In production this is set via the <code className="text-white/70">setRole</code>{' '}
            Cloud Function (requires Blaze). In demo, the Continue as Demo Admin button creates
            anonymous users with role=admin.
          </p>
        </Section>
      </div>

      {/* Feature flags */}
      {FLAG_SECTIONS.map((sec) => (
        <Section key={sec.title} title={sec.title} description={sec.description}>
          <div className="space-y-3">
            {sec.flags.map((f) => (
              <div key={f.key} className="flex items-center justify-between gap-4 py-2">
                <div>
                  <div className="text-sm font-semibold">{f.label}</div>
                  <div className="text-xs text-white/50">{f.description}</div>
                  <code className="text-[10px] text-white/30 font-mono">{f.key}</code>
                </div>
                <Toggle
                  value={!!draft.featureFlags?.[f.key]}
                  onChange={(v) => setFlag(f.key, v)}
                />
              </div>
            ))}
          </div>
        </Section>
      ))}

      {dirty ? (
        <div className="sticky bottom-4 bg-bg-surface border border-primary/40 rounded-xl p-3 flex items-center justify-between shadow-2xl">
          <div className="text-sm text-white/80">
            Unsaved changes.{' '}
            <span className="text-white/50 text-xs">
              Audit log will record the diff on save.
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={revert}
              className="text-xs px-3 py-1.5 bg-bg-elevated border border-border rounded-md hover:bg-bg-base"
            >
              Revert
            </button>
            <button
              onClick={save}
              disabled={mut.isPending}
              className="text-xs px-3 py-1.5 bg-primary text-black font-semibold rounded-md hover:bg-primary-light disabled:opacity-50"
            >
              {mut.isPending ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bg-surface border border-border rounded-xl p-5 mb-4">
      <div className="mb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white/70">{title}</h2>
        {description ? (
          <p className="text-xs text-white/50 mt-1">{description}</p>
        ) : null}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-white/60 mb-1">{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step ?? 1}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-bg-elevated border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary tabular-nums"
      />
      {hint ? <div className="text-[11px] text-white/40 mt-1">{hint}</div> : null}
    </div>
  );
}
