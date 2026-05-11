'use client';

interface Props {
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ value, onChange, disabled }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full border transition ${
        value ? 'bg-primary border-primary' : 'bg-bg-elevated border-border'
      } ${disabled ? 'opacity-50' : 'cursor-pointer hover:opacity-90'}`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-black transition-transform ${
          value ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
