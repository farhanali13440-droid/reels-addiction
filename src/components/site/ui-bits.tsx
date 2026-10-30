import type { ReactNode } from "react";
import { Lock, ShieldCheck } from "lucide-react";

export function StepBadge({ step }: { step: 1 | 2 }) {
  return (
    <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full ${step >= 1 ? "bg-brand text-white" : "bg-muted"}`}
      >
        1
      </span>
      <span className={step === 1 ? "text-ink" : "text-muted-foreground"}>Your details</span>
      <span className="h-px w-6 bg-border" />
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full ${step === 2 ? "bg-brand text-white" : "bg-muted text-muted-foreground"}`}
      >
        2
      </span>
      <span className={step === 2 ? "text-ink" : "text-muted-foreground"}>Payment</span>
    </div>
  );
}

export function TrustRow({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground ${className}`}
    >
      <span className="inline-flex items-center gap-1">
        <Lock className="h-3.5 w-3.5" /> Your details stay private
      </span>
      <span className="inline-flex items-center gap-1">
        <ShieldCheck className="h-3.5 w-3.5" /> 7-day money-back guarantee
      </span>
    </div>
  );
}

export function Field({
  label,
  error,
  children,
  hint,
}: {
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
      {error && <span className="mt-1 block text-xs font-medium text-destructive">{error}</span>}
    </label>
  );
}

export const inputClass =
  "h-12 w-full rounded-xl border border-border bg-white px-4 text-base text-ink outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15";

export function Footer() {
  return (
    <footer className="border-t border-border bg-white px-4 py-8 text-center text-xs text-muted-foreground">
      <p>© {new Date().getFullYear()} Reels Addiction Reset · Farhan Ali Rasheed</p>
      <p className="mt-1">
        This is a self-help guide for building better phone habits. It isn't medical or
        psychological treatment.
      </p>
    </footer>
  );
}
