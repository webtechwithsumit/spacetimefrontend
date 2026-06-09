type AuthInputProps = {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  icon?: React.ReactNode;
};

export function AuthInput({
  id,
  name,
  type,
  label,
  placeholder,
  required = true,
  autoComplete,
  icon,
}: AuthInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
            {icon}
          </span>
        )}
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-indigo-400 dark:focus:bg-zinc-900 dark:focus:ring-indigo-400/10 ${
            icon ? "pl-10 pr-4" : "px-4"
          }`}
        />
      </div>
    </div>
  );
}
