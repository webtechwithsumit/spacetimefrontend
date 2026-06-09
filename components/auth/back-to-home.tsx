import Link from "next/link";

export function BackToHome() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
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
  );
}
