import Link from "next/link";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/auctions", label: "Auctions" },
  { href: "/properties", label: "Properties" },
  { href: "/login", label: "Login" },
];

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/80 via-zinc-50 to-white dark:from-indigo-950/40 dark:via-black dark:to-black" />
      <div className="pointer-events-none absolute -left-32 top-1/4 size-96 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-900/20" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 size-96 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-900/20" />

      <div className="relative z-10 w-full max-w-lg text-center">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white shadow-md dark:bg-white dark:text-black">
            ST
          </span>
          <span className="text-xl font-semibold tracking-tight">
            <span className="text-zinc-900 dark:text-white">Space</span>
            <span className="text-indigo-500 dark:text-indigo-400">Time</span>
          </span>
        </Link>

        <p className="text-8xl font-bold tracking-tight text-zinc-900 dark:text-white">
          404
        </p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved. Let&apos;s get you back on track.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-900/20 transition-all hover:bg-zinc-800 hover:shadow-xl dark:bg-white dark:text-zinc-900 dark:shadow-white/10 dark:hover:bg-zinc-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="size-4"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
