import type { PropertyFormState } from "@/dashboard/components/property/property-form";
import type { PropertyLegalDocuments } from "@/dashboard/components/property/types";
import type { LegalDocumentFiles } from "@/dashboard/components/property/legal-documents";

type PropertyMediaState = {
  existingImages: string[];
  existingLegalDocuments: PropertyLegalDocuments;
  imageFiles: File[];
  legalDocumentFiles: LegalDocumentFiles;
};

const LEGAL_FILE_FIELDS = [
  "titleDeed",
  "propertyTaxReceipts",
  "occupancyCertificate",
  "floorPlan",
] as const;

function trim(value: string) {
  return value.trim();
}

export function buildBasicStepPayload(form: PropertyFormState) {
  return {
    title: trim(form.title),
    description: trim(form.description),
    category: trim(form.category),
    status: trim(form.status),
    address: trim(form.address),
    city: trim(form.city),
    state: trim(form.state),
    pincode: trim(form.pincode),
    plotNumber: trim(form.plotNumber),
    microMarketLocality: trim(form.microMarketLocality),
    buildingName: trim(form.buildingName),
    roadName: trim(form.roadName),
  };
}

export function buildPlotStepPayload(form: PropertyFormState) {
  return {
    plotArea: trim(form.plotArea),
    plotAreaUnit: trim(form.plotAreaUnit),
    totalCarpetArea: trim(form.totalCarpetArea),
    superArea: trim(form.superArea),
    totalFloorsInBuilding: trim(form.totalFloorsInBuilding),
    floorsOffered: trim(form.floorsOffered),
    totalCarParks: trim(form.totalCarParks),
    carParkingIncluded: trim(form.carParkingIncluded),
    parkingTypes: form.parkingTypes,
    area: trim(form.area),
    buildingType: trim(form.buildingType),
  };
}

export function buildStatusStepPayload(form: PropertyFormState) {
  return {
    constructionStatus: trim(form.constructionStatus),
    ageOfProperty: trim(form.ageOfProperty),
    furnishingStatus: trim(form.furnishingStatus),
    furnishingOther: trim(form.furnishingOther),
  };
}

export function buildFinancialStepPayload(form: PropertyFormState) {
  return {
    totalPrice: trim(form.totalPrice),
    pricePerSqft: trim(form.pricePerSqft),
    propertyTax: trim(form.propertyTax),
    estimatedMonthlyMaintenance: trim(form.estimatedMonthlyMaintenance),
  };
}

export function buildMediaStepFormData(
  title: string,
  approvalsInPlace: string[],
  media: PropertyMediaState,
) {
  const formData = new FormData();
  formData.append("title", title.trim());
  formData.append("approvalsInPlace", JSON.stringify(approvalsInPlace));
  formData.append("existingImages", JSON.stringify(media.existingImages));
  formData.append(
    "existingLegalDocuments",
    JSON.stringify(media.existingLegalDocuments),
  );

  media.imageFiles.forEach((file) => formData.append("images", file));

  for (const field of LEGAL_FILE_FIELDS) {
    media.legalDocumentFiles[field].forEach((file) =>
      formData.append(field, file),
    );
  }

  return formData;
}
