import type { ReactNode } from "react";

type FormSectionProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function FormSection({
  title,
  children,
  className = "",
}: FormSectionProps) {
  return (
    <div
      className={`rounded-xl border border-zinc-200 dark:border-zinc-800 ${className}`}
    >
      <div className="rounded-t-xl border-b border-zinc-200 bg-zinc-100/80 px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          {title}
        </h3>
      </div>
      <div className="rounded-b-xl bg-white p-4 dark:bg-zinc-950">{children}</div>
    </div>
  );
}
