import Link from "next/link";
import {
  btnPrimaryClass,
  btnSecondaryClass,
} from "@/dashboard/components/ui/form-styles";

type FormWizardFooterProps = {
  step: number;
  totalSteps: number;
  pending: boolean;
  cancelHref: string;
  onPrevious: () => void;
  onSave: () => void;
  minStep?: number;
  continueLabel?: string;
};

export function FormWizardFooter({
  step,
  totalSteps,
  pending,
  cancelHref,
  onPrevious,
  onSave,
  minStep = 1,
  continueLabel,
}: FormWizardFooterProps) {
  const primaryLabel = pending
    ? "Saving..."
    : (continueLabel ??
      (step === totalSteps ? "Save & Finish" : "Save & Continue"));

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-6 dark:border-zinc-800">
      {step > minStep && (
        <button
          type="button"
          disabled={pending}
          onClick={onPrevious}
          className={btnSecondaryClass}
        >
          Previous
        </button>
      )}

      <button
        type="button"
        disabled={pending}
        onClick={onSave}
        className={btnPrimaryClass}
      >
        {primaryLabel}
      </button>

      <Link href={cancelHref} className={`ml-auto ${btnSecondaryClass}`}>
        Cancel
      </Link>
    </div>
  );
}
