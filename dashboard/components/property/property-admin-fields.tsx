"use client";

import type { PropertyAdminFormState } from "@/dashboard/components/property/property-admin-state";
import type { BrokerOption } from "@/dashboard/components/property/types";
import {
  CurrencyInput,
  DateTimeInput,
  FormSection,
  SelectField,
  TextareaInput,
  TextInput,
  withCurrentOption,
} from "@/dashboard/components/ui";
import {
  AUCTION_STATUSES,
  YES_NO_OPTIONS,
} from "@/dashboard/constants/property";

type PropertyAdminFieldsProps = {
  form: PropertyAdminFormState;
  brokers: BrokerOption[];
  onFieldChange: (
    field: keyof PropertyAdminFormState,
    value: string,
  ) => void;
};

function brokerOptions(brokers: BrokerOption[], currentId: string) {
  const labels = brokers.map(
    (broker) => `${broker.name} (${broker.email})`,
  );
  const idByLabel = new Map(
    brokers.map((broker) => [
      `${broker.name} (${broker.email})`,
      broker._id,
    ]),
  );

  const currentBroker = brokers.find((b) => b._id === currentId);
  const currentLabel = currentBroker
    ? `${currentBroker.name} (${currentBroker.email})`
    : "";

  const options = withCurrentOption(currentLabel, labels);
  return { options, idByLabel, currentLabel };
}

export function PropertyAdminFields({
  form,
  brokers,
  onFieldChange,
}: PropertyAdminFieldsProps) {
  const { options: advisorOptions, idByLabel, currentLabel } =
    brokerOptions(brokers, form.assignedAuctionAdvisorId);

  return (
    <div className="space-y-4">
      <FormSection title="Admin Verification & Enrichment">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            id="yearBuiltRenovated"
            label="Year Built / Renovated"
            value={form.yearBuiltRenovated}
            onChange={(value) => onFieldChange("yearBuiltRenovated", value)}
            placeholder="e.g. 2018 / 2022"
          />

          <TextInput
            id="tagsInput"
            label="Add Tags"
            value={form.tagsInput}
            onChange={(value) => onFieldChange("tagsInput", value)}
            placeholder="hot property, premium, corner plot"
          />

          <div className="sm:col-span-2">
            <TextareaInput
              id="amenities"
              label="Amenities"
              rows={8}
              value={form.amenities}
              onChange={(value) => onFieldChange("amenities", value)}
              placeholder="Describe amenities, highlights, and features..."
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Bidding & Auction Parameters">
        <div className="grid gap-4 sm:grid-cols-2">
          <CurrencyInput
            id="startingBidAmount"
            label="Starting Bid Amount (₹)"
            value={form.startingBidAmount}
            onChange={(value) => onFieldChange("startingBidAmount", value)}
            placeholder="e.g. 50,00,000"
          />

          <CurrencyInput
            id="bidIncrement"
            label="Bid Increment (₹)"
            value={form.bidIncrement}
            onChange={(value) => onFieldChange("bidIncrement", value)}
            placeholder="e.g. 1,00,000"
          />

          <DateTimeInput
            id="auctionStartDateTime"
            label="Auction Start Date & Time"
            value={form.auctionStartDateTime}
            onChange={(value) => onFieldChange("auctionStartDateTime", value)}
          />

          <DateTimeInput
            id="auctionEndDateTime"
            label="Auction End Date & Time"
            value={form.auctionEndDateTime}
            onChange={(value) => onFieldChange("auctionEndDateTime", value)}
          />
        </div>
      </FormSection>

      <FormSection title="Analytics / Investment Highlights">
        <TextInput
          id="ribbonText"
          label="Ribbon Text"
          value={form.ribbonText}
          onChange={(value) => onFieldChange("ribbonText", value)}
          placeholder="hot property"
        />
      </FormSection>

      <FormSection title="Status & Internal Management">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            id="auctionStatus"
            label="Status"
            value={form.auctionStatus}
            onChange={(value) => onFieldChange("auctionStatus", value)}
            options={AUCTION_STATUSES}
            placeholder="Select"
          />

          <SelectField
            id="exclusiveMandateSoldX"
            label="Exclusive mandate with SoldX"
            value={form.exclusiveMandateSoldX}
            onChange={(value) => onFieldChange("exclusiveMandateSoldX", value)}
            options={YES_NO_OPTIONS}
            placeholder="Select"
          />

          <SelectField
            id="canBrokerBid"
            label="Can Broker Bid"
            value={form.canBrokerBid}
            onChange={(value) => onFieldChange("canBrokerBid", value)}
            options={YES_NO_OPTIONS}
            placeholder="Select"
          />

          <SelectField
            id="assignedAuctionAdvisorId"
            label="Assign to Auction Advisor"
            value={currentLabel}
            onChange={(label) => {
              const id = idByLabel.get(label) ?? "";
              onFieldChange("assignedAuctionAdvisorId", id);
            }}
            options={advisorOptions}
            placeholder="Select broker"
          />
        </div>
      </FormSection>
    </div>
  );
}
