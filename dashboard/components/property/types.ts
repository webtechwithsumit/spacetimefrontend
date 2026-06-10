import { PROPERTY_MANAGER_ROLES } from "@/dashboard/constants/property";

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
  sellerId?: PropertySeller | string;
  createdAt?: string;
};

export type PropertiesResponse = {
  success: boolean;
  message?: string;
  data?: DashboardProperty[];
};

export type PropertyResponse = {
  success: boolean;
  message?: string;
  data?: DashboardProperty;
};

export const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-indigo-400 dark:focus:bg-zinc-900 dark:focus:ring-indigo-400/10";

export const labelClass =
  "mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300";

export const cardClass =
  "rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950";

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
