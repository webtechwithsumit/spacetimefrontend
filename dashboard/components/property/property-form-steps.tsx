"use client";

import { FormStepper } from "@/dashboard/components/ui/form-stepper";

const PROPERTY_STEPS = [
  { id: 1, label: "Basic Details", shortLabel: "Basic" },
  { id: 2, label: "Plot & Building", shortLabel: "Plot" },
  { id: 3, label: "Property Status", shortLabel: "Status" },
  { id: 4, label: "Financial Details", shortLabel: "Financial" },
  { id: 5, label: "Media & Documents", shortLabel: "Media" },
] as const;

type PropertyFormStepsProps = {
  currentStep: number;
  maxStep: number;
  onStepClick: (step: number) => void;
};

export function PropertyFormSteps({
  currentStep,
  maxStep,
  onStepClick,
}: PropertyFormStepsProps) {
  return (
    <FormStepper
      steps={PROPERTY_STEPS}
      currentStep={currentStep}
      maxStep={maxStep}
      onStepClick={onStepClick}
      ariaLabel="Property form steps"
    />
  );
}
