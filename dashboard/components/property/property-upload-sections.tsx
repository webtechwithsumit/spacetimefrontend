"use client";

import { MediaFilePicker } from "@/components/media-file-picker";
import { labelClass } from "@/dashboard/components/property/types";
import {
  emptyLegalDocumentFiles,
  emptyLegalDocuments,
  normalizeLegalDocuments,
  type LegalDocumentFiles,
} from "@/dashboard/components/property/legal-documents";
import {
  PROPERTY_APPROVALS,
  PROPERTY_DOCUMENT_ACCEPT,
} from "@/dashboard/constants/property";
import type { PropertyLegalDocuments } from "@/dashboard/components/property/types";

type PropertyUploadSectionsProps = {
  title: string;
  existingImages: string[];
  existingLegalDocuments: PropertyLegalDocuments;
  imageFiles: File[];
  legalDocumentFiles: LegalDocumentFiles;
  approvalsInPlace: string[];
  onExistingImagesChange: (urls: string[]) => void;
  onExistingLegalDocumentsChange: (docs: PropertyLegalDocuments) => void;
  onImageFilesChange: (files: File[]) => void;
  onLegalDocumentFilesChange: (files: LegalDocumentFiles) => void;
  onApprovalsChange: (approvals: string[]) => void;
};

function updateLegalExisting(
  docs: PropertyLegalDocuments,
  key: keyof Omit<PropertyLegalDocuments, "approvalsInPlace">,
  urls: string[],
) {
  return { ...docs, [key]: urls };
}

function updateLegalPending(
  files: LegalDocumentFiles,
  key: keyof LegalDocumentFiles,
  pending: File[],
) {
  return { ...files, [key]: pending };
}

export function PropertyUploadSections({
  title,
  existingImages,
  existingLegalDocuments,
  imageFiles,
  legalDocumentFiles,
  approvalsInPlace,
  onExistingImagesChange,
  onExistingLegalDocumentsChange,
  onImageFilesChange,
  onLegalDocumentFilesChange,
  onApprovalsChange,
}: PropertyUploadSectionsProps) {
  const legal = normalizeLegalDocuments(existingLegalDocuments);

  function toggleApproval(approval: string) {
    if (approvalsInPlace.includes(approval)) {
      onApprovalsChange(approvalsInPlace.filter((item) => item !== approval));
      return;
    }
    onApprovalsChange([...approvalsInPlace, approval]);
  }

  return (
    <>
      <div className="sm:col-span-2 space-y-4 rounded-2xl border border-zinc-100 bg-zinc-50/40 p-4 dark:border-zinc-800 dark:bg-zinc-900/20">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
          Media
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <MediaFilePicker
            label="Property Images"
            entityName={title}
            requireEntityName
            existingUrls={existingImages}
            pendingFiles={imageFiles}
            onExistingChange={onExistingImagesChange}
            onPendingChange={onImageFilesChange}
            accept="image/*"
          />
          <MediaFilePicker
            label="Floor Plan / Site Layout"
            entityName={title}
            requireEntityName
            existingUrls={legal.floorPlan}
            pendingFiles={legalDocumentFiles.floorPlan}
            onExistingChange={(urls) =>
              onExistingLegalDocumentsChange(
                updateLegalExisting(legal, "floorPlan", urls),
              )
            }
            onPendingChange={(files) =>
              onLegalDocumentFilesChange(
                updateLegalPending(legalDocumentFiles, "floorPlan", files),
              )
            }
            accept={PROPERTY_DOCUMENT_ACCEPT}
          />
        </div>
      </div>

      <div className="sm:col-span-2 space-y-4 rounded-2xl border border-zinc-100 bg-zinc-50/40 p-4 dark:border-zinc-800 dark:bg-zinc-900/20">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
          Legal &amp; Documentation
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <MediaFilePicker
            label="Title Deed"
            entityName={title}
            requireEntityName
            existingUrls={legal.titleDeed}
            pendingFiles={legalDocumentFiles.titleDeed}
            onExistingChange={(urls) =>
              onExistingLegalDocumentsChange(
                updateLegalExisting(legal, "titleDeed", urls),
              )
            }
            onPendingChange={(files) =>
              onLegalDocumentFilesChange(
                updateLegalPending(legalDocumentFiles, "titleDeed", files),
              )
            }
            accept={PROPERTY_DOCUMENT_ACCEPT}
          />
          <MediaFilePicker
            label="Property Tax Receipts"
            entityName={title}
            requireEntityName
            existingUrls={legal.propertyTaxReceipts}
            pendingFiles={legalDocumentFiles.propertyTaxReceipts}
            onExistingChange={(urls) =>
              onExistingLegalDocumentsChange(
                updateLegalExisting(legal, "propertyTaxReceipts", urls),
              )
            }
            onPendingChange={(files) =>
              onLegalDocumentFilesChange(
                updateLegalPending(
                  legalDocumentFiles,
                  "propertyTaxReceipts",
                  files,
                ),
              )
            }
            accept={PROPERTY_DOCUMENT_ACCEPT}
          />
          <MediaFilePicker
            label="Occupancy Certificate (OC)"
            entityName={title}
            requireEntityName
            existingUrls={legal.occupancyCertificate}
            pendingFiles={legalDocumentFiles.occupancyCertificate}
            onExistingChange={(urls) =>
              onExistingLegalDocumentsChange(
                updateLegalExisting(legal, "occupancyCertificate", urls),
              )
            }
            onPendingChange={(files) =>
              onLegalDocumentFilesChange(
                updateLegalPending(
                  legalDocumentFiles,
                  "occupancyCertificate",
                  files,
                ),
              )
            }
            accept={PROPERTY_DOCUMENT_ACCEPT}
          />
          <div>
            <label className={labelClass}>Approvals in Place</label>
            <div className="max-h-44 space-y-2 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900/60">
              {PROPERTY_APPROVALS.map((approval) => (
                <label
                  key={approval}
                  className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                >
                  <input
                    type="checkbox"
                    checked={approvalsInPlace.includes(approval)}
                    onChange={() => toggleApproval(approval)}
                    className="size-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 dark:border-zinc-600"
                  />
                  {approval}
                </label>
              ))}
            </div>
            {approvalsInPlace.length > 0 && (
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                Selected: {approvalsInPlace.join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export {
  emptyLegalDocuments,
  emptyLegalDocumentFiles,
  normalizeLegalDocuments,
};
