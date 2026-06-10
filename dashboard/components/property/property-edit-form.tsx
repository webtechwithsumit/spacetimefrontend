"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/toast-provider";
import { PageHeader } from "@/dashboard/components/page-header";
import { PropertyFormWizard } from "@/dashboard/components/property/property-form-wizard";
import {
  canEditProperty,
  PropertyResponse,
} from "@/dashboard/components/property/types";
import { usePropertyFormWizard } from "@/dashboard/components/property/use-property-form-wizard";
import {
  AlertBanner,
  BackLink,
  cardClass,
  withCurrentOption,
} from "@/dashboard/components/ui";
import {
  PROPERTY_CATEGORIES,
  PROPERTY_MANAGER_ROLES,
  PROPERTY_STATUSES,
} from "@/dashboard/constants/property";
import { api, getApiErrorMessage } from "@/lib/api";

type PropertyEditFormProps = {
  propertyId: string;
};

export function PropertyEditForm({ propertyId }: PropertyEditFormProps) {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const wizard = usePropertyFormWizard({ mode: "edit", propertyId });
  const { hydrateFromProperty } = wizard;

  const [sellerId, setSellerId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const canEdit = canEditProperty(user?.role, user?._id, sellerId || undefined);

  const fetchProperty = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const { data } = await api.get<PropertyResponse>(
        `/api/properties/${propertyId}`,
      );
      if (!data.success || !data.data) {
        toast.error(data.message || "Failed to load property");
        return;
      }

      const property = data.data;
      const ownerId =
        typeof property.sellerId === "string"
          ? property.sellerId
          : property.sellerId?._id ?? "";

      setSellerId(ownerId);
      hydrateFromProperty(property);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, propertyId, toast, hydrateFromProperty]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  if (!PROPERTY_MANAGER_ROLES.includes(user?.role ?? "")) {
    return (
      <div>
        <PageHeader
          title="Edit Property"
          description="Update property listing details."
        />
        <AlertBanner message="Seller or Admin access required to edit properties." />
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Edit Property"
          description="Update property listing details."
        />
        <div className={`${cardClass} h-96 animate-pulse`} />
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div>
        <BackLink href="/dashboard/property" label="Back to Properties" />
        <PageHeader
          title="Edit Property"
          description="Update property listing details."
        />
        <AlertBanner message="You can only edit properties that you own." />
      </div>
    );
  }

  return (
    <div>
      <BackLink href="/dashboard/property" label="Back to Properties" />

      <PageHeader
        title="Edit Property"
        description="Complete each step and save before moving to the next."
      />

      <PropertyFormWizard
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
        categoryOptions={withCurrentOption(
          wizard.form.category,
          PROPERTY_CATEGORIES,
        )}
        statusOptions={withCurrentOption(wizard.form.status, PROPERTY_STATUSES)}
      />
    </div>
  );
}
