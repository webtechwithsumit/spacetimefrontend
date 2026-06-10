"use client";

import { useAuth } from "@/components/auth-provider";
import { PageHeader } from "@/dashboard/components/page-header";
import { PropertyFormWizard } from "@/dashboard/components/property/property-form-wizard";
import { usePropertyFormWizard } from "@/dashboard/components/property/use-property-form-wizard";
import { AlertBanner, BackLink } from "@/dashboard/components/ui";
import { PROPERTY_MANAGER_ROLES } from "@/dashboard/constants/property";

export function PropertyCreateForm() {
  const { user } = useAuth();
  const canManage = PROPERTY_MANAGER_ROLES.includes(user?.role ?? "");
  const wizard = usePropertyFormWizard({ mode: "create" });

  if (!canManage) {
    return (
      <div>
        <PageHeader
          title="Create Property"
          description="Add a new property listing."
        />
        <AlertBanner message="Seller or Broker access required to create properties." />
      </div>
    );
  }

  return (
    <div>
      <BackLink href="/dashboard/property" label="Back to Properties" />

      <PageHeader
        title="Create Property"
        description="Complete each step and save before moving to the next."
      />

      <PropertyFormWizard
        mode="create"
        step={wizard.step}
        maxStep={wizard.maxStep}
        pending={wizard.pending}
        form={wizard.form}
        existingImages={wizard.existingImages}
        existingLegalDocuments={wizard.existingLegalDocuments}
        imageFiles={wizard.imageFiles}
        legalDocumentFiles={wizard.legalDocumentFiles}
        approvalsInPlace={wizard.approvalsInPlace}
        onFieldChange={wizard.updateField}
        onParkingTypesChange={wizard.updateParkingTypes}
        onExistingImagesChange={wizard.setExistingImages}
        onExistingLegalDocumentsChange={wizard.setExistingLegalDocuments}
        onImageFilesChange={wizard.setImageFiles}
        onLegalDocumentFilesChange={wizard.setLegalDocumentFiles}
        onApprovalsChange={wizard.setApprovalsInPlace}
        onStepClick={wizard.handleStepClick}
        onPrevious={() => wizard.setStep((prev) => prev - 1)}
        onSave={wizard.handleSaveAndContinue}
      />
    </div>
  );
}
