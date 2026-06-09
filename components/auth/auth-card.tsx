import Link from "next/link";
import { BackToHome } from "@/components/auth/back-to-home";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white shadow-md dark:bg-white dark:text-black">
            ST
          </span>
          <span className="text-xl font-semibold tracking-tight">
            <span className="text-zinc-900 dark:text-white">Space</span>
            <span className="text-indigo-500 dark:text-indigo-400">Time</span>
          </span>
        </Link>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {subtitle}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white/80 p-8 shadow-xl shadow-zinc-200/50 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-950/80 dark:shadow-none">
        {children}
      </div>

      {footer && (
        <div className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          {footer}
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <BackToHome />
      </div>
    </div>
  );
}
