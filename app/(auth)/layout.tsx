export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/80 via-zinc-50 to-white dark:from-indigo-950/40 dark:via-black dark:to-black" />
      <div className="pointer-events-none absolute -left-32 top-1/4 size-96 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-900/20" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 size-96 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-900/20" />

      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
