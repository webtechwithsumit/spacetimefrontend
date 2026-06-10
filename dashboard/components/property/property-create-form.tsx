"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/toast-provider";
import { PageHeader } from "@/dashboard/components/page-header";
import { PropertyBasicFields } from "@/dashboard/components/property/property-basic-fields";
import { PropertyFinancialStepFields } from "@/dashboard/components/property/property-financial-step-fields";
import { PropertyPlotFields } from "@/dashboard/components/property/property-plot-fields";
import { PropertyStatusFields } from "@/dashboard/components/property/property-status-fields";
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
import { PropertyFormSteps } from "@/dashboard/components/property/property-form-steps";
import { PropertyUploadSections } from "@/dashboard/components/property/property-upload-sections";
import {
  cardClass,
  PropertyResponse,
} from "@/dashboard/components/property/types";
import { PROPERTY_MANAGER_ROLES } from "@/dashboard/constants/property";
import { api, getApiErrorMessage } from "@/lib/api";
import {
  buildBasicStepPayload,
  buildFinancialStepPayload,
  buildMediaStepFormData,
  buildPlotStepPayload,
  buildStatusStepPayload,
} from "@/lib/property-form-data";

const TOTAL_STEPS = 5;

export function PropertyCreateForm() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const canManage = PROPERTY_MANAGER_ROLES.includes(user?.role ?? "");

  const [form, setForm] = useState<PropertyFormState>(emptyPropertyForm());
  const [propertyId, setPropertyId] = useState<string | null>(null);
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
  const [maxStep, setMaxStep] = useState(1);

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
      }
      toast.success(propertyId ? "Basic details saved" : "Property created");
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
    if (!requirePropertyId()) return false;
    setPending(true);
    try {
      const { data } = await api.put<PropertyResponse>(
        `/api/properties/${propertyId}`,
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
    if (!requirePropertyId()) return false;
    setPending(true);
    try {
      const { data } = await api.put<PropertyResponse>(
        `/api/properties/${propertyId}`,
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
    if (!requirePropertyId()) return false;
    setPending(true);
    try {
      const { data } = await api.put<PropertyResponse>(
        `/api/properties/${propertyId}`,
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
    if (!requirePropertyId()) return false;
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
        `/api/properties/${propertyId}`,
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

  if (!canManage) {
    return (
      <div>
        <PageHeader title="Create Property" description="Add a new property listing." />
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          Seller or Admin access required to create properties.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard/property" className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to Properties
        </Link>
      </div>

      <PageHeader
        title="Create Property"
        description="Complete each step and save before moving to the next."
      />

      <div className={cardClass}>
        <PropertyFormSteps
          currentStep={step}
          maxStep={maxStep}
          onStepClick={handleStepClick}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {step === 1 && (
            <PropertyBasicFields form={form} onFieldChange={updateField} />
          )}

          {step === 2 && (
            <PropertyPlotFields
              form={form}
              onFieldChange={updateField}
              onParkingTypesChange={updateParkingTypes}
            />
          )}

          {step === 3 && (
            <PropertyStatusFields form={form} onFieldChange={updateField} />
          )}

          {step === 4 && (
            <PropertyFinancialStepFields
              form={form}
              onFieldChange={updateField}
            />
          )}

          {step === TOTAL_STEPS && (
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
                onExistingImagesChange={setExistingImages}
                onExistingLegalDocumentsChange={setExistingLegalDocuments}
                onImageFilesChange={setImageFiles}
                onLegalDocumentFilesChange={setLegalDocumentFiles}
                onApprovalsChange={setApprovalsInPlace}
              />
            </>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-6 dark:border-zinc-800">
          {step > 1 && (
            <button
              type="button"
              disabled={pending}
              onClick={() => setStep((prev) => prev - 1)}
              className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Previous
            </button>
          )}

          <button
            type="button"
            disabled={pending}
            onClick={handleSaveAndContinue}
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-zinc-900"
          >
            {pending ? "Saving..." : step === TOTAL_STEPS ? "Save & Finish" : "Save & Continue"}
          </button>

          <Link
            href="/dashboard/property"
            className="ml-auto rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
