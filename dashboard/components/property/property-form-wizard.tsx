"use client";

import { PropertyBasicFields } from "@/dashboard/components/property/property-basic-fields";
import { PropertyFinancialStepFields } from "@/dashboard/components/property/property-financial-step-fields";
import { PropertyFormSteps } from "@/dashboard/components/property/property-form-steps";
import { PropertyPlotFields } from "@/dashboard/components/property/property-plot-fields";
import { PropertyStatusFields } from "@/dashboard/components/property/property-status-fields";
import type { PropertyFormState } from "@/dashboard/components/property/property-form";
import { PropertyUploadSections } from "@/dashboard/components/property/property-upload-sections";
import type { PropertyLegalDocuments } from "@/dashboard/components/property/types";
import type { LegalDocumentFiles } from "@/dashboard/components/property/legal-documents";
import {
  cardClass,
  FormWizardFooter,
} from "@/dashboard/components/ui";
import { PROPERTY_TOTAL_STEPS } from "@/dashboard/components/property/use-property-form-wizard";

type PropertyFormWizardProps = {
  step: number;
  maxStep: number;
  pending: boolean;
  form: PropertyFormState;
  existingImages: string[];
  existingLegalDocuments: PropertyLegalDocuments;
  imageFiles: File[];
  legalDocumentFiles: LegalDocumentFiles;
  approvalsInPlace: string[];
  onFieldChange: (field: keyof PropertyFormState, value: string) => void;
  onParkingTypesChange: (types: string[]) => void;
  onExistingImagesChange: (urls: string[]) => void;
  onExistingLegalDocumentsChange: (docs: PropertyLegalDocuments) => void;
  onImageFilesChange: (files: File[]) => void;
  onLegalDocumentFilesChange: (files: LegalDocumentFiles) => void;
  onApprovalsChange: (approvals: string[]) => void;
  onStepClick: (step: number) => void;
  onPrevious: () => void;
  onSave: () => void;
  categoryOptions?: string[];
  statusOptions?: string[];
};

export function PropertyFormWizard({
  step,
  maxStep,
  pending,
  form,
  existingImages,
  existingLegalDocuments,
  imageFiles,
  legalDocumentFiles,
  approvalsInPlace,
  onFieldChange,
  onParkingTypesChange,
  onExistingImagesChange,
  onExistingLegalDocumentsChange,
  onImageFilesChange,
  onLegalDocumentFilesChange,
  onApprovalsChange,
  onStepClick,
  onPrevious,
  onSave,
  categoryOptions,
  statusOptions,
}: PropertyFormWizardProps) {
  return (
    <div className={cardClass}>
      <PropertyFormSteps
        currentStep={step}
        maxStep={maxStep}
        onStepClick={onStepClick}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {step === 1 && (
          <PropertyBasicFields
            form={form}
            onFieldChange={onFieldChange}
            categoryOptions={categoryOptions}
            statusOptions={statusOptions}
          />
        )}

        {step === 2 && (
          <PropertyPlotFields
            form={form}
            onFieldChange={onFieldChange}
            onParkingTypesChange={onParkingTypesChange}
          />
        )}

        {step === 3 && (
          <PropertyStatusFields form={form} onFieldChange={onFieldChange} />
        )}

        {step === 4 && (
          <PropertyFinancialStepFields
            form={form}
            onFieldChange={onFieldChange}
          />
        )}

        {step === PROPERTY_TOTAL_STEPS && (
          <>
            <div className="sm:col-span-2">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                Media &amp; Documents
              </h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Upload images, floor plans, and legal documents.
              </p>
            </div>
            <PropertyUploadSections
              title={form.title}
              existingImages={existingImages}
              existingLegalDocuments={existingLegalDocuments}
              imageFiles={imageFiles}
              legalDocumentFiles={legalDocumentFiles}
              approvalsInPlace={approvalsInPlace}
              onExistingImagesChange={onExistingImagesChange}
              onExistingLegalDocumentsChange={onExistingLegalDocumentsChange}
              onImageFilesChange={onImageFilesChange}
              onLegalDocumentFilesChange={onLegalDocumentFilesChange}
              onApprovalsChange={onApprovalsChange}
            />
          </>
        )}
      </div>

      <FormWizardFooter
        step={step}
        totalSteps={PROPERTY_TOTAL_STEPS}
        pending={pending}
        cancelHref="/dashboard/property"
        onPrevious={onPrevious}
        onSave={onSave}
      />
    </div>
  );
}
