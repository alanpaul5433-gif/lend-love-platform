import type { LoanStatus } from '@lendlove/shared';

const MAP: Record<LoanStatus, { label: string; cls: string }> = {
  draft: { label: 'Draft', cls: 'bg-bg-elevated text-white/60' },
  published: { label: 'Published', cls: 'bg-primary/15 text-primary-light' },
  'pending-agreement': { label: 'Pending Agreement', cls: 'bg-secondary/15 text-secondary' },
  'pending-disbursement': { label: 'Pending Disbursement', cls: 'bg-secondary/15 text-secondary' },
  active: { label: 'Active', cls: 'bg-primary/15 text-primary-light' },
  overdue: { label: 'Overdue', cls: 'bg-danger/15 text-danger' },
  completed: { label: 'Completed', cls: 'bg-bg-elevated text-white/70' },
  cancelled: { label: 'Cancelled', cls: 'bg-bg-elevated text-white/50' },
  defaulted: { label: 'Defaulted', cls: 'bg-danger/15 text-danger' },
};

export function LoanStatusBadge({ status }: { status: LoanStatus }) {
  const s = MAP[status] ?? { label: status, cls: 'bg-bg-elevated text-white/50' };
  return (
    <span
      className={`${s.cls} px-2 py-0.5 rounded text-[10px] uppercase tracking-wider whitespace-nowrap`}
    >
      {s.label}
    </span>
  );
}
