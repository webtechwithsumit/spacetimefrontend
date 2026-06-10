"use client";

import { useRef } from "react";
import { getMediaUrl } from "@/lib/media";

type MediaFilePickerProps = {
  label: string;
  existingUrls: string[];
  pendingFiles: File[];
  onExistingChange: (urls: string[]) => void;
  onPendingChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  hint?: string;
  requireEntityName?: boolean;
  entityName?: string;
};

export function MediaFilePicker({
  label,
  existingUrls,
  pendingFiles,
  onExistingChange,
  onPendingChange,
  accept = "image/*,application/pdf",
  multiple = true,
  disabled = false,
  hint,
  requireEntityName = false,
  entityName = "",
}: MediaFilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const blocked = requireEntityName && !entityName.trim();

  function handleFiles(fileList: FileList | null) {
    if (!fileList?.length || disabled || blocked) return;

    const picked = Array.from(fileList);
    onPendingChange(multiple ? [...pendingFiles, ...picked] : picked);

    if (inputRef.current) inputRef.current.value = "";
  }

  function removeExisting(index: number) {
    onExistingChange(existingUrls.filter((_, i) => i !== index));
  }

  function removePending(index: number) {
    onPendingChange(pendingFiles.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>

      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-4 dark:border-zinc-700 dark:bg-zinc-900/30">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled || blocked}
          onChange={(e) => handleFiles(e.target.files)}
          className="block w-full text-sm text-zinc-600 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-90 disabled:opacity-50 dark:text-zinc-400 dark:file:bg-white dark:file:text-zinc-900"
        />
        {hint && (
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
        )}
        {blocked && (
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
            Enter property title first.
          </p>
        )}
      </div>

      {(existingUrls.length > 0 || pendingFiles.length > 0) && (
        <ul className="mt-3 space-y-2">
          {existingUrls.map((url, index) => (
            <li
              key={`existing-${url}-${index}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <a
                href={getMediaUrl(url)}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-indigo-600 hover:underline dark:text-indigo-400"
              >
                {url.split("/").pop()}
              </a>
              <button
                type="button"
                onClick={() => removeExisting(index)}
                className="shrink-0 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400"
              >
                Remove
              </button>
            </li>
          ))}
          {pendingFiles.map((file, index) => (
            <li
              key={`pending-${file.name}-${index}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-indigo-200 bg-indigo-50/50 px-3 py-2 text-sm dark:border-indigo-900/50 dark:bg-indigo-950/20"
            >
              <span className="truncate text-zinc-700 dark:text-zinc-300">
                {file.name}
                <span className="ml-2 text-xs text-indigo-600 dark:text-indigo-400">
                  (pending)
                </span>
              </span>
              <button
                type="button"
                onClick={() => removePending(index)}
                className="shrink-0 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
