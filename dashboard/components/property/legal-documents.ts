import type { PropertyLegalDocuments } from "@/dashboard/components/property/types";

export function emptyLegalDocuments(): PropertyLegalDocuments {
  return {
    titleDeed: [],
    propertyTaxReceipts: [],
    occupancyCertificate: [],
    floorPlan: [],
    approvalsInPlace: [],
  };
}

export function normalizeLegalDocuments(
  value: PropertyLegalDocuments | string[] | undefined | null,
): PropertyLegalDocuments {
  const empty = emptyLegalDocuments();
  if (!value) return empty;

  if (Array.isArray(value)) {
    return { ...empty, titleDeed: value.filter(Boolean) };
  }

  return {
    titleDeed: value.titleDeed ?? [],
    propertyTaxReceipts: value.propertyTaxReceipts ?? [],
    occupancyCertificate: value.occupancyCertificate ?? [],
    floorPlan: value.floorPlan ?? [],
    approvalsInPlace: value.approvalsInPlace ?? [],
  };
}

export type LegalDocumentFiles = {
  titleDeed: File[];
  propertyTaxReceipts: File[];
  occupancyCertificate: File[];
  floorPlan: File[];
};

export function emptyLegalDocumentFiles(): LegalDocumentFiles {
  return {
    titleDeed: [],
    propertyTaxReceipts: [],
    occupancyCertificate: [],
    floorPlan: [],
  };
}
