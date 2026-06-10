import {
  ADMIN_ROLES,
  PROPERTY_MANAGER_ROLES,
} from "@/dashboard/constants/property";
import type { PaginatedResponse } from "@/lib/pagination";

export type PropertySeller = {
  _id: string;
  name: string;
  email: string;
  role?: string;
};

export type PropertyLegalDocuments = {
  titleDeed: string[];
  propertyTaxReceipts: string[];
  occupancyCertificate: string[];
  floorPlan: string[];
  approvalsInPlace: string[];
};

export type DashboardProperty = {
  _id: string;
  title: string;
  description?: string;
  images?: string[];
  legalDocuments?: PropertyLegalDocuments | string[];
  flyers?: string[];
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  plotNumber?: string;
  microMarketLocality?: string;
  buildingName?: string;
  roadName?: string;
  category: string;
  buildingType?: string;
  area?: string;
  plotArea?: string;
  plotAreaUnit?: string;
  totalCarpetArea?: string;
  superArea?: string;
  totalFloorsInBuilding?: string;
  floorsOffered?: string;
  totalCarParks?: string;
  carParkingIncluded?: string;
  parkingTypes?: string[];
  constructionStatus?: string;
  ageOfProperty?: string;
  furnishingStatus?: string;
  furnishingOther?: string;
  totalPrice?: string;
  pricePerSqft?: string;
  propertyTax?: string;
  estimatedMonthlyMaintenance?: string;
  status: string;
  occupancyStatus?: string;
  yearBuiltRenovated?: string;
  tags?: string[];
  amenities?: string;
  reservePrice?: string;
  startingBidAmount?: string;
  bidIncrement?: string;
  auctionStartDateTime?: string;
  auctionEndDateTime?: string;
  ribbonText?: string;
  propertyVideoUrl?: string;
  matterportTourUrl?: string;
  auctionStatus?: string;
  exclusiveMandateSoldX?: string;
  canBrokerBid?: string;
  assignedAuctionAdvisorId?: string;
  sellerId?: PropertySeller | string;
  createdAt?: string;
};

export type BrokerOption = {
  _id: string;
  name: string;
  email: string;
};

export type PropertiesResponse = PaginatedResponse<DashboardProperty>;

export type PropertyResponse = {
  success: boolean;
  message?: string;
  data?: DashboardProperty;
};

export {
  cardClass,
  inputClass,
  labelClass,
} from "@/dashboard/components/ui/form-styles";

export function statusClass(status: string) {
  if (status === "Listed") {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  }
  if (status === "Under Auction") {
    return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  }
  if (status === "Sold") {
    return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300";
  }
  return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
}

export function getSellerName(sellerId?: PropertySeller | string) {
  if (!sellerId || typeof sellerId === "string") return "—";
  return sellerId.name;
}

export function isAdminUser(role?: string) {
  return ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number]);
}

export function canEditProperty(
  userRole: string | undefined,
  userId: string | undefined,
  sellerId?: PropertySeller | string,
) {
  if (!PROPERTY_MANAGER_ROLES.includes(userRole ?? "")) return false;
  if (userRole === "Admin" || userRole === "Super-Admin") return true;
  if (!sellerId || !userId) return false;
  const ownerId = typeof sellerId === "string" ? sellerId : sellerId._id;
  return ownerId === userId;
}
