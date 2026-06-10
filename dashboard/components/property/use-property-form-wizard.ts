"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useToast } from "@/components/toast-provider";
import {
  emptyPropertyForm,
  mapPropertyToForm,
  type PropertyFormState,
} from "@/dashboard/components/property/property-form";
import {
  emptyLegalDocumentFiles,
  emptyLegalDocuments,
  normalizeLegalDocuments,
} from "@/dashboard/components/property/legal-documents";
import type { PropertyResponse } from "@/dashboard/components/property/types";
import { api, getApiErrorMessage } from "@/lib/api";
import {
  buildBasicStepPayload,
  buildFinancialStepPayload,
  buildMediaStepFormData,
  buildPlotStepPayload,
  buildStatusStepPayload,
} from "@/lib/property-form-data";

export const PROPERTY_TOTAL_STEPS = 5;

type UsePropertyFormWizardOptions = {
  mode: "create" | "edit";
  propertyId?: string;
};

export function usePropertyFormWizard({
  mode,
  propertyId: initialPropertyId,
}: UsePropertyFormWizardOptions) {
  const router = useRouter();
  const toast = useToast();

  const [form, setForm] = useState<PropertyFormState>(emptyPropertyForm());
  const [propertyId, setPropertyId] = useState<string | null>(
    initialPropertyId ?? null,
  );
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingLegalDocuments, setExistingLegalDocuments] = useState(
    emptyLegalDocuments(),
  );
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [legalDocumentFiles, setLegalDocumentFiles] = useState(
    emptyLegalDocumentFiles(),
  );
  const [approvalsInPlace, setApprovalsInPlace] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(mode === "edit" ? PROPERTY_TOTAL_STEPS : 1);

  function updateField(field: keyof PropertyFormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateParkingTypes(types: string[]) {
    setForm((prev) => ({ ...prev, parkingTypes: types }));
  }

  function applySavedProperty(data: PropertyResponse["data"]) {
    if (!data) return;
    const legal = normalizeLegalDocuments(data.legalDocuments);
    setPropertyId(data._id);
    setExistingImages(data.images ?? []);
    setExistingLegalDocuments(legal);
    setApprovalsInPlace(legal.approvalsInPlace);
    setImageFiles([]);
    setLegalDocumentFiles(emptyLegalDocumentFiles());
    setForm(mapPropertyToForm(data));
  }

  const hydrateFromProperty = useCallback(
    (property: PropertyResponse["data"]) => {
      if (!property) return;
      const legal = normalizeLegalDocuments(property.legalDocuments);
      setExistingImages(property.images ?? []);
      setExistingLegalDocuments(legal);
      setApprovalsInPlace(legal.approvalsInPlace);
      setImageFiles([]);
      setLegalDocumentFiles(emptyLegalDocumentFiles());
      setForm(mapPropertyToForm(property));
      setStep(1);
      setMaxStep(PROPERTY_TOTAL_STEPS);
    },
    [],
  );

  function validateBasicStep() {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!form.category.trim()) {
      toast.error("Category is required");
      return false;
    }
    return true;
  }

  function requirePropertyId() {
    if (!propertyId) {
      toast.error("Save basic details first");
      setStep(1);
      return false;
    }
    return true;
  }

  async function saveBasicStep(advance: boolean) {
    if (!validateBasicStep()) return false;
    setPending(true);
    try {
      if (propertyId) {
        const { data } = await api.put<PropertyResponse>(
          `/api/properties/${propertyId}`,
          buildBasicStepPayload(form),
        );
        if (!data.success) {
          toast.error(data.message || "Failed to save basic details");
          return false;
        }
        applySavedProperty(data.data);
        toast.success("Basic details saved");
      } else {
        const { data } = await api.post<PropertyResponse>(
          "/api/properties",
          buildBasicStepPayload(form),
        );
        if (!data.success || !data.data) {
          toast.error(data.message || "Failed to create property");
          return false;
        }
        applySavedProperty(data.data);
        toast.success("Property created");
      }
      if (advance) {
        setStep(2);
        setMaxStep((prev) => Math.max(prev, 2));
      }
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      return false;
    } finally {
      setPending(false);
    }
  }

  async function savePlotStep(advance: boolean) {
    if (mode === "create" && !requirePropertyId()) return false;
    const id = propertyId ?? initialPropertyId;
    if (!id) return false;

    setPending(true);
    try {
      const { data } = await api.put<PropertyResponse>(
        `/api/properties/${id}`,
        buildPlotStepPayload(form),
      );
      if (!data.success) {
        toast.error(data.message || "Failed to save plot details");
        return false;
      }
      applySavedProperty(data.data);
      toast.success("Plot & building details saved");
      if (advance) {
        setStep(3);
        setMaxStep((prev) => Math.max(prev, 3));
      }
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      return false;
    } finally {
      setPending(false);
    }
  }

  async function saveStatusStep(advance: boolean) {
    if (mode === "create" && !requirePropertyId()) return false;
    const id = propertyId ?? initialPropertyId;
    if (!id) return false;

    setPending(true);
    try {
      const { data } = await api.put<PropertyResponse>(
        `/api/properties/${id}`,
        buildStatusStepPayload(form),
      );
      if (!data.success) {
        toast.error(data.message || "Failed to save property status");
        return false;
      }
      applySavedProperty(data.data);
      toast.success("Property status saved");
      if (advance) {
        setStep(4);
        setMaxStep((prev) => Math.max(prev, 4));
      }
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      return false;
    } finally {
      setPending(false);
    }
  }

  async function saveFinancialStep(advance: boolean) {
    if (mode === "create" && !requirePropertyId()) return false;
    const id = propertyId ?? initialPropertyId;
    if (!id) return false;

    setPending(true);
    try {
      const { data } = await api.put<PropertyResponse>(
        `/api/properties/${id}`,
        buildFinancialStepPayload(form),
      );
      if (!data.success) {
        toast.error(data.message || "Failed to save financial details");
        return false;
      }
      applySavedProperty(data.data);
      toast.success("Financial details saved");
      if (advance) {
        setStep(5);
        setMaxStep((prev) => Math.max(prev, 5));
      }
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      return false;
    } finally {
      setPending(false);
    }
  }

  async function saveMediaStep() {
    if (mode === "create" && !requirePropertyId()) return false;
    const id = propertyId ?? initialPropertyId;
    if (!id) return false;

    if (!form.title.trim()) {
      toast.error("Title is required for media upload");
      setStep(1);
      return false;
    }

    setPending(true);
    try {
      const payload = buildMediaStepFormData(form.title, approvalsInPlace, {
        existingImages,
        existingLegalDocuments,
        imageFiles,
        legalDocumentFiles,
      });
      const { data } = await api.put<PropertyResponse>(
        `/api/properties/${id}`,
        payload,
      );
      if (!data.success) {
        toast.error(data.message || "Failed to save media");
        return false;
      }
      applySavedProperty(data.data);
      toast.success("Media saved successfully");
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      return false;
    } finally {
      setPending(false);
    }
  }

  async function handleSaveAndContinue() {
    if (step === 1) {
      await saveBasicStep(true);
      return;
    }
    if (step === 2) {
      await savePlotStep(true);
      return;
    }
    if (step === 3) {
      await saveStatusStep(true);
      return;
    }
    if (step === 4) {
      await saveFinancialStep(true);
      return;
    }
    const saved = await saveMediaStep();
    if (saved) router.push("/dashboard/property");
  }

  function handleStepClick(targetStep: number) {
    if (targetStep <= maxStep) setStep(targetStep);
  }

  return {
    form,
    step,
    maxStep,
    pending,
    existingImages,
    existingLegalDocuments,
    imageFiles,
    legalDocumentFiles,
    approvalsInPlace,
    updateField,
    updateParkingTypes,
    hydrateFromProperty,
    setExistingImages,
    setExistingLegalDocuments,
    setImageFiles,
    setLegalDocumentFiles,
    setApprovalsInPlace,
    handleSaveAndContinue,
    handleStepClick,
    setStep,
  };
}
