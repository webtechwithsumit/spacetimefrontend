import type { DashboardProperty } from "@/dashboard/components/property/types";
import {
  formatStoredNumber,
  toDateTimeLocalValue,
} from "@/lib/property-form-utils";

export type PropertyAdminFormState = {
  yearBuiltRenovated: string;
  tagsInput: string;
  amenities: string;
  startingBidAmount: string;
  bidIncrement: string;
  auctionStartDateTime: string;
  auctionEndDateTime: string;
  ribbonText: string;
  auctionStatus: string;
  exclusiveMandateSoldX: string;
  canBrokerBid: string;
  assignedAuctionAdvisorId: string;
};

export const emptyPropertyAdminForm = (): PropertyAdminFormState => ({
  yearBuiltRenovated: "",
  tagsInput: "",
  amenities: "",
  startingBidAmount: "",
  bidIncrement: "",
  auctionStartDateTime: "",
  auctionEndDateTime: "",
  ribbonText: "",
  auctionStatus: "",
  exclusiveMandateSoldX: "",
  canBrokerBid: "",
  assignedAuctionAdvisorId: "",
});

export function mapPropertyToAdminForm(
  property: DashboardProperty,
): PropertyAdminFormState {
  return {
    yearBuiltRenovated: property.yearBuiltRenovated ?? "",
    tagsInput: (property.tags ?? []).join(", "),
    amenities: property.amenities ?? "",
    startingBidAmount: formatStoredNumber(property.startingBidAmount),
    bidIncrement: formatStoredNumber(property.bidIncrement),
    auctionStartDateTime: toDateTimeLocalValue(property.auctionStartDateTime),
    auctionEndDateTime: toDateTimeLocalValue(property.auctionEndDateTime),
    ribbonText: property.ribbonText ?? "",
    auctionStatus: property.auctionStatus ?? "",
    exclusiveMandateSoldX: property.exclusiveMandateSoldX ?? "",
    canBrokerBid: property.canBrokerBid ?? "",
    assignedAuctionAdvisorId: property.assignedAuctionAdvisorId ?? "",
  };
}
