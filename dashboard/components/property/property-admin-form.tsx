"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/toast-provider";
import { PageHeader } from "@/dashboard/components/page-header";
import { PropertyAdminFields } from "@/dashboard/components/property/property-admin-fields";
import {
  emptyPropertyAdminForm,
  mapPropertyToAdminForm,
  type PropertyAdminFormState,
} from "@/dashboard/components/property/property-admin-state";
import {
  BrokerOption,
  isAdminUser,
  PropertyResponse,
} from "@/dashboard/components/property/types";
import {
  AlertBanner,
  BackLink,
  btnPrimaryClass,
  btnSecondaryClass,
  cardClass,
} from "@/dashboard/components/ui";
import { api, getApiErrorMessage } from "@/lib/api";
import { buildAdminAuctionPayload } from "@/lib/property-admin-form-data";

type BrokersResponse = {
  success: boolean;
  data?: BrokerOption[];
  message?: string;
};

type PropertyAdminFormProps = {
  propertyId: string;
};

export function PropertyAdminForm({ propertyId }: PropertyAdminFormProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [propertyTitle, setPropertyTitle] = useState("");
  const [form, setForm] = useState<PropertyAdminFormState>(
    emptyPropertyAdminForm(),
  );
  const [brokers, setBrokers] = useState<BrokerOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  const isAdmin = isAdminUser(user?.role);

  const loadData = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) return;
    setLoading(true);
    try {
      const [propertyRes, brokersRes] = await Promise.all([
        api.get<PropertyResponse>(`/api/properties/${propertyId}`),
        api.get<BrokersResponse>("/api/users/brokers"),
      ]);

      if (!propertyRes.data.success || !propertyRes.data.data) {
        toast.error(propertyRes.data.message || "Failed to load property");
        return;
      }

      setPropertyTitle(propertyRes.data.data.title);
      setForm(mapPropertyToAdminForm(propertyRes.data.data));

      if (brokersRes.data.success) {
        setBrokers(brokersRes.data.data ?? []);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin, propertyId, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function updateField(
    field: keyof PropertyAdminFormState,
    value: string,
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setPending(true);
    try {
      const { data } = await api.put<PropertyResponse>(
        `/api/properties/${propertyId}`,
        buildAdminAuctionPayload(form),
      );
      if (!data.success) {
        toast.error(data.message || "Failed to save admin details");
        return;
      }
      toast.success("Auction & listing details saved");
      router.push("/dashboard/property");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setPending(false);
    }
  }

  if (!isAdmin) {
    return (
      <div>
        <PageHeader
          title="Auction & Listing Management"
          description="Admin-only property auction settings."
        />
        <AlertBanner message="Only Admin or Super-Admin can access this form." />
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Auction & Listing Management"
          description="Admin-only property auction settings."
        />
        <div className={`${cardClass} h-96 animate-pulse`} />
      </div>
    );
  }

  return (
    <div>
      <BackLink href="/dashboard/property" label="Back to Properties" />

      <PageHeader
        title="Admin Form: Auction & Listing Management"
        description={
          propertyTitle
            ? `Managing auction settings for “${propertyTitle}”.`
            : "Admin-only auction and listing enrichment."
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <Link
          href={`/dashboard/property/${propertyId}/edit`}
          className={btnSecondaryClass}
        >
          Edit Property Details
        </Link>
      </div>

      <div className={cardClass}>
        <PropertyAdminFields
          form={form}
          brokers={brokers}
          onFieldChange={updateField}
        />

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-6 dark:border-zinc-800">
          <button
            type="button"
            disabled={pending}
            onClick={handleSave}
            className={btnPrimaryClass}
          >
            {pending ? "Saving..." : "Save Admin Details"}
          </button>

          <Link
            href="/dashboard/property"
            className={`ml-auto ${btnSecondaryClass}`}
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
