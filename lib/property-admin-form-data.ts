import type { PropertyAdminFormState } from "@/dashboard/components/property/property-admin-state";
import { fromDateTimeLocalValue } from "@/lib/property-form-utils";

function trim(value: string) {
  return value.trim();
}

function parseTagsInput(input: string): string[] {
  return input
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function buildAdminAuctionPayload(form: PropertyAdminFormState) {
  return {
    yearBuiltRenovated: trim(form.yearBuiltRenovated),
    tags: parseTagsInput(form.tagsInput),
    amenities: trim(form.amenities),
    startingBidAmount: trim(form.startingBidAmount),
    bidIncrement: trim(form.bidIncrement),
    auctionStartDateTime: fromDateTimeLocalValue(form.auctionStartDateTime),
    auctionEndDateTime: fromDateTimeLocalValue(form.auctionEndDateTime),
    ribbonText: trim(form.ribbonText),
    auctionStatus: trim(form.auctionStatus),
    exclusiveMandateSoldX: trim(form.exclusiveMandateSoldX),
    canBrokerBid: trim(form.canBrokerBid),
    assignedAuctionAdvisorId: trim(form.assignedAuctionAdvisorId),
  };
}
