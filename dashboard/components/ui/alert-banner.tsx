type AlertBannerProps = {
  message: string;
};

export function AlertBanner({ message }: AlertBannerProps) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
      {message}
    </div>
  );
}
